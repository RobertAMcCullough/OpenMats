//This is custom card to be used instead of the Bootstrap card

import React from 'react'
import { Link } from 'react-router-dom'

import formatTime from '../utilities/formatTime'

class CustomOpenMatCard extends React.Component {

    formatImage = imageUrl => {
        if(imageUrl){
            return(
                <img style={{width:'100%', height:'100%', objectFit:'cover'}} src={imageUrl} 
                onError={(e)=>{e.target.onerror=null;e.target.src='https://i.imgur.com/PaAB0sq.jpg'}} alt='gym'></img>
            )
        }else{
            // return <div>
            //     <h5 className="text-center">{this.props.mat.name}</h5>
            // </div>
            return(
                <img style={{width:'100%', height:'100%', objectFit:'cover'}} src={'https://i.imgur.com/PaAB0sq.jpg'} alt='gym'></img>
            )
        }
    }

    formatCostStyles = cost => {
        if(cost === null) return {color: 'white'} //makes the text invisible if unknown
        return cost===0 ? {color:'green', fontWeight:'bold'} : {color:'red', fontWeight:'bold'}
    }

    formatGiNogi = ginogi => {
        switch(ginogi){
            case(1):
                return 'Gi'
            case(2):
                return 'No-Gi'
            case(3):
                return 'Gi/No-Gi'
            case(4):
                return 'Gi/No-Gi'
        }
    }

    render(){
        if(this.props.size==='small'){
            //small card
            return(
                <div className='d-flex mb-2 border' style={{width:'100%', height:'8rem'}}>
                    <Link to={`/gyms/${this.props.mat.gym_id}`} className='plain-link' style={{width:'30%'}}>
                        <div className='border-right' style={{height:'100%'}}>
                            {this.formatImage(this.props.mat.photo)}
                            {/* <img style={{width:'100%', height:'100%', objectFit:'cover'}} src={this.props.mat.photo} alt='gym'></img> */}
                        </div>
                    </Link>
                    <Link to={`/openmats/${this.props.mat.id}`} className={this.props.mat.paused ? 'plain-link covid' : 'plain-link'} style={{width:'69%'}}>
                        <div className='p-2'>
                            <div className='d-flex flex-column justify-content-between'>
                                <h5>{this.props.mat.day} - {formatTime(this.props.mat.time)}</h5>
                                <p>{this.props.mat.name}</p>
                            </div>
                            <div className='d-flex'>
                                <p className='pr-5' style={this.formatCostStyles(this.props.mat.cost)}>{this.props.mat.cost === 0 ? 'FREE' : `$${this.props.mat.cost}`}</p>
                                <p style={{fontWeight:'bold'}}>{this.formatGiNogi(this.props.mat.gi_nogi)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            )
        }
        //normal size card
        else return(
                <div className='d-flex mb-2 border' style={{width:'100%', height:'8rem'}}>
                    <Link to={`/gyms/${this.props.mat.gym_id}`} className='plain-link' style={{width:'30%'}}>
                        <div className='border-right' style={{height:'100%'}}>
                            {this.formatImage(this.props.mat.photo)}
                            {/* <img style={{width:'100%', height:'100%', objectFit:'cover'}} src={this.props.mat.photo} alt='gym'></img> */}
                        </div>
                    </Link>
                    <Link to={`/openmats/${this.props.mat.id}`} className={this.props.mat.paused ? 'plain-link covid' : 'plain-link'} style={{width:'69%'}}>
                        <div className='p-2'>
                            <div className='d-flex justify-content-between'>
                                <h5>{this.props.mat.day} - {formatTime(this.props.mat.time)}</h5>
                                <p>{this.props.mat.name}</p>
                            </div>
                            <div>
                                <p style={this.formatCostStyles(this.props.mat.cost)}>{this.props.mat.cost === 0 ? 'FREE' : `$${this.props.mat.cost}`}</p>
                                <p style={{fontWeight:'bold'}}>{this.formatGiNogi(this.props.mat.gi_nogi)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
        )
    }
}

export default CustomOpenMatCard