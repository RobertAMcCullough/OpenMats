import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'

import { openModal } from '../actions'

class LogInModal extends React.Component {

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
                        <a className="btn btn-block btn-social btn-google text-center" href='/auth/google'><span className="fab fa-google"></span> Sign up with Google</a>
                        {/* <a className="btn btn-block btn-social btn-twitter text-center" href='/auth/twitter'><span className="fab fa-twitter"></span> Sign up with Twitter</a> */}
                        {/* <a className="btn btn-block btn-social btn-facebook text-center" href='/auth/facebook'><span className="fab fa-facebook-f"></span> Sign up with Facebook</a> */}
                        <div className='mt-4 mb-4'>
                            <p className='hr-centered'><span>OR</span></p>
                        </div>
                        <form method='post' action='/auth/signup' autoComplete='off'>
                            <div className='form-group'>
                                <input className='form-control' name='username' type='text' placeholder='Username' required/>
                            </div>
                            <div className='form-group'>
                                <input className='form-control' name='password' type='password' placeholder='Password' required/>
                            </div>
                            <div className='form-group'>
                                    <input className='form-control' name='firstName' type='text' placeholder='First Name'/>
                                </div>
                            <button className='btn btn-primary' type='submit' style={{width:'100%'}}>Sign Up</button>
                        </form>
                        <div style={{marginTop:'20px'}}><button className='button-link' style={{cursor:'pointer'}} onClick={()=>this.props.openModal('login',true)}>Already have an account?</button></div>
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

export default connect(mapStateToProps,{openModal})(LogInModal)