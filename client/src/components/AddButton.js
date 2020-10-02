//for adding a new open mat

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { openModal } from '../actions'

class AddButton extends React.Component {


    onButtonClick = (e) => {
        e.preventDefault()
        //if a user is logged in, let them add
        if(this.props.user){
            this.props.history.push(`/openmats/${this.props.gymId}/new`)
        }
        //if a user is not logged in, send them to login screen
        else this.props.openModal('login',true)
    }

    render(){
        return(
            <button className='btn btn-primary btn-sm' onClick={this.onButtonClick}><span className='fa fa-plus mr-2'></span>{this.props.buttonText ? this.props.buttonText : 'Edit'}</button>
        )
    }
}

const mapStateToProps = state => {
    return({
        user: state.user
    })
}

export default connect(mapStateToProps,{openModal})(withRouter(AddButton))