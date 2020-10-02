//This version of the page uses Bootstrap Card components. Another version of this page was created using a custom (non-Bootstrap) version of cards

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { searchOpenmats, getGyms, refreshMap } from '../../actions'

import OpenMatCard from '../OpenMatCard'
import WideOpenMatCard from '../WideOpenMatCard'
import Map from '../Map'

import breakpoints from '../../config/breakPoints'

class SearchResults extends React.Component {
    searchTerm = localStorage.getItem('searchTerm')

    componentDidMount(){
        document.title = "OpenMats.org | Search Results"
        this.props.searchOpenmats(this.props.searchOptions)
        this.props.getGyms()
    }

    componentDidUpdate(){
        //this monitors for changes to the seach term, which happens when a search is done from the header. this will cause the search results to refresh
        if(this.searchTerm!==localStorage.getItem('searchTerm')){
            this.searchTerm = localStorage.getItem('searchTerm')
            this.props.searchOpenmats()
        }
    }

    renderGyms(){
        if(this.props.openMats === undefined) return null

        let gymResults= [] //will store an array of objects, each object has a 'name' and 'count' and 'id' key, which counts how many mats each gym has and stores name and gym_id

        this.props.openMats.forEach(mat=>{
            let newGym = true //gets set to false if the gym is found in the gymResults array
            gymResults.forEach(gym=>{
                if(gym.name===mat.name){
                    gym.count++
                    // gym.id=mat.gym_id
                    newGym=false
                }
            })
            if(newGym===true){ //if gym is not found in the gymResults array, add it
                gymResults.push({name: mat.name, count:1, id:mat.gym_id})
            }
        })

        return(
            <div className='mb-3'>
                Open Mats Found at:
                {gymResults.map(el=>{
                    return(
                        <div className='my-1' key={el.id}>
                            <Link className='plain-link' to={`/gyms/${el.id}`}>{el.name} ({el.count})</Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    //produces a list of gyms from props.openMats to pass to Maps component
    listGyms(){
        if(this.props.openMats === undefined) return []

        this.props.refreshMap(true)

        let gymResults= [] //will store an array of objects, each object has a 'id', 'lat', 'lng' and 'name' key

        this.props.openMats.forEach(mat=>{
            let newGym = true //gets set to false if the gym is found in the gymResults array
            gymResults.forEach(gym=>{
                if(gym.name===mat.name) newGym=false
            })
            if(newGym===true){ //if gym is not found in the gymResults array, add it
                gymResults.push({name: mat.name, id:mat.gym_id, lat: mat.lat, lng: mat.lng})
            }
        })

        return gymResults
    }

    renderResults(){
        if(!this.props.openMats || !this.props.openMats.length) return null

        return this.props.openMats.map(el=>{
            return(
                <WideOpenMatCard key={el.id} mat={el}></WideOpenMatCard>
            )
        })
    }

    renderFullSizeResults(){
        return(
            <>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-8'>
                            <div className='display-4 text-center my-4'>Search Results</div>
                            <div className='text-center my-2'>
                                <Link to='/advancedSearch'>Advanced Search</Link>
                            </div>
                            {this.renderGyms()}
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            {/*V2: Sort By  */}
                            {/*V2: Show Which Filters Are Applied  */}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-8'>
                            <div className='d-flex flex-wrap justify-content-between'>
                                {this.renderResults()}
                                {/* divs with empty-child-filler class cause the last row of cards to left align */}
                                <div className='empty-child-filler'></div>
                                <div className='empty-child-filler'></div>
                            </div>
                        </div>
                        <div className='col-4 px-0'>
                            <div className='sticky-top'>
                                {this.props.openMats.length ? <Map gyms={this.listGyms()}/> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    renderLargeResults(){
        return(
            <>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-8'>
                            <div className='display-4 text-center my-4'>Search Results</div>
                            <div className='text-center my-2'>
                                <Link to='/advancedSearch'>Advanced Search</Link>
                            </div>
                            {this.renderGyms()}
                        </div>
                        <div className='col-4 d-flex align-items-center'>
                            {/*V2: Sort By  */}
                            {/*V2: Show Which Filters Are Applied  */}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-7'>
                            <div className='d-flex flex-wrap justify-content-around'>
                                {this.renderResults()}
                                {/* divs with empty-child-filler class cause the last row of cards to left align */}
                                <div className='empty-child-filler'></div>
                                <div className='empty-child-filler'></div>
                            </div>
                        </div>
                        <div className='col-5 px-0'>
                            <div className='sticky-top'>
                                {this.props.openMats.length ? <Map gyms={this.listGyms()}/> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    renderMediumResults(){
        return(
            <>
                <div className='container-fluid'>
                    <div>
                        <div className='display-4 text-center my-4'>Search Results</div>
                        <div className='text-center my-2'>
                            <Link to='/advancedSearch'>Advanced Search</Link>
                        </div>
                        {this.renderGyms()}
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            <div className='d-flex flex-wrap justify-content-between'>
                                {this.renderResults()}
                                {/* divs with empty-child-filler class cause the last row of cards to left align */}
                                <div className='empty-child-filler'></div>
                                <div className='empty-child-filler'></div>
                            </div>
                        </div>
                        <div className='col-7 px-0'>
                            <div className='sticky-top'>
                                {this.props.openMats.length ? <Map gyms={this.listGyms()}/> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    renderSmallResults(){
        return(
            <>
                <div className='container-fluid'>
                    <div>
                        <div className='display-4 text-center my-4'>Search Results</div>
                        <div className='text-center my-2'>
                            <Link to='/advancedSearch'>Advanced Search</Link>
                        </div>
                        {this.renderGyms()}
                        <div style={{width:'90%', height:'55vh'}}>
                        {/* <div className='sticky-top'> */}
                            {this.props.openMats.length ? <Map customMapStyles={{width:'75%',height: '50vh'}} gyms={this.listGyms()}/> : null}
                        </div>
                        {this.renderResults()}
                    </div>
                </div>
            </>
        )
    }

    renderSize(){
        if(this.props.screenSize>breakpoints.large) return this.renderFullSizeResults()
        if(this.props.screenSize>breakpoints.medium) return this.renderLargeResults()
        if(this.props.screenSize>breakpoints.small) return this.renderMediumResults()
        else return this.renderSmallResults()
    }

    render(){
        return(
            <div>
                {this.renderSize()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return({
        screenSize: state.screenSize,
        openMats : state.openMats,
        searchOptions: state.searchOptions
    })
}

export default connect(mapStateToProps,{searchOpenmats, getGyms, refreshMap })(SearchResults)