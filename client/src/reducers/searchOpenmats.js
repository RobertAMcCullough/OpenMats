import { SEARCH_OPENMATS } from '../actions/types'

export default (state = [], action) => {
    switch(action.type) {
        case (SEARCH_OPENMATS):
            if(action.payload===undefined) return state
            return action.payload
        default:
            return state
    }
}