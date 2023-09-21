import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

import { openModal } from '../actions'

axios.defaults.withCredentials = true;

class SignUpModal extends React.Component {
    state = {
        userRegister: {},
        showWarning: false
    }

    onSubmit = async ()=> {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, this.state.userRegister); 
            this.props.openModal('signup', false); 
            this.props.history.go(0) 
        }
         catch (e){
            this.setState({showWarning: true})
        }
    }


    render(){
        return(
            <>
            <Button className='my-1' variant="primary" onClick={()=>this.props.openModal('signup', true)}>
              Sign Up
            </Button>
      
            <Modal show={this.props.isOpen} onHide={()=>this.props.openModal('signup', false)} size='md'>
                <Modal.Body>
                    <div className='text-center' style={{width:'60%', margin:'0 auto'}}>                                    
                        <h1 className='mt-4 mb-3'>Sign Up</h1>
                        <p className='mb-4'>Welcome. Sign up below.</p>
                        {/* <a className="btn btn-block btn-social btn-google text-center" href='/auth/google'><span className="fab fa-google"></span> Sign up with Google</a>
                        <a className="btn btn-block btn-social btn-twitter text-center" href='/auth/twitter'><span className="fab fa-twitter"></span> Sign up with Twitter</a> */}
                        {/* <a className="btn btn-block btn-social btn-facebook text-center" href='/auth/facebook'><span className="fab fa-facebook-f"></span> Sign up with Facebook</a> */}
                        {/* <div className='mt-4 mb-4'>
                            <p className='hr-centered'><span>OR</span></p>
                        </div> */}
                        {/* <form method='post' action={`${process.env.REACT_APP_API_URL}/auth/register`} autoComplete='off'>
                            <div className='form-group'> */}
                        <div>
                            <div className='form-group'>
                                <input className='form-control' name='username' type='text' placeholder='Username' required value={this.state.userRegister.username} onChange={e=>{let obj = this.state.userRegister; obj.username=e.target.value; this.setState({userRegister:obj, showWarning: false})}}/>
                            </div>
                            <div className='form-group'>
                                <input className='form-control' name='passworda' type='password' placeholder='Password' required value={this.state.userRegister.password} onChange={e=>{let obj = this.state.userRegister; obj.password=e.target.value; this.setState({userRegister:obj, showWarning: false})}}/>
                            </div>
                            <div className='form-group'>
                                    <input className='form-control' name='firstName' type='text' placeholder='First Name' required value={this.state.userRegister.firstName} onChange={e=>{let obj = this.state.userRegister; obj.firstName=e.target.value; this.setState({userRegister:obj, showWarning: false})}}/>
                                </div>
                            <button className='btn btn-primary' onClick={() => this.onSubmit()} style={{width:'100%'}}>Sign Up</button>
                        </div>
                        <div style={{margin:'20px'}}><button className='button-link' style={{cursor:'pointer'}} onClick={()=>this.props.openModal('login',true)}>Already have an account?</button></div>
                        {this.state.showWarning && (
                            <div className='mb-4 text-danger'>Username Already Exists</div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return({
        isOpen: state.openModal.signup
    })
}

export default connect(mapStateToProps,{openModal})(withRouter(SignUpModal))

