import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { showGym, clearPrevious } from '../../actions'

import AddButton from '../AddButton'
import EditButton from '../EditButton'
import Map from '../Map'

import formatTime from '../../utilities/formatTime'
import breakPoints from '../../config/breakPoints'

class GymDetail extends React.Component {

    componentDidMount(){
        document.title = 'OpenMats.org'
        //clear any previous details so they don't appear while new gym details are being fetched
        this.props.clearPrevious()
        //fetch details for chosen gym
        this.props.showGym(this.props.match.params.id)
    }

    componentDidUpdate(){
        //update title after fetching data if it hasn't already been updated
        if(document.title==='OpenMats.org' && this.props.gym && this.props.gym[0].name) document.title = `OpenMats.org | ${this.props.gym[0].name}`
    }

    formatImage = imageUrl => {
        if(imageUrl){
            return(
                <img className='card-img-top border-bottom' style={{height:'40vh'}} src={this.props.gym[0].photo} onError={(e)=>{e.target.onerror=null;e.target.src='https://i.imgur.com/PaAB0sq.jpg'}} alt='gym'></img>
            )
        }else{
            return(
                <img className='card-img-top border-bottom' style={{height:'40vh'}} src={'https://i.imgur.com/PaAB0sq.jpg'} alt='gym'></img>
            )
        }
    }

    formatGiNogi = ginogi => {
        switch(ginogi){
            case(1):
                return 'Gi'
            case(2):
                return 'No-Gi'
            case(3):
                return 'Mixed Gi/No-Gi'
            case(4):
                return 'Alternates Gi/No-Gi'
            default:
                return 'Unknown'
        }
    }

    formatSize = size => {
        switch(size){
            case('S'):
                return '< 10 people'
            case('M'):
                return '10-20 people'
            case('L'):
                return '20-30 people'
            case('XL'):
                return '30+ people'
            default:
                return 'Unknown'
        }
    }

    formatCost = cost => {
        if(cost===0) return 'Free'
        if(cost>0) return `$${cost}`
        else return 'Unknown'
    }

    renderTable(){
        return this.props.gym.map(el=>{
            return(
                <tr className='pointer-on-hover' key={el.id} onClick={()=>this.props.history.push(`/openmats/${el.id}`)}>
                    <td>{el.day} {formatTime(el.time)}</td>
                    <td>{this.formatGiNogi(el.gi_nogi)}</td>                    
                    {this.props.screenSize > breakPoints.small ? <td>{this.formatSize(el.size)}</td> : null}
                    <td>{this.formatCost(el.cost)}</td>
                </tr>
            )
        })
    }

    renderHeader(gym){
        if(this.props.screenSize > breakPoints.medium){
            return(
                <div className='d-flex justify-content-around'>
                    <p className='card-text'><i className='far fa-map mr-2'></i><a className='plain-link' href={`https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`} target="_blank">{gym.street} {gym.city}, {gym.state}</a></p>
                    <p className='card-text'><i className='fas fa-phone mr-2'></i>{gym.phone ? gym.phone : 'Unknown'}</p>
                    {gym.website ? <p className='card-text'><a className='plain-link' href={gym.website} target="_blank"><i className='fas fa-globe mr-2'></i>Website</a></p> : null}
                </div>
        // )}if(this.props.screenSize > breakPoints.small){
        //     return(
        //         <>
        //         <div className='d-flex justify-content-around'>
        //             <p className='card-text'><i className='far fa-map mr-2'></i><a className='plain-link' href={`https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`} target="_blank">{gym.street} {gym.city}, {gym.state}</a></p>
        //         </div>
        //         <div className='d-flex justify-content-around mt-3'>
        //             <p className='card-text'><i className='fas fa-phone mr-2'></i>{gym.phone ? gym.phone : 'Unknown'}</p>
        //             {gym.website ? <p className='card-text'><a className='plain-link' href={gym.website} target="_blank"><i className='fas fa-globe mr-2'></i>Website</a></p> : null}
        //         </div>
        //         </>
        )}else{
            return(
                <div className='text-centered'>
                    <p className='card-text'><i className='far fa-map mr-2'></i><a className='plain-link' href={`https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`} target="_blank">{gym.street} {gym.city}, {gym.state}</a></p>
                    <p className='card-text'><i className='fas fa-phone mr-2'></i>{gym.phone ? gym.phone : 'Unknown'}</p>
                    {gym.website ? <p className='card-text'><a className='plain-link' href={gym.website} target="_blank"><i className='fas fa-globe mr-2'></i>Website</a></p> : null}
                </div>
            )
        }
    }

    renderDetails(){
        const gym = this.props.gym[0]

        return(
            <div className='card text-center mb-3'>
                {this.formatImage(this.props.gym[0].photo)}

                {/* <img className='card-img-top border-bottom' style={{height:'40vh'}} src={this.props.gym[0].photo} alt='gym'></img> */}
                <div className='card-body'>
                    {this.renderHeader(gym)}
                </div>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th scope='col'>Open Mat Time</th>
                            <th scope='col'>Gi or No-Gi</th>
                            {this.props.screenSize > breakPoints.small ? <th scope='col'>Size</th> : null}
                            <th scope='col'>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                    </tbody>
                </table>
                {/* <div className='card-footer text-muted'>
                    Footer
                </div> */}
            </div>
        )
    }

    renderLarge(){
        return(
            <div>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-8'>
                            <div className='display-4 text-center my-4'>{this.props.gym[0].name}</div>
                        </div>
                        <div className='col-4'>
                        </div>
                    </div>
                    <div className='row mb-4'>
                        <div className='col-9'>
                            <div>
                                {this.renderDetails()}
                            </div>
                            <div className='d-flex justify-content-between pr-3'>
                                <AddButton gymId={this.props.gym[0].gym_id} buttonText='Add New Open Mat'/>
                                <EditButton gymId={this.props.gym[0].gym_id} buttonText='Edit Gym'/>
                            </div>
                        </div>
                        <div className='col-3'>
                            <Map gyms={[this.props.gym[0]]}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderMedium(){
        return(
            <div>
                <div className='container-fluid'>
                    <h2 className='text-center my-5'>{this.props.gym[0].name}</h2>
                    <div style={{height:'35vh'}}>
                        <Map customMapStyles={{width:'658px',height: '30vh'}} gyms={[this.props.gym[0]]}/>
                    </div>
                    <div>
                        {this.renderDetails()}
                    </div>
                    <div className='d-flex justify-content-between pr-3 mb-4'>
                        <AddButton gymId={this.props.gym[0].gym_id} buttonText='Add New Open Mat'/>
                        <EditButton gymId={this.props.gym[0].gym_id} buttonText='Edit Gym'/>
                    </div>
                </div>
            </div>
        )
    }

    renderSmall(){
        return(
            <div>
                <div className='container-fluid'>
                    <h3 className='text-center my-5'>{this.props.gym[0].name}</h3>
                    <div style={{height:'35vh'}}>
                        <Map customMapStyles={{width:'478px',height: '30vh'}} gyms={[this.props.gym[0]]}/>
                    </div>
                    <div>
                        {this.renderDetails()}
                    </div>
                    <div className='d-flex justify-content-between pr-3 mb-4'>
                        <AddButton gymId={this.props.gym[0].gym_id} buttonText='Add New Open Mat'/>
                        <EditButton gymId={this.props.gym[0].gym_id} buttonText='Edit Gym'/>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        if(!this.props.gym) return <div></div>
        if (!this.props.gym[0].id) return <div></div>
        if(this.props.screenSize > breakPoints.medium) return this.renderLarge()
        if(this.props.screenSize > breakPoints.small) return this.renderMedium()
        else return this.renderSmall()
    }
}

const mapStateToProps = state => {
    return({
        screenSize: state.screenSize,
        gym: state.gymDetails //array of all open mats associated with one gym and that gyms details
    })
}

export default connect(mapStateToProps,{showGym, clearPrevious})(withRouter(GymDetail))