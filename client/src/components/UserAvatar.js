import React from 'react'
import { connect } from 'react-redux'
import { NavDropdown, Dropdown, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import breakPoints from '../config/breakPoints'

// const defaultPhoto = 'https://i.imgur.com/V5uVYsb.png'
const defaultPhoto = require('../assets/missing-avatar.png')

class UserAvatar extends React.Component{
    
    avatar = (
        <Link className='d-flex align-items-center' to='/profile'>
            <img alt='Profile' id='profilePictureAvatar' style={{height:'2.5rem', width:'2.5rem', objectFit:'cover', borderRadius:'100px'}} src={this.props.user.photo ? this.props.user.photo : defaultPhoto} onError={()=>{document.getElementById('profilePictureAvatar').src=defaultPhoto;document.getElementById('profilePictureAvatar').onerror=null}}/>
        </Link>
    )

    renderMobileComponent(){
        return(
            <>
            <Nav.Link as={Link} to='/advancedSearch'>Search</Nav.Link>
            {/* <Nav.Link as={Link} to='/profile'>Profile</Nav.Link>
            <Nav.Link as={Link} to='/settings'>Settings</Nav.Link> */}
            <Nav.Link href='/auth/logout'>Log Out {this.props.user.first_name || this.props.user.username}</Nav.Link>
            </>
        )
    }

    renderDesktopComponent(){
        return(
            <div className='d-flex'>
                {this.avatar}
                <NavDropdown style={{textTransform:'capitalize'}} title={this.props.user.first_name ? this.props.user.first_name : 'User'}>
                    {/* <Dropdown.Item as={Link} to='/profile'>Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item> */}
                    <Dropdown.Item href='/advancedSearch'>Search</Dropdown.Item>
                    <Dropdown.Item href='/auth/logout'>Log Out {this.props.user.first_name || this.props.user.username}</Dropdown.Item>
                </NavDropdown>
            </div>
        )
    }

    render(){
        return(
            <div>
                {this.props.screenSize > breakPoints.small ? this.renderDesktopComponent() : this.renderMobileComponent()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return({
        user: state.user,
        screenSize: state.screenSize
    })
}

export default connect(mapStateToProps, null)(UserAvatar)