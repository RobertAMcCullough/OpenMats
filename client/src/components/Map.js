import React from 'react'
import { connect } from 'react-redux'
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react'
import { withRouter } from 'react-router-dom'

import { refreshMap } from '../actions'

//pass array of gyms in as props
class MapContainer extends React.Component {
    state={ name: '', marker: {}, visible: false}

    mapRendered=false //used in componentDidMount and componentDidUpdate

    renderMap(){
        if(this.props.gyms.length>0) this.mapRendered=true //in some cases, gym data won't be available when component mounts, and if it doesn't then the code from componentDidMount will run in componenentDidUpdate
        if(this.props.gyms.length===1) return //if there is only one marker, don't adjust size of the map

        //this sizes the map to fit all the markers
        const bounds = new window.google.maps.LatLngBounds()
        this.props.gyms.map((el)=>{
            bounds.extend(new window.google.maps.LatLng(
                el.lat,
                el.lng
            ))
            return null
        })

        this.refs.resultMap.map.fitBounds(bounds)
    }

    componentDidMount(){
        this.renderMap()
    }

    componentDidUpdate(){     
        //don't need to run the following code if it was run in componentDidMount
        if(this.mapRendered===false || this.props.refreshMapProp===true){
            this.mapRendered=true;
            this.props.refreshMap(false) //this makes sure the map isn't refreshed again a second time

            this.renderMap()
        }

    }

    mapStyles = {
        width:'100%',
        height: '60vh'
    }

    createMarkers(){

        return this.props.gyms.map((e,ind)=>{

            return <Marker 
                key={e.id} 
                id={e.id} 
                position={{lat: e.lat, lng:e.lng}}
                label={this.props.gyms.length===1 ? '' : (ind+1).toString()} //doesn't add a label when there is only one gym
                onClick={(props)=>{this.props.history.push(`/gyms/${props.id}`)}}
                onMouseover={(props, marker)=>{if(this.state.name!==e.name){this.setState({name: e.name, marker: marker, visible: true})}}}
            >
            </Marker>
        })
    }

    renderInfoWindow(){
        if(this.props.gyms.length===1) return

        return(
            <InfoWindow marker={this.state.marker} visible={this.state.visible}>
                <div>
                    <h5>{this.state.marker.label}. {this.state.name}</h5>
                </div>
            </InfoWindow>
        )
    }

    render(){
        return(
            <Map 
                google={this.props.google}
                ref='resultMap'
                zoom={11} //only applies when there is one gym and componentDidMount is bypassed
                style={this.props.customMapStyles ? this.props.customMapStyles : this.mapStyles}
                initialCenter={this.props.gyms[0] ? {lat: this.props.gyms[0].lat, lng: this.props.gyms[0].lng} : {lat: 0, lng: 0}} //only applies when there is one mat and componentDidMount is bypassed
                onClick={()=>{this.setState({name: '', visible: false})}}
                // onReady={()=>{console.log('MAP READY')}}
            >
            {this.createMarkers()}
            {this.renderInfoWindow()}
            </Map>
        )
    }
}

const mapStateToProps = (state) => {
    return({
        user: state.user,
        refreshMapProp: state.refreshMap
    })
}

const googleMapsKey = process.env.NODE_ENV==='production' ? process.env.REACT_APP_googleMapsAPIKey : process.env.REACT_APP_googleMapsAPIKey_dev

export default connect(mapStateToProps,{refreshMap})(GoogleApiWrapper({apiKey:googleMapsKey})(withRouter(MapContainer)))
