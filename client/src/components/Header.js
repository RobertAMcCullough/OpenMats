import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'
import { GoogleApiWrapper } from 'google-maps-react'

import { refreshMap, openModal } from '../actions'

import LogInModal from './LogInModal'
import SignUpModal from './SignUpModal'
import UserAvatar from './UserAvatar'

import breakPoints from '../config/breakPoints'
import geocoder from '../utilities/geocoder'

// const logo = require('../assets/logo.jpg')

class Header extends React.Component {
    state={
        searchTerm: ''
    }

    onSearchSubmit = e => {
        e.preventDefault()

        //this makes sure the map is rerendered on subsequent searches, otherwise it will be centered on the last search
        this.props.refreshMap(true)

        //do geocoding, results are set to localStorage
        let geoConstructor = new window.google.maps.Geocoder()
        geocoder(geoConstructor, this.state.searchTerm, this.props.history)
        this.setState({searchTerm:''})
    }

    renderAddNewButton(){
        //require that user be logged in to add a new open mat
        if(!this.props.user) return <Nav.Link as={Link} to='/' onClick={()=>this.props.openModal('login',true)}>Add A New Open Mat</Nav.Link>
        else return <Nav.Link as={Link} to='/openmats/new'>Add A New Open Mat</Nav.Link>
    }

    renderButtons(){
        const renderSearchBar = () => {
            if(this.props.screenSize > breakPoints.medium){
                return(
                    <form className="form-inline my-2 my-lg-0" onSubmit={e=>this.onSearchSubmit(e)} autoComplete='off'>
                        <input className="form-control mr-sm-2" onChange={e=>{this.setState({'searchTerm':e.target.value})}} value={this.state.searchTerm} type="search" placeholder="Enter Location" aria-label="Search" required></input>
                        <button className="btn btn-outline-success my-2 my-sm-0 mr-4" type="submit">Search</button>
                    </form>
                )
            }
        }

        if(!this.props.user){
            return(
                <>
                    {renderSearchBar()}
                    <LogInModal/>
                    <span className='mx-1'></span>
                    <SignUpModal/>
                </>
            )
        }else{
            return(
                <>
                    {renderSearchBar()}
                    <UserAvatar/>
                </>
            )
        }
    }

    navbarClass(){
        return this.props.screenSize > breakPoints.small ? 'mb-4' : 'mb-2'
    }

    render(){
        return(
            <div className={this.navbarClass()}>
                <Navbar sticky='top' expand='md'>
                    <Navbar.Brand as={Link} to='/'>
                        {/* <img alt='' src={logo} width='50' height='50' className='d-inline-block'/>
                        {' '} */}
                        OpenMats.org
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className='mr-auto'>
                            {this.renderAddNewButton()}
                        </Nav>
                        <Nav>
                            {this.renderButtons()}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return({
        screenSize: state.screenSize,
        user: state.user
    })
}

export default connect(mapStateToProps, { refreshMap, openModal})(GoogleApiWrapper({apiKey:process.env.REACT_APP_googleMapsAPIKey})(Header))