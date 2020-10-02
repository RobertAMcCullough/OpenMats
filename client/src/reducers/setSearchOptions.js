import { SET_SEARCH_OPTIONS } from '../actions/types'

//null means waiting for initial response
export default (state = {}, action) => {
    switch(action.type) {
        case (SET_SEARCH_OPTIONS):
            return action.payload
        default:
            return state
    }
}