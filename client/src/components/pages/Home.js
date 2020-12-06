import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { GoogleApiWrapper } from 'google-maps-react'

import { refreshMap, fetchTotals } from '../../actions'
import geocoder from '../../utilities/geocoder'

class Home extends React.Component {
    state = {searchTerm : ''}

    componentDidMount(){
        document.title = "OpenMats.org | Search"
        //fetch total numbers of gyms, mats, states
        this.props.fetchTotals();
        // localStorage.setItem('searchTerm', '')
        // localStorage.setItem('searchStatus', '')
        // localStorage.setItem('lat', null)
        // localStorage.setItem('lng', null)
    }

    submitSearch = e => {
        e.preventDefault()

        //this makes sure the map is rerendered on subsequent searches, otherwise it will be centered on the last search
        this.props.refreshMap(true)

        //do geocoding, results are set to localStorage
        let geoConstructor = new window.google.maps.Geocoder()
        geocoder(geoConstructor, this.state.searchTerm, this.props.history)
    }

    render(){
        return(
            <div className="jumbotron bg-cover text-center background">
                <h1 className={this.props.screenSize < 410 ? 'display-5' :'display-4'}>Welcome to OpenMats.org</h1>
                <p className="lead mt-3" style={{fontWeight:'400'}}>Working hard to become the internet's largest database of Brazilian Jiu Jitsu open mats.</p>
                {/* <p className="lead mt-3">(Please help us by adding your gym!)</p> */}
                <Link to="/allgyms" className="lead mt-3 font-weight-bold">Currently {this.props.totals.mats} open mats at {this.props.totals.gyms} gyms in {this.props.totals.states} cities.</Link>
                <p className="lead text-danger mt-3 mb-5 font-weight-bold">Many gyms currently have restrictions around COVID-19, please call or email before arriving.</p>
                {/* <p className="lead mt-3">All listings have been updated to reflect COVID-19 changes.</p> */}
                {/* <hr className="my-4"></hr> */}
                <form className="form my-2 my-lg-0 justify-content-center mx-auto" style={{maxWidth:'600px'}} value={this.state.searchTerm} onChange={e=>{this.setState({searchTerm:e.target.value})}} onSubmit={e=>{this.submitSearch(e)}}>
                    <input className="form-control form-control-lg mr-sm-2" type="search" placeholder={this.props.screenSize > 500 ? "Enter a location to search for open mats..." : "Enter a search location..."} aria-label="Search" required></input>
                    <button className="btn btn-lg btn-primary my-3" type="submit">Search</button>
                </form>
                <Link to='/advancedSearch' style={{fontWeight:'600'}}>Advanced Search Options</Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return({
        screenSize: state.screenSize,
        totals: state.totals
    })
}

const googleMapsKey = process.env.NODE_ENV==='production' ? process.env.REACT_APP_googleMapsAPIKey : process.env.REACT_APP_googleMapsAPIKey_dev

export default connect(mapStateToProps,{ refreshMap, fetchTotals })(GoogleApiWrapper({apiKey:googleMapsKey})(Home))