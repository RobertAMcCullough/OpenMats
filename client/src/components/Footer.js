import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from 'react-bootstrap'

class Footer extends React.Component {
    render(){
        return(
            <Navbar sticky='bottom'>
                <Link to='/about'>About</Link>
                <span className='mx-3'>|</span>
                <Link className='mx-3' to='/openmats'>Results </Link>
                <Link className='mx-3' to='/advancedSearch'>Advanced Search</Link>
                <Link className='mx-3' to='/openmats/new'>New</Link>
            </Navbar>
        )
    }
}

export default Footer