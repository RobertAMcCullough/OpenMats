import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { openModal } from '../actions'

class EditButton extends React.Component {


    onButtonClick = (e) => {
        e.preventDefault()
        //if a user is logged in, let them update
        if(this.props.user){
            //edit button is used for both mats and gyms
            this.props.matId ? this.props.history.push(`/openmats/${this.props.matId}/edit`) : this.props.history.push(`/gyms/${this.props.gymId}/edit`)
        }
        //if a user is not logged in, send them to login screen
        else this.props.openModal('login',true)
    }

    render(){
        return(
            <button type='button' className={`btn btn-warning btn-sm ${this.props.formatting}`} onClick={this.onButtonClick}><span className='fa fa-pencil mr-2'></span>{this.props.buttonText ? this.props.buttonText : 'Edit'}</button>
        )
    }
}

const mapStateToProps = state => {
    return({
        user: state.user
    })
}

export default connect(mapStateToProps,{openModal})(withRouter(EditButton))