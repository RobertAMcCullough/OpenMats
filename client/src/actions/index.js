import axios from 'axios';
import addNulls from '../utilities/addNulls';

import {
  SCREEN_RESIZE,
  FETCH_TOTALS,
  FETCH_USER,
  OPEN_MODAL,
  REFRESH_MAP,
  INFO_WINDOW,
  SET_SEARCH_OPTIONS,
  SEARCH_OPENMATS,
  CREATE_OPENMAT,
  SHOW_OPENMAT,
  SEARCH_GYMS,
  SHOW_GYM,
  RESET_MAT_ID,
  CLEAR_PREVIOUS,
  UPDATE_OPENMAT,
  UPDATE_GYM,
  SORT_BY,
} from './types';
import applyFilters from '../utilities/applyFilters';

axios.defaults.withCredentials = true;

//stores the width of the current display in pixels for use in responsive componenets
export const screenResize = (width) => {
  return {
    type: SCREEN_RESIZE,
    payload: width,
  };
};

//fetches number of openmats, gyms, and US states for home screen
//thunk returns a promise which is manually dispatched
export const fetchTotals = () => async (dispatch) => {
  const totals = await axios.get(
    `${process.env.REACT_APP_API_URL}/gyms/totals`
  );

  dispatch({
    type: FETCH_TOTALS,
    payload: totals,
  });
};

//get currently logged in user using redux-thunk
export const fetchUser = () => async (dispatch) => {
  const user = await axios.get(
    `${process.env.REACT_APP_API_URL}/auth/currentUser`
  );

  dispatch({
    type: FETCH_USER,
    payload: user,
  });
};

//switches open states of signup and login modals
//modal arg is either 'signup', 'login' or 'delete', isOpen arg is boolean
export const openModal = (modal, isOpen) => {
  return {
    type: OPEN_MODAL,
    payload: [modal, isOpen],
  };
};

//if refreshMap is ever set to true, the map will be refreshed, this is done when resorting list
//anytime refreshMap is set to true, it must be set back to false right after the map is updated so it doesn't keep updating which has a fee associated with it
export const refreshMap = (trueOrFalse) => {
  return {
    payload: trueOrFalse,
    type: REFRESH_MAP,
  };
};

//indicates the infoWindow that should be active on google map due to hovering on marker
export const infoWindow = (id) => {
  return {
    payload: id,
    type: INFO_WINDOW,
  };
};

//stores advanced search options. an empty object means there are no advanced search options requested by the user
export const setSearchOptions = (options) => {
  return {
    payload: options,
    type: SET_SEARCH_OPTIONS,
  };
};

//stores what to sort search results by
export const setSortBy = (item) => {
  return {
    payload: item,
    type: SORT_BY,
  };
};

/////////////////////////////////////////
// OPENMAT CRUD ACTION CREATORS

//queries the api for a list of openmats
//'options' argument is optional and only used with advanced search options
export const searchOpenmats = (options) => async (dispatch) => {
  const lat = sessionStorage.getItem('lat');
  const lng = sessionStorage.getItem('lng');

  let searchResults;

  if (!options || !options.searchTerm) {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/openmats?lat=${lat}&lng=${lng}&distance=${50}`);
    searchResults = res.data;
  } else {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/openmats?lat=${lat}&lng=${lng}&distance=${options.distance || 50}`
    );
    searchResults = applyFilters(res.data, options);
  }

  dispatch({
    payload: searchResults,
    type: SEARCH_OPENMATS,
  });
};

//handled by newMatId reducer
export const createOpenmat = (newOpenmat) => async (dispatch) => {
  //response will either be id of the newly created openmat, or -1 if there was a problem inserting data
  const newId = await axios.post(
    `${process.env.REACT_APP_API_URL}/openmats`,
    addNulls(newOpenmat)
  );

  dispatch({
    payload: newId.data,
    type: CREATE_OPENMAT,
  });
};

//just resets the 'newMatId' variable in state, which is used for redirecting after a mat is created or updated
//handled by newMatId reducer
export const resetMatId = () => {
  return {
    payload: null,
    type: RESET_MAT_ID,
  };
};

export const showOpenmat = (id) => async (dispatch) => {
  //response will be all the info about one open mat
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/openmats/${id}`
  );

  let details = response.data;

  details.id = id; //make sure the openmat id and not the gym id is set here

  dispatch({
    payload: details,
    type: SHOW_OPENMAT,
  });
};

//resets 'matDetails' and 'gymDetails' variables in state, so they don't show while waiting for a new search to return
//handled by 'showOpenMat' and 'showGym' reducers
export const clearPrevious = () => {
  return {
    payload: null,
    type: CLEAR_PREVIOUS,
  };
};

//handled by newMat reducer
export const updateOpenmat = (updatedMat) => async (dispatch) => {
  await axios.put(
    `${process.env.REACT_APP_API_URL}/openmats/${updatedMat.id}`,
    addNulls(updatedMat)
  );

  dispatch({
    payload: updatedMat.id,
    type: UPDATE_OPENMAT,
  });
};

/////////////////////////////////////////
// GYM CRUD ACTION CREATORS

// get list of all gyms
export const getGyms = () => async (dispatch) => {
  const searchResults = await axios.get(
    `${process.env.REACT_APP_API_URL}/gyms`
  );

  dispatch({
    payload: searchResults.data,
    type: SEARCH_GYMS,
  });
};

//this creates a new gym and then creates a new open mat to go with it
//handled by newMatId reducer
export const createGym = (newGym, newOpenmat) => async (dispatch) => {
  //first create a new gym
  //response will either be id of the newly created gym, or -1 if there was a problem inserting data
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/gyms`,
    newGym
  );

// next create openmat with gym's id
    const newMatId = await axios.post(`${process.env.REACT_APP_API_URL}/openmats`, {
      ...addNulls(newOpenmat),
      gym_id: response.data,
    });

    dispatch({
      payload: newMatId.data,
      type: CREATE_OPENMAT,
    });
};

export const showGym = (id) => async (dispatch) => {
  //response will be an array of all the open mats associated with one gym, plus the gym data
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/gyms/gymWithMats/${id}`
  );

  dispatch({
    payload: response.data,
    type: SHOW_GYM,
  });
};

//handled by newMat reducer
export const updateGym = (updatedGym) => async (dispatch) => {
  await axios.put(
    `${process.env.REACT_APP_API_URL}/gyms/${updatedGym.id}`,
    updatedGym
  );

  dispatch({
    payload: updatedGym.id,
    type: UPDATE_GYM,
  });
};
