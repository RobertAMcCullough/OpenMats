//adds new mat to gym specified in params

import React from 'react'
import { connect } from 'react-redux'
import { GoogleApiWrapper } from 'google-maps-react'

import { createOpenmat, createGym, resetMatId, getGyms } from '../../actions'
import breakPoints from '../../config/breakPoints'
import usStates from '../../config/usStates'
import days from '../../config/days'

class Create extends React.Component {
    //state holds all the form data
    state = {
        gym : {
            name: '',
            street: '',
            city: '',
            state: '',
            phone: '',
            photo: '',
            lat: '',
            lng: ''
        },
        openmat: {
            day: '',
            time: '',
            cost: '',
            call_first: '',
            size: '',
            gi_nogi: '',
            notes: ''
        },
        selectedGym: 0, //this will be 0 till the user either selects a previously entered gym or selects to create a new one. if a previously entered gym is selected, its id will be set here. if a new one is to be created, it will be set to -1
        selectedGymName: '' //this is the name of the selected gym (when state.selectedGym > 0)
    }

    componentDidMount(){
        document.title = "OpenMats.org | Add New Open Mat"
        this.props.getGyms()
        this.setState({selectedGym:parseInt(this.props.match.params.id)})
        //find the name of the selected gym and set it to state
        this.props.gyms.forEach(el=>{
            if(el.id===parseInt(this.props.match.params.id)) this.setState({selectedGymName:el.name})
        })
    }

    onFormSubmit = e => {
        e.preventDefault()

        //if a new gym is to be created:
        if(this.state.selectedGym===-1){
            //perform geocoding to find lat and lng of new gym
            let geocoder = new window.google.maps.Geocoder()

            geocoder.geocode({address: `${this.state.gym.street}, ${this.state.gym.city}, ${this.state.gym.state}`}, (res, status)=>{
                if(status==='OK'){ //prevents error if google cannot find a location associated with search term
                    let obj = this.state.gym
                    obj.lat = res[0].geometry.location.lat()
                    obj.lng = res[0].geometry.location.lng()
                    this.setState({gym:obj})
                    //this creates a new gym and then creates a new openmat to go with it
                    this.props.createGym(this.state.gym, this.state.openmat)
                }else{
                    alert('Error with finding location - please check street address and city')
                }
            })
        }else{
            //if new gym isn't to be created, just create openmat
            this.props.createOpenmat({...this.state.openmat, gym_id:this.state.selectedGym})
        }

        // wait till newly created/updated mat has been returned from database, then redirect there
        let interval = setInterval(()=>{
            if(this.props.newMatId){
                this.props.history.push(`/openmats/${this.props.newMatId}`)
                //now set newMatId back to null for next time this is run
                this.props.resetMatId()
                //now end setInterval
                clearInterval(interval)
            }
        },20)

    }

    //lists all the previously created gyms to choose from
    renderGymOptions(){
        if(this.props.gyms){
            return this.props.gyms.map(el=><option key={el.id} value={el.id}>{`${el.city}, ${el.state} -  ${el.name}`}</option>)
        }
    }

    onSelectedGymChange = e =>{
        this.setState({selectedGym:parseInt(e.target.value)})
        //now find the name of the selected gym and set it to state
        this.props.gyms.forEach(el=>{
            if(el.id===parseInt(e.target.value)) this.setState({selectedGymName:el.name})
        })
    }

    //gives the options to choose from a previously entered gym or creat a new one
    renderSelectGymButton(){
        return(
            <div className='mx-auto' style={this.props.screenSize > breakPoints.medium ? {width:'70%'} : {width:'100%'}}>
                <div className='d-flex align-items-start justify-content-around'>
                    <form style={this.props.screenSize > breakPoints.medium ? {flex:'2'} : {flex:'3'}} className='' onSubmit={e=>e.preventDefault()} autoComplete='off'>
                        <div className='form-group'>
                            <select required className='form-control' type='text' id='chooseGym' value={this.state.selectedGym} onChange={e=>{this.onSelectedGymChange(e)}}>
                            {/* <select required className='form-control' type='text' id='chooseGym' value={this.state.selectedGym} onChange={e=>{this.setState({selectedGym:parseInt(e.target.value)})}}> */}
                                <option value={0} disabled defaultValue>{this.props.screenSize < 500 ? 'Existing Gym' : 'Choose An Existing Gym'}</option>
                                <option value={-1}>Add A New Gym</option>
                                {this.renderGymOptions()}
                            </select>
                        </div>
                    </form>
                    <h5 style={{flex:'1'}} className='text-center pt-1'>OR</h5>
                    <button className='btn btn-primary' style={this.props.screenSize > breakPoints.medium ? {flex:'1'} : {flex:'2'}} onClick={()=>this.setState({selectedGym:-1})}>{this.props.screenSize < 374 ? 'New Gym' : 'Add New Gym'}</button>

                    {/* <div className='d-flex justify-content-center' style={this.props.screenSize > breakPoints.medium ? {flex:'1'} : {flex:'2'}}>
                        <button className='btn btn-primary' onClick={()=>this.setState({selectedGym:-1})}>Add New Gym</button>
                    </div>                 */}
                </div>
            </div>
        )
    }

    renderLargeForm(){        
        //These parts of the form are only displayed when entering a new gym
        const newGymFields = (
            <>
            <h4 className='text-center mt-4'>Gym Details:</h4>
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
                    <label htmlFor='photo'>Enter the URL for a photo for this gym:</label>
                    <input className='form-control' type='text' placeholder='(optional)' id='photo' value={this.state.gym.photo} onChange={e=>{let obj = this.state.gym; obj.photo=e.target.value; this.setState({gym:obj})}}></input>
                </div>
            </div>
            </>
        )

        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    {this.state.selectedGym === -1 ? newGymFields : null}
                    {this.state.selectedGym > 0 ? <h4 className='text-center my-4'>Add an Open Mat at {this.state.selectedGymName}:</h4> : <h4 className='text-center my-3'>Open Mat Details:</h4>}
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='day'>Day of the week:</label>
                            <select required className='form-control' id='day' value={this.state.openmat.day} onChange={e=>{let obj = this.state.openmat; obj.day=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(required)</option>
                                {days.map(el=><option key={el}>{el}</option>)}
                            </select>
                        </div>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='time'>Time:</label>
                            <input required className='form-control' placeholder='Required' type='time' id='time' value={this.state.openmat.time} onChange={e=>{let obj = this.state.openmat; obj.time=e.target.value; this.setState({openmat:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='cost'>Cost:</label>
                            <input className='form-control' type='number' placeholder='(optional)' id='cost' min='0' inputMode='decimal' value={this.state.openmat.cost} onChange={e=>{let obj = this.state.openmat; obj.cost=e.target.value; this.setState({openmat:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='call_first'>Should people call first?</label>
                            <select className='form-control' id='call_first' value={this.state.openmat.call_first} onChange={e=>{let obj = this.state.openmat; obj.call_first=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value={0}>No need, just show up!</option>
                                <option value={1}>Yes</option>
                            </select>
                        </div>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='size'>How many people are usually there?</label>
                            <select className='form-control' id='size' value={this.state.openmat.size} onChange={e=>{let obj = this.state.openmat; obj.size=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value='S'>Small (Less than 10 people)</option>
                                <option value='M'>Medium (10-20 people)</option>
                                <option value='L'>Large (20-30 people)</option>
                                <option value='XL'>Huge (30+ people)</option>
                            </select>
                        </div>
                        <div style={{flexBasis:'30%'}} className='form-group'>
                            <label htmlFor='gi_nogi'>Gi or Nogi:</label>
                            <select className='form-control' id='gi_nogi' value={this.state.openmat.gi_nogi} onChange={e=>{let obj = this.state.openmat; obj.gi_nogi=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value={1}>Gi</option>
                                <option value={2}>Nogi</option>
                                <option value={3}>Both</option>
                                <option value={4}>Alternates</option>
                            </select>
                        </div>
                    </div>                    
                    <div className='form-group'>
                        <label htmlFor='notes'>Notes:</label>
                        <input className='form-control' type='text' placeholder='Anything we should know first?' id='notes' value={this.state.openmat.notes} onChange={e=>{let obj = this.state.openmat; obj.notes=e.target.value; this.setState({openmat:obj})}}></input>
                    </div>
                    <button className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }

    renderMediumForm(){        
        //These parts of the form are only displayed when entering a new gym
        const newGymFields = (
            <>
            <h4 className='text-center mt-4'>Gym Details:</h4>
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
                    <label htmlFor='photo'>Enter the URL for a photo for this gym:</label>
                    <input className='form-control' type='text' placeholder='(optional)' id='photo' value={this.state.gym.photo} onChange={e=>{let obj = this.state.gym; obj.photo=e.target.value; this.setState({gym:obj})}}></input>
                </div>
            </div>
            </>
        )

        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    {this.state.selectedGym === -1 ? newGymFields : null}
                    {this.state.selectedGym > 0 ? <h4 className='text-center my-4'>Add an Open Mat at {this.state.selectedGymName}:</h4> : <h4 className='text-center my-3'>Open Mat Details:</h4>}
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='day'>Day of the week:</label>
                            <select required className='form-control' id='day' value={this.state.openmat.day} onChange={e=>{let obj = this.state.openmat; obj.day=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(required)</option>
                                {days.map(el=><option key={el}>{el}</option>)}
                            </select>
                        </div>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='time'>Time:</label>
                            <input required className='form-control' placeholder='Required' type='time' id='time' value={this.state.openmat.time} onChange={e=>{let obj = this.state.openmat; obj.time=e.target.value; this.setState({openmat:obj})}}></input>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='cost'>Cost:</label>
                            <input className='form-control' type='number' placeholder='(optional)' id='cost' min='0' inputMode='decimal' value={this.state.openmat.cost} onChange={e=>{let obj = this.state.openmat; obj.cost=e.target.value; this.setState({openmat:obj})}}></input>
                        </div>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='call_first'>Should people call first?</label>
                            <select className='form-control' id='call_first' value={this.state.openmat.call_first} onChange={e=>{let obj = this.state.openmat; obj.call_first=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value={0}>No need, just show up!</option>
                                <option value={1}>Yes</option>
                            </select>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='size'>How many people are usually there?</label>
                            <select className='form-control' id='size' value={this.state.openmat.size} onChange={e=>{let obj = this.state.openmat; obj.size=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value='S'>Small (Less than 10 people)</option>
                                <option value='M'>Medium (10-20 people)</option>
                                <option value='L'>Large (20-30 people)</option>
                                <option value='XL'>Huge (30+ people)</option>
                            </select>
                        </div>
                        <div style={{flexBasis:'45%'}} className='form-group'>
                            <label htmlFor='gi_nogi'>Gi or Nogi:</label>
                            <select className='form-control' id='gi_nogi' value={this.state.openmat.gi_nogi} onChange={e=>{let obj = this.state.openmat; obj.gi_nogi=e.target.value; this.setState({openmat:obj})}}>
                                <option value='' disabled defaultValue>(optional)</option>
                                <option value={1}>Gi</option>
                                <option value={2}>Nogi</option>
                                <option value={3}>Both</option>
                                <option value={4}>Alternates</option>
                            </select>
                        </div>
                    </div>                    
                    <div className='form-group'>
                        <label htmlFor='notes'>Notes:</label>
                        <input className='form-control' type='text' placeholder='Anything we should know first?' id='notes' value={this.state.openmat.notes} onChange={e=>{let obj = this.state.openmat; obj.notes=e.target.value; this.setState({openmat:obj})}}></input>
                    </div>
                    <button className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }
 
    renderSmallForm(){
        //These parts of the form are only displayed when entering a new gym
        const newGymFields = (
            <>
            <h4 className='text-center mt-4'>Details of New Gym:</h4>
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
            </>
        )

        return(
            <div>
                <form onSubmit={e=>this.onFormSubmit(e)} autoComplete='off'>
                    {this.state.selectedGym === -1 ? newGymFields : null}
                    {this.state.selectedGym > 0 ? <h4 className='text-center my-4'>Add an Open Mat at {this.state.selectedGymName}:</h4> : <h4 className='text-center my-3'>Open Mat Details:</h4>}
                    <div className='form-group'>
                        <label htmlFor='day'>Day of the week:</label>
                        <select required className='form-control' id='day' value={this.state.openmat.day} onChange={e=>{let obj = this.state.openmat; obj.day=e.target.value; this.setState({openmat:obj})}}>
                            <option value='' disabled defaultValue>Choose day of the week</option>
                            {days.map(el=><option key={el}>{el}</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='time'>Time:</label>
                        <input required className='form-control' type='time' id='time' value={this.state.openmat.time} onChange={e=>{let obj = this.state.openmat; obj.time=e.target.value; this.setState({openmat:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='cost'>Cost:</label>
                        <input className='form-control' type='number' placeholder='Enter Cost' id='cost' min='0' inputMode='decimal' value={this.state.openmat.cost} onChange={e=>{let obj = this.state.openmat; obj.cost=e.target.value; this.setState({openmat:obj})}}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='call_first'>Should people call first?</label>
                        <select className='form-control' id='call_first' value={this.state.openmat.call_first} onChange={e=>{let obj = this.state.openmat; obj.call_first=e.target.value; this.setState({openmat:obj})}}>
                            <option value='' disabled defaultValue>Call first?</option>
                            <option value={0}>No need, just show up!</option>
                            <option value={1}>Yes</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='size'>How many people are usually there?</label>
                        <select className='form-control' id='size' value={this.state.openmat.size} onChange={e=>{let obj = this.state.openmat; obj.size=e.target.value; this.setState({openmat:obj})}}>
                            <option value='' disabled defaultValue>Size</option>
                            <option value='S'>Small (0-10 people)</option>
                            <option value='M'>Medium (10-20 people)</option>
                            <option value='L'>Large (20-30 people)</option>
                            <option value='XL'>Huge (30+ people)</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='gi_nogi'>Gi or Nogi:</label>
                        <select className='form-control' id='gi_nogi' value={this.state.openmat.gi_nogi} onChange={e=>{let obj = this.state.openmat; obj.gi_nogi=e.target.value; this.setState({openmat:obj})}}>
                            <option value='' disabled defaultValue>Gi or Nogi</option>
                            <option value={1}>Gi</option>
                            <option value={2}>Nogi</option>
                            <option value={3}>Both</option>
                            <option value={4}>Alternates</option>
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='notes'>Notes:</label>
                        <input className='form-control' type='text' placeholder='Anything we should know first?' id='notes' value={this.state.openmat.notes} onChange={e=>{let obj = this.state.openmat; obj.notes=e.target.value; this.setState({openmat:obj})}}></input>
                    </div>
                    <button className='btn btn-primary'>Submit</button>
                </form>
            </div>
        )
    }

    //this doesn't display anything until the user click to select a previously entered gym or create a new one. It also takes care of breakpoints
    renderForm(){
        if(!this.state.selectedGym) return null
        if(this.props.screenSize>breakPoints.medium) return this.renderLargeForm()
        if(this.props.screenSize>breakPoints.small) return this.renderMediumForm()
        else return this.renderSmallForm()
    }

    render(){
        return(
            <div className='mt-5'>
                {/* <h3 className='my-5 text-center display-4'>{this.props.screenSize > breakPoints.small ? 'Add a New Open Mat' : 'Add New Open Mat'}</h3> */}
                {/* {this.renderSelectGymButton()} */}
                {this.renderForm()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return({
        screenSize: state.screenSize,
        newMatId : state.newMatId,
        gyms: state.gyms
    })
}

const googleMapsKey = process.env.NODE_ENV==='production' ? process.env.REACT_APP_googleMapsAPIKey : process.env.REACT_APP_googleMapsAPIKey_dev

export default connect(mapStateToProps,{ createOpenmat, createGym, resetMatId, getGyms })(GoogleApiWrapper({apiKey:googleMapsKey})(Create))