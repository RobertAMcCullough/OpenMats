import React from 'react'
import { Link } from 'react-router-dom'

import formatTime from '../utilities/formatTime'

class OpenMatCard extends React.Component {

    formatCostStyles = cost => {
        if(cost === null) return {color: 'white'} //makes the text invisible if unknown
        return cost===0 ? {color:'green', fontWeight:'bold'} : {color:'red'}
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
        return(
            <Link style={{width:'100%'}} to={`/openmats/${this.props.mat.id}`} className='plain-link'>
                <div className='d-flex align-items-center mb-3'>
                    <div className='p-1' style={{width:'30%'}}>
                        <img style={{width:'100%', height:'100%', objectFit:'cover'}} src={this.props.mat.photo} alt='gym'></img>
                    </div>
                    <div style={{width:'60%'}} className='card'>
                        <div className='card-body'>
                            <h5 className='card-text'>{this.props.mat.day} - {formatTime(this.props.mat.time)}</h5>
                            <p className='card-title'>{this.props.mat.name}</p>
                            <div className='d-flex justify-content-between'>
                                <p className='card-text' style={this.formatCostStyles(this.props.mat.cost)}>{this.props.mat.cost === 0 ? 'FREE' : `$${this.props.mat.cost}`}</p>
                                <p className='card-text pr-2' style={{fontWeight:'bold'}}>{this.formatGiNogi(this.props.mat.gi_nogi)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            // The following breaks the links up between gym and open mat
            // <div className='card mb-3' style={{width:'220px'}}>
            //     <Link to={`/openmats/${this.props.mat.id}`} className='plain-link'>
            //         <img className='card-img-top border-bottom' src={this.props.mat.photo} alt='gym'></img>
            //     </Link>
            //     <div className='card-body'>
            //         <Link to={`/gyms/${this.props.mat.gym_id}`} className='plain-link'>
            //             <h5 className='card-title'>{this.props.mat.name}</h5>
            //         </Link>
            //         <Link to={`/openmats/${this.props.mat.id}`} className='plain-link'>
            //             <p className='card-text'>{this.props.mat.day} - {formatTime(this.props.mat.time)}</p>
            //         </Link>
            //         <div className='d-flex justify-content-between mt-3'>
            //             <p className='card-text' style={this.formatCostStyles(this.props.mat.cost)}>{this.props.mat.cost === 0 ? 'FREE' : `$${this.props.mat.cost}`}</p>
            //             <p className='card-text pr-2' style={{fontWeight:'bold'}}>{this.formatGiNogi(this.props.mat.gi_nogi)}</p>
            //         </div>
            //     </div>
            // </div>
        )
    }
}

export default OpenMatCard