import { combineReducers } from 'redux'

import screenResize from './screenResize'
import fetchUser from './fetchUser'
import openModal from './openModal'
import refreshMap from './refreshMap'
import infoWindow from './infoWindow'
import setSearchOptions from './setSearchOptions'
import searchOpenmats from './searchOpenmats'
import newMatId from './newMatId'
import showOpenmat from './showOpenmat'
import searchGyms from './searchGyms'
import showGym from './showGym'

export default combineReducers({
    screenSize: screenResize,
    user: fetchUser,
    openModal: openModal,
    refreshMap: refreshMap,
    infoWindow: infoWindow,
    searchOptions: setSearchOptions,
    openMats: searchOpenmats, //list of all open mats
    newMatId: newMatId, //id of newly created open mat
    matDetails: showOpenmat, //fetch single open mat
    gyms: searchGyms, //list of search results of gyms for area
    gymDetails: showGym //fetch single gym
})