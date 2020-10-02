import React from 'react'
import { connect } from 'react-redux'

import { openModal } from '../../actions'

class FailedLogin extends React.Component{
    render(){
        return(
            <div>
                <hr></hr>
                Incorrect username or password. Please click <button className='button-link' onClick={()=>this.props.openModal('login',true)}>here</button> to try again.
            </div>
        )
    }
}

export default connect(null,{openModal})(FailedLogin)