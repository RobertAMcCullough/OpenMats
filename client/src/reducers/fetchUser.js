import { FETCH_USER } from '../actions/types'

//null means waiting for initial response
export default (state = null, action) => {
    switch(action.type) {
        case (FETCH_USER):
            if(!action.payload.data) return false
            return action.payload.data
        default:
            return state
    }
}