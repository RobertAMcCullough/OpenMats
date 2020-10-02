import React from 'react'
import { connect } from 'react-redux'
import { GoogleApiWrapper } from 'google-maps-react'

import { refreshMap, setSearchOptions } from '../../actions'

import geocoder from '../../utilities/geocoder'
import days from '../../config/days'

class AdvancedSearch extends React.Component {
    state = {
        searchTerm : '',
        distance: 50,
        day: '',
        //the remaining values are from checkboxes and will be true or false
        timeMorning: '', 
        timeDay: '',
        timeEvening: '',
        gi: '',
        nogi: '',
        // mixed: '',
        free: ''
    }

    componentDidMount(){
        document.title = "OpenMats.org | Advanced Search"
    }

    submitSearch = e => {
        e.preventDefault()

        //this makes sure the map is rerendered on subsequent searches, otherwise it will be centered on the last search
        this.props.refreshMap(true)

        //adds search options to store
        this.props.setSearchOptions(this.state)

        //do geocoding, results are set to localStorage
        let geoConstructor = new window.google.maps.Geocoder()
        geocoder(geoConstructor, this.state.searchTerm, this.props.history, this.state)
    }

    render(){
        return(
            <div>
                <form className='form' onSubmit={e=>this.submitSearch(e)}>
                    <div className='form-group row'>
                        <label className='col-sm-2 col-form-label' htmlFor='day-input'>Location</label>
                        <div className='col-sm-6'>
                            <input className='form-control' id='day-input' type='text' placeholder='Enter Location' required  value={this.state.searchTerm} onChange={e=>this.setState({searchTerm: e.target.value})}></input>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label className='col-sm-2 col-form-label' htmlFor='distance-input'>Distance</label>
                        <div className='col-sm-6 d-flex align-items-center'>
                            <input className='form-control' id='distance-input' type='range' min='0' max='200' value={this.state.distance} onChange={e=>this.setState({distance: e.target.value})}></input>
                            <div style={{width:'25%', textAlign:'end'}}>{this.state.distance} Miles</div>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <label className='col-sm-2 col-form-label' htmlFor='day-input'>Day</label>
                        <div className='col-sm-6'>
                            <select className='form-control' id='day-input' value={this.state.day} onChange={e=>this.setState({day: e.target.value})}>
                                <option value='' defaultValue>Select Day</option>
                                {days.map(el=><option key={el}>{el}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-2'>Time</div>
                        <div className='col-sm-6'>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='time-1' onChange={e=>this.setState({timeMorning: !this.state.timeMorning})}></input>
                                <label className='form-check-label' htmlFor='time-1'>Morning (before 11:00)</label>
                            </div>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='time-2' onChange={e=>this.setState({timeDay: !this.state.timeDay})}></input>
                                <label className='form-check-label' htmlFor='time-2'>Day (11:00 - 4:00)</label>
                            </div>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='time-3' onChange={e=>this.setState({timeEvening: !this.state.timeEvening})}></input>
                                <label className='form-check-label' htmlFor='time-3'>Evening (after 4:00)</label>
                            </div>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-2'>Gi or No-Gi</div>
                        <div className='col-sm-6'>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='gi-1' onChange={e=>this.setState({gi: !this.state.gi})}></input>
                                <label className='form-check-label' htmlFor='gi-1'>Gi</label>
                            </div>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='gi-2' onChange={e=>this.setState({nogi: !this.state.nogi})}></input>
                                <label className='form-check-label' htmlFor='gi-2'>No-Gi</label>
                            </div>
                            {/* <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='gi-3' onChange={e=>this.setState({mixed: !this.state.mixed})}></input>
                                <label className='form-check-label' htmlFor='gi-3'>Mixed</label>
                            </div> */}
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-2'>Cost</div>
                        <div className='col-sm-6'>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='cost' onChange={e=>this.setState({free: !this.state.free})}></input>
                                <label className='form-check-label' htmlFor='cost'>Free</label>
                            </div>
                        </div>
                    </div>
                    <button className='btn btn-primary my-3'>Search</button>
                </form>


            </div>
        )
    }
}

export default connect(null,{ refreshMap, setSearchOptions })(GoogleApiWrapper({apiKey:process.env.REACT_APP_googleMapsAPIKey})(AdvancedSearch))