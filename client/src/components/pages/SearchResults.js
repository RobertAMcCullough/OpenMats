import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { searchOpenmats, getGyms, refreshMap, setSortBy } from '../../actions';

import CustomOpenMatCard from '../CustomOpenMatCard';
import Map from '../Map';

import breakpoints from '../../config/breakPoints';

class SearchResults extends React.Component {
  searchTerm = sessionStorage.getItem('searchTerm');

  componentDidMount() {
    document.title = `OpenMats.org | Search Results`;
    this.props.searchOpenmats(this.props.searchOptions);
    this.props.getGyms();
    this.sortMats();
  }

  componentDidUpdate() {
    //this monitors for changes to the seach term, which happens when a search is done from the header. this will cause the search results to refresh
    if (this.searchTerm !== sessionStorage.getItem('searchTerm')) {
      this.searchTerm = sessionStorage.getItem('searchTerm');
      this.props.searchOpenmats();
    }
    this.sortMats(); //triggered when sort by term is changed
    // document.title = `OpenMats.org | Search Results (${this.props.openMats.length})`
  }

  //sorts list of openmats based on sortBy piece of state
  sortMats() {
    if (!this.props.openMats) return null;

    let sortedMats = Array.from(this.props.openMats); //returns this array of sorted mats. create a new copy of openMats to start with
    let term = this.props.sortBy; //term to sort by
    let lat = parseFloat(sessionStorage.getItem('lat'));
    let lng = parseFloat(sessionStorage.getItem('lng'));

    //distance sort
    if (this.props.sortBy === 'Distance') {
      let compare = (a, b) => {
        let comparison = 0;
        let distanceA =
          (lat - a.lat) * (lat - a.lat) + (lng - a.lng) * (lng - a.lng);
        let distanceB =
          (lat - b.lat) * (lat - b.lat) + (lng - b.lng) * (lng - b.lng);

        if (distanceA > distanceB) {
          comparison = 1;
        } else if (distanceA < distanceB) {
          comparison = -1;
        }
        return comparison;
      };

      sortedMats.sort(compare);
    }

    //cost sort
    if (this.props.sortBy === 'Cost') {
      let compare = (a, b) => {
        let comparison = 0;
        //set cost to 1000 when it unknown so that it moves to the end of the list
        let costA = a.cost === null ? 1000 : a.cost;
        let costB = b.cost === null ? 1000 : b.cost;

        if (costA > costB) {
          comparison = 1;
        } else if (costA < costB) {
          comparison = -1;
        }
        return comparison;
      };

      sortedMats.sort(compare);
    }

    //day sort
    if (this.props.sortBy === 'Day') {
      //first sort by time
      let compare = (a, b) => {
        let comparison = 0;
        if (a.time > b.time) {
          comparison = 1;
        } else if (a.time < b.time) {
          comparison = -1;
        }
        return comparison;
      };

      sortedMats.sort(compare);

      //then sort by day
      let getDay = (el) => {
        let day;

        switch (el) {
          case 'Sunday':
            day = 0;
            break;
          case 'Monday':
            day = 1;
            break;
          case 'Tuesday':
            day = 2;
            break;
          case 'Wednesday':
            day = 3;
            break;
          case 'Thursday':
            day = 4;
            break;
          case 'Friday':
            day = 5;
            break;
          case 'Saturday':
            day = 6;
        }

        return day;
      };

      let compareDay = (a, b) => {
        let comparison = 0;
        let dayA = getDay(a.day);
        let dayB = getDay(b.day);
        if (dayA > dayB) {
          comparison = 1;
        } else if (dayA < dayB) {
          comparison = -1;
        }
        return comparison;
      };

      sortedMats.sort(compareDay);
    }

    //name sort
    if (this.props.sortBy === 'Name') {
      let compare = (a, b) => {
        let comparison = 0;
        if (a.name > b.name) {
          comparison = 1;
        } else if (a.name < b.name) {
          comparison = -1;
        }
        return comparison;
      };

      sortedMats.sort(compare);
    }

    return sortedMats;
  }

  //return sort by dropdown
  renderSortBy() {
    let options = ['Distance', 'Name', 'Day', 'Cost'];
    return (
      <select
        style={{ width: '50%' }}
        className="form-control ml-3"
        id="sort-by"
        value={this.props.sortBy}
        onChange={(e) => this.props.setSortBy(e.target.value)}
      >
        {/* <option value='' defaultValue>Sort By</option> */}
        {options.map((el) => (
          <option key={el}>{el}</option>
        ))}
      </select>
    );
  }

  //this lists the number of mats found at each gym
  //not currently used
  // renderGyms(){
  //     if(this.props.openMats === undefined) return null

  //     let gymResults= [] //will store an array of objects, each object has a 'name' and 'count' and 'id' key, which counts how many mats each gym has and stores name and gym_id

  //     this.props.openMats.forEach(mat=>{
  //         let newGym = true //gets set to false if the gym is found in the gymResults array
  //         gymResults.forEach(gym=>{
  //             if(gym.name===mat.name){
  //                 gym.count++
  //                 // gym.id=mat.gym_id
  //                 newGym=false
  //             }
  //         })
  //         if(newGym===true){ //if gym is not found in the gymResults array, add it
  //             gymResults.push({name: mat.name, count:1, id:mat.gym_id})
  //         }
  //     })

  //     return(
  //         <div className='mb-3'>
  //             Open Mats Found at:
  //             {gymResults.map(el=>{
  //                 return(
  //                     <div className='my-1' key={el.id}>
  //                         <Link className='plain-link' to={`/gyms/${el.id}`}>{el.name} ({el.count})</Link>
  //                     </div>
  //                 )
  //             })}
  //         </div>
  //     )
  // }

  //produces a list of gyms from props.openMats to pass to Maps component
  listGyms() {
    if (this.props.openMats === undefined) return [];

    this.props.refreshMap(true);

    let gymResults = []; //will store an array of objects, each object has a 'id', 'lat', 'lng' and 'name' key

    this.sortMats().forEach((mat) => {
      let newGym = true; //gets set to false if the gym is found in the gymResults array
      gymResults.forEach((gym) => {
        if (gym.name === mat.name) newGym = false;
      });
      if (newGym === true) {
        //if gym is not found in the gymResults array, add it
        gymResults.push({
          name: mat.name,
          id: mat.gym_id,
          lat: mat.lat,
          lng: mat.lng,
        });
      }
    });

    return gymResults;
  }

  renderResults(size) {
    if (!this.props.openMats) return null;

    if (!this.props.openMats.length)
      return (
        <div className="text-center">
          No Open Mats Found for {this.searchTerm}
        </div>
      );

    // return this.props.openMats.map(el=>{
    //     return(
    //         <CustomOpenMatCard size={size} key={el.id} mat={el}></CustomOpenMatCard>
    //     )
    // })

    let matResults = this.sortMats().map((el) => {
      return (
        <CustomOpenMatCard
          size={size}
          key={el.id}
          mat={el}
          gymList={this.listGyms()}
        ></CustomOpenMatCard>
      );
    });

    return (
      <div style={{ position: 'relative', zIndex: '10' }}>{matResults}</div>
    );
  }

  renderLargeResults() {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-7">
              <div className="display-4 text-center my-4">
                {this.props.openMats.length
                  ? `Search Results (${this.props.openMats.length})`
                  : 'Search Results'}
              </div>
              <div className="text-center mt-2 mb-4">
                <Link to="/advancedSearch">Advanced Search</Link>
              </div>
              {/* //this.renderGyms() returns a list of gyms from search results along with how many open mats were found at each one */}
              {/* {this.renderGyms()} */}
            </div>
            <div className="col-5 d-flex align-items-center">
              Sort By: {this.renderSortBy()}
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <div>{this.renderResults()}</div>
            </div>
            <div className="col-5 px-0">
              <div className="sticky-top">
                {this.props.openMats.length ? (
                  <Map gyms={this.listGyms()} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderMediumResults() {
    return (
      <>
        <div className="container-fluid">
          <div>
            <div className="h1 text-center my-4">
              {this.props.openMats.length
                ? `Search Results (${this.props.openMats.length})`
                : 'Search Results'}
            </div>
            {/* //this.renderGyms() returns a list of gyms from search results along with how many open mats were found at each one */}
            {/* {this.renderGyms()} */}
            <div className="d-flex align-items-center my-3 justify-content-center">
              Sort By: {this.renderSortBy()}
            </div>
            {this.props.openMats.length ? (
              <div style={{ height: '55vh' }}>
                {/* <div style={{height:'55vh'}}> */}
                {/* <div className='sticky-top'> */}
                {this.props.openMats.length ? (
                  <Map
                    customMapStyles={{ width: '75%', height: '50vh' }}
                    gyms={this.listGyms()}
                  />
                ) : null}
              </div>
            ) : null}
            {this.renderResults()}
            <div className="text-center my-2">
              <Link to="/advancedSearch">Advanced Search</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderSmallResults() {
    return (
      <>
        <div className="container-fluid">
          <div>
            <div className="h2 text-center my-4">
              {this.props.openMats.length
                ? `Search Results (${this.props.openMats.length})`
                : 'Search Results'}
            </div>
            {/* //this.renderGyms() returns a list of gyms from search results along with how many open mats were found at each one */}
            {/* {this.renderGyms()} */}
            <div className="d-flex align-items-center my-3 justify-content-center">
              Sort By: {this.renderSortBy()}
            </div>
            {this.props.openMats.length ? (
              <div style={{ height: '55vh' }}>
                {/* <div style={{height:'55vh'}}> */}{' '}
                {/* <div className='sticky-top'> */}
                {this.props.openMats.length ? (
                  <Map
                    customMapStyles={{ width: '75%', height: '50vh' }}
                    gyms={this.listGyms()}
                  />
                ) : null}
              </div>
            ) : null}
            {this.renderResults('small')}
            <div className="text-center my-2">
              <Link to="/advancedSearch">Advanced Search</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  renderSize() {
    if (this.props.screenSize > breakpoints.medium)
      return this.renderLargeResults();
    if (this.props.screenSize > breakpoints.small)
      return this.renderMediumResults();
    else return this.renderSmallResults();
  }

  render() {
    return <div>{this.renderSize()}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    screenSize: state.screenSize,
    openMats: state.openMats,
    searchOptions: state.searchOptions,
    sortBy: state.sortBy,
  };
};

export default connect(mapStateToProps, {
  searchOpenmats,
  getGyms,
  refreshMap,
  setSortBy,
})(SearchResults);
