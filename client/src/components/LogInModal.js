import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'

import { openModal } from '../actions'

axios.defaults.withCredentials = true;

class LogInModal extends React.Component {
    state = {
        userLogin: {},
        showWarning: false
    }

    onSubmit = async ()=> {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, this.state.userLogin); 
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
            <Button className='my-1' variant="primary" onClick={()=>this.props.openModal('login', true)}>
              Log in
            </Button>
      
            <Modal show={this.props.isOpen} onHide={()=>this.props.openModal('login', false)} size='md'>
                <Modal.Body>
                    <div className='text-center' style={{width:'60%', margin:'0 auto'}}>                                    
                        <h1 className='mt-4 mb-3'>Log In</h1>
                        <p className='mb-4'>Welcome back. Log in below.</p>
                        {/* <a className="btn btn-block btn-social btn-google text-center" href='/auth/google'><span className="fab fa-google"></span> Log in with Google</a>
                        <a className="btn btn-block btn-social btn-twitter text-center" href='/auth/twitter'><span className="fab fa-twitter"></span> Log in with Twitter</a> */}
                        {/* <a className="btn btn-block btn-social btn-facebook text-center" href='/auth/facebook'><span className="fab fa-facebook-f"></span> Log in with Facebook</a> */}
                        {/* <div className='mt-4 mb-4'>
                            <p className='hr-centered'><span>OR</span></p>
                        </div> */}
                        <div>
                            <div className='form-group'>
                                <input className='form-control' name='username' type='text' placeholder='Username' required value={this.state.userLogin.username} onChange={e=>{let obj = this.state.userLogin; obj.username=e.target.value; this.setState({userLogin:obj, showWarning: false})}}/>
                            </div>
                            <div className='form-group'>
                                <input className='form-control' name='passworda' type='password' placeholder='Password' required value={this.state.userLogin.password} onChange={e=>{let obj = this.state.userLogin; obj.password=e.target.value; this.setState({userLogin:obj, showWarning: false})}}/>
                            </div>
                            <button className='btn btn-primary' onClick={() => this.onSubmit()} style={{width:'100%'}}>Log In</button>
                        </div>
                        <div style={{margin:'20px'}}><button className='button-link' style={{cursor:'pointer'}} onClick={()=>this.props.openModal('signup',true)}>Need to create an account?</button></div>
                        {this.state.showWarning && (
                            <div className='mb-4 text-danger'>Invalid Credentials</div>
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
        isOpen: state.openModal.login
    })
}

export default connect(mapStateToProps,{openModal})(LogInModal)