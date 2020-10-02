import { SEARCH_GYMS } from '../actions/types'

export default (state = [], action) => {
    switch(action.type) {
        case (SEARCH_GYMS):
            if(action.payload===undefined) return state
            return action.payload
        default:
            return state
    }
}