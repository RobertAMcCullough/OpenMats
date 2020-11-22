import React from 'react'
import { connect } from 'react-redux'

import { getGyms, refreshMap } from '../../actions'

import Map from '../Map'

import breakpoints from '../../config/breakPoints'

class SearchResults extends React.Component {
    searchTerm = localStorage.getItem('searchTerm')

    componentDidMount(){
        document.title = "OpenMats.org | All Gyms"
        this.props.refreshMap(true)
        this.props.getGyms()
    }

    //produces a list of gyms to pass to Maps component
    listGyms(){

        let gymResults= [] //will store an array of objects, each object has a 'id', 'lat', 'lng' and 'name' key

        this.props.gyms.forEach(gym=>{
            gymResults.push({name: gym.name, id:gym.id, lat: gym.lat, lng: gym.lng})
        })

        return gymResults
    }

    renderLargeResults(){
        return(
            <>
                <div className='container-fluid'>
                    <div className='display-4 text-center my-4'>{this.props.gyms.length ? `All Gyms (${this.props.gyms.length})` : 'All Gyms'}</div>
                    <div><Map gyms={this.listGyms()} allGyms={true} customMapStyles={{width:"75%", height:"70%"}} zoom={4}/></div>
                </div>
            </>
        )
    }

    renderMediumResults(){
        return(
            <>
                <div className='container-fluid'>
                <h4 className='text-center my-4'>{this.props.gyms.length ? `All Gyms (${this.props.gyms.length})` : 'All Gyms'}</h4>
                    <div><Map gyms={this.listGyms()} allGyms={true} customMapStyles={{width:"75%", height:"70%"}} zoom={3.75}/></div>
                </div>
            </>
        )
    }

    renderSmallResults(){
        return(
            <>
                <div className='container-fluid'>
                    <h4 className='text-center my-4'>{this.props.gyms.length ? `All Gyms (${this.props.gyms.length})` : 'All Gyms'}</h4>
                    <div><Map gyms={this.listGyms()} allGyms={true} customMapStyles={{width:"75%", height:"70%"}} zoom={2.9}/></div>
                </div>
            </>
        )
    }

    render(){
        if(this.props.screenSize>breakpoints.medium) return this.renderLargeResults()
        if(this.props.screenSize>breakpoints.small) return this.renderMediumResults()
        else return this.renderSmallResults()
    }
}

const mapStateToProps = state => {
    return({
        gyms: state.gyms,
        screenSize: state.screenSize
    })
}

export default connect(mapStateToProps,{ getGyms, refreshMap })(SearchResults)