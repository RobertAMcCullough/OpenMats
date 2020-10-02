import React from 'react'
import { connect } from 'react-redux'
import { GoogleApiWrapper } from 'google-maps-react'

import { showGym, updateGym, resetMatId } from '../../actions'
import breakPoints from '../../config/breakPoints'
import usStates from '../../config/usStates'

import ConfirmDeleteModal from '../ConfirmDeleteModal'

class UpdateGym extends React.Component {
    //state holds all the form data
    state = {
        gym : {
            name: '',
            street: '',
            city: '',
            state: '',
            phone: '',
            photo: '',
            website: '',
            lat: '',
            lng: ''
        }
    }

    //this will be set to true once the gym details are set to state in component did update     
    gymDetailsSetToState = false

    componentDidMount(){
        document.title = "OpenMats.org | Edit"
        this.props.showGym(this.props.match.params.id)
    }

    componentDidUpdate(){
        //update title after fetching data if it hasn't already been updated
        if(document.title==='OpenMats.org | Edit' && this.props.gym && this.props.gym[0].name) document.title = `OpenMats.org | Edit ${this.props.gym[0].name}`
        //sets the contents of gym details to state once gym details is loaded and it's not the id of any previously loaded data

        if(!this.gymDetailsSetToState && this.props.gym && this.props.gym[0].gym_id===parseInt(this.props.match.params.id)){
            //set the values from the gym to state
            let obj = {}
            for(const val in this.state.gym){
                if(this.props.gym[0][val]){ //prevents null values from being set to state
                    obj[val] = this.props.gym[0][val]
                }else(
                    obj[val] = ''
                )
            }
            this.setState({gym:obj})
            this.gymDetailsSetToState=true
        }
    }

    onFormSubmit = e => {
        e.preventDefault()

        //if location has changed, perform geocoding:
        if(this.state.gym.street!==this.props.gym[0].street || this.state.gym.city!==this.props.gym[0].city || this.state.gym.state!==this.props.gym[0].state){
            //perform geocoding to find lat and lng of new gym
            let geocoder = new window.google.maps.Geocoder()

            geocoder.geocode({address: `${this.state.gym.street}, ${this.state.gym.city}, ${this.state.gym.state}`}, (res, status)=>{
                if(status==='OK'){ //prevents error if google cannot find a location associated with search term
                    let obj = this.state.gym
                    obj.lat = res[0].geometry.location.lat()
                    obj.lng = res[0].geometry.location.lng()
                    this.setState({gym:obj})
                    //update gym
                    this.props.updateGym({...this.state.gym, id: this.props.gym[0].gym_id})
                }else{
                    alert('Error with finding location - please check street address and city')
                }
            })
        }else{
            //if no geocoding needed, still update gym
            this.props.updateGym({...this.state.gym, id: this.props.gym[0].gym_id})
        }

        // wait till newly updated gym has been returned from database, then redirect there
        let interval = setInterval(()=>{
            if(this.props.newMatId){
                this.props.history.push(`/gyms/${this.props.gym[0].gym_id}`)
                //now set newMatId back to null for next time this is run
                this.props.resetMatId()
                //now end setInterval
                clearInterval(interval)
            }
        },20)
    }

    renderLargeForm(){        
        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='name'>Name of Gym:</label>
                            <input required className='form-control' type='text' placeholder='(required)' id='name' value={this.state.gym.name} onChange={e=>{let obj = this.state.gym; obj.name=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'55%'}} className='form-group'>
                            <label htmlFor='street'>Street Address:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='street' value={this.state.gym.street} onChange={e=>{let obj = this.state.gym; obj.street=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='City'>City:</label>
                            <input required className='form-control' type='text' placeholder='(required)' id='city' value={this.state.gym.city} onChange={e=>{let obj = this.state.gym; obj.city=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'17%'}} className='form-group'>
                            <label htmlFor='state'>State:</label>
                            <select required className='form-control' id='state' value={this.state.gym.state} onChange={e=>{let obj = this.state.gym; obj.state=e.target.value; this.setState({gym:obj})}}>
                                <option value='' disabled defaultValue>(required)</option>
                                {usStates.map(el=><option key={el}>{el}</option>)}
                            </select>
                        </div>
                        <div style={{flexBasis:'33%'}} className='form-group'>
                            <label htmlFor='phone'>Phone:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='phone' value={this.state.gym.phone} onChange={e=>{let obj = this.state.gym; obj.phone=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='website'>Website:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='website' value={this.state.gym.website} onChange={e=>{let obj = this.state.gym; obj.website=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'55%'}} className='form-group'>
                            <label htmlFor='photo'>Enter the URL of a photo for this gym:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='photo' value={this.state.gym.photo} onChange={e=>{let obj = this.state.gym; obj.photo=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <ConfirmDeleteModal createdBy={this.props.gym[0].gym_created_by} gym={this.props.gym[0]}/>
                        <button className='btn btn-primary'>Submit</button>
                    </div>
                </form>
            </div>
        )
    }
    

    renderMediumForm(){        
        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='name'>Name of Gym:</label>
                            <input required className='form-control' type='text' placeholder='(required)' id='name' value={this.state.gym.name} onChange={e=>{let obj = this.state.gym; obj.name=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'55%'}} className='form-group'>
                            <label htmlFor='street'>Street Address:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='street' value={this.state.gym.street} onChange={e=>{let obj = this.state.gym; obj.street=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='City'>City:</label>
                            <input required className='form-control' type='text' placeholder='(required)' id='city' value={this.state.gym.city} onChange={e=>{let obj = this.state.gym; obj.city=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'17%'}} className='form-group'>
                            <label htmlFor='state'>State:</label>
                            <select required className='form-control' id='state' value={this.state.gym.state} onChange={e=>{let obj = this.state.gym; obj.state=e.target.value; this.setState({gym:obj})}}>
                                <option value='' disabled defaultValue>(required)</option>
                                {usStates.map(el=><option key={el}>{el}</option>)}
                            </select>
                        </div>
                        <div style={{flexBasis:'33%'}} className='form-group'>
                            <label htmlFor='phone'>Phone:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='phone' value={this.state.gym.phone} onChange={e=>{let obj = this.state.gym; obj.phone=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'40%'}} className='form-group'>
                            <label htmlFor='website'>Website:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='website' value={this.state.gym.website} onChange={e=>{let obj = this.state.gym; obj.website=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'55%'}} className='form-group'>
                            <label htmlFor='photo'>Enter the URL of a photo for this gym:</label>
                            <input className='form-control' type='text' placeholder='(optional)' id='photo' value={this.state.gym.photo} onChange={e=>{let obj = this.state.gym; obj.photo=e.target.value; this.setState({gym:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <ConfirmDeleteModal createdBy={this.props.gym[0].gym_created_by} gym={this.props.gym[0]}/>
                        <button className='btn btn-primary'>Submit</button>
                    </div>
                </form>
            </div>
        )
    }
    
 
    renderSmallForm(){
        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    <div className='form-group'>
                        <label htmlFor='name'>Name of gym:</label>
                        <input required className='form-control' type='text' placeholder='Enter name of gym' id='name' value={this.state.gym.name} onChange={e=>{let obj = this.state.gym; obj.name=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='street'>Street:</label>
                        <input className='form-control' type='text' placeholder='Enter street address (optional)' id='street' value={this.state.gym.street} onChange={e=>{let obj = this.state.gym; obj.street=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='City'>City:</label>
                        <input required className='form-control' type='text' placeholder='Enter City' id='city' value={this.state.gym.city} onChange={e=>{let obj = this.state.gym; obj.city=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='state'>State:</label>
                        <select required className='form-control' id='state' value={this.state.gym.state} onChange={e=>{let obj = this.state.gym; obj.state=e.target.value; this.setState({gym:obj})}}>
                            <option value='' disabled defaultValue>Choose State</option>
                            {usStates.map(el=><option key={el}>{el}</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone:</label>
                        <input className='form-control' type='text' placeholder='Enter phone (optional)' id='phone' value={this.state.gym.phone} onChange={e=>{let obj = this.state.gym; obj.phone=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='website'>Website:</label>
                        <input className='form-control' type='text' placeholder='(optional)' id='website' value={this.state.gym.website} onChange={e=>{let obj = this.state.gym; obj.website=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='photo'>Photo URL:</label>
                        <input className='form-control' type='text' placeholder='Enter photo url (optional)' id='photo' value={this.state.gym.photo} onChange={e=>{let obj = this.state.gym; obj.photo=e.target.value; this.setState({gym:obj})}}></input>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <ConfirmDeleteModal createdBy={this.props.gym[0].gym_created_by} gym={this.props.gym[0]}/>
                        <button className='btn btn-primary'>Submit</button>
                    </div>
                </form>
            </div>
        )
    }

    renderForm(){
        if(!this.props.gym || !this.props.gym[0].name) return null
        if(this.props.screenSize>breakPoints.medium) return this.renderLargeForm()
        if(this.props.screenSize>breakPoints.small) return this.renderMediumForm()
        else return this.renderSmallForm()
    }

    render(){
        return(
            <div>
                <h3 className='my-5 text-center display-4'>Edit Gym</h3>
                {this.renderForm()}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return({
        screenSize: state.screenSize,
        gym: state.gymDetails,
        user: state.user,
        newMatId: state.newMatId
    })
}

const googleMapsKey = process.env.NODE_ENV==='production' ? process.env.REACT_APP_googleMapsAPIKey : process.env.REACT_APP_googleMapsAPIKey_dev

export default connect(mapStateToProps,{ showGym, updateGym, resetMatId })(GoogleApiWrapper({apiKey:googleMapsKey})(UpdateGym))





