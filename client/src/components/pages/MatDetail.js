import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { showOpenmat, clearPrevious } from '../../actions'

import EditButton from '../EditButton'
import ConfirmDeleteModal from '../ConfirmDeleteModal'
import Map from '../Map'

import formatTime from '../../utilities/formatTime'
import formatDate from '../../utilities/formatDate'
import breakPoints from '../../config/breakPoints'

class MatDetail extends React.Component {

    componentDidMount(){
        document.title = 'OpenMats.org'
        //clear any previous details so they don't appear while new mat details are being fetched
        this.props.clearPrevious()
        //fetch details for chosen mat
        this.props.showOpenmat(this.props.match.params.id)
    }

    componentDidUpdate(){
        //update title after fetching data if it hasn't already been updated
        if(document.title==='OpenMats.org' && this.props.mat && this.props.mat.name) document.title = `OpenMats.org | ${this.props.mat.name}`
        if(this.props.mat) formatDate(this.props.mat.last_updated)
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
                return 'Usually less than 10 people'
            case('M'):
                return 'Usually 10-20 people'
            case('L'):
                return 'Usually 20-30 people'
            case('XL'):
                return 'Usually 30+ people'
            default:
                return 'Unknown'
        }
    }

    formatCost = cost => {
        if(cost===0) return 'Free'
        if(cost>0) return `$${cost}`
        else return 'Unknown'
    }

    formatCallFirst = call => {
        if(call===0) return 'No need, just show up!'
        if(call===1) return 'Yes, please call ahead.'
        else return 'Unknown'
    }

    renderTable(){
        //which fields to display in tables
        const fields = ['time','gi_no_gi','size','cost','notes']

        return(
            <tr className='pointer-on-hover' key={this.props.mat.id} onClick={()=>this.props.history.push(`/openmats/${this.props.mat.id}`)}>
                <td>{this.props.mat.day} {formatTime(this.props.mat.time)}</td>
                <td>{this.formatGiNogi(this.props.mat.gi_nogi)}</td>
                <td>{this.formatSize(this.props.mat.size)}</td>
                <td>{this.formatCost(this.props.mat.cost)}</td>
            </tr>
        )
    }

    renderFooter(mat){
        if(this.props.screenSize > breakPoints.small) return(
            <>
            <div className='d-flex justify-content-between align-items-center'>
                <p className='mx-4 my-0'>Last Updated: {formatDate(mat.last_updated)}</p>
                <div>
                    <EditButton formatting='mr-4' matId = {this.props.mat.id}/>
                    <ConfirmDeleteModal createdBy = {this.props.mat.mat_created_by} mat={this.props.mat}/>
                </div>
            </div>
            </>
        )
        else return(
            <>
            <div>
                <div className='my-3'>
                    <EditButton formatting='mr-4' matId = {this.props.mat.id}/>
                    <ConfirmDeleteModal createdBy = {this.props.mat.mat_created_by} mat={this.props.mat}/>
                </div>
                <p>Last Updated: {formatDate(mat.last_updated)}</p>
            </div>
            </>
        )
    }


    renderDetails(){
        const mat = this.props.mat

        return(
            <div className='container'>
                <table className='table table-bordered'>
                    <tbody>
                        <tr>
                            <th scope='row'>Gym</th>
                            <td><Link to={`/gyms/${mat.gym_id}`} className='plain-link'>{mat.name}</Link></td>
                        </tr>
                        <tr>
                            <th scope='row'>Time</th>
                            <td>{mat.day} {formatTime(mat.time)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Address</th>
                            <td>{mat.street} {mat.city}, {mat.state}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Phone</th>
                            <td>{mat.phone}</td>
                        </tr>
                        <tr>
                            <th style={{width:'8rem'}} scope='row'>Gi or No-Gi</th>
                            <td>{this.formatGiNogi(mat.gi_nogi)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Size</th>
                            <td>{this.formatSize(mat.size)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Cost</th>
                            <td>{this.formatCost(mat.cost)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Call First?</th>
                            <td>{this.formatCallFirst(mat.call_first)}</td>
                        </tr>
                        <tr>
                            <th scope='row'>Notes</th>
                            <td>{mat.notes}</td>
                        </tr>  
                    </tbody>
                </table>
                {this.renderFooter(mat)}
            </div>
        )
    }

    render(){
        if(!this.props.mat) return <div></div>
        return(
            <div>
                <div>
                    <Link to={`/gyms/${this.props.mat.gym_id}`} className='plain-link'><h2 className={this.props.screenSize > breakPoints.medium ? 'display-4 text-center my-4' : 'text-center my-4'}>Open Mat at {this.props.mat.name}</h2></Link>
                    <Link to={`/gyms/${this.props.mat.gym_id}`}><div style={{fontSize:'1.2rem'}} className='text-center mb-4'>See all open mats at this location</div></Link>
                    <div>
                        {this.renderDetails()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return({
        screenSize: state.screenSize,
        mat: state.matDetails //single open mat along with gym info
    })
}

export default connect(mapStateToProps,{showOpenmat, clearPrevious})(withRouter(MatDetail))