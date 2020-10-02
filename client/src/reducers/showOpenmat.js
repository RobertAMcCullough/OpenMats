import { SHOW_OPENMAT, CLEAR_PREVIOUS } from '../actions/types'

export default (state = null, action) => {
    switch(action.type) {
        case (SHOW_OPENMAT):
            return action.payload
        case (CLEAR_PREVIOUS):
            return action.payload
        default:
            return state
    }
}