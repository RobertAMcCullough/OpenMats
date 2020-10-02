import { CREATE_OPENMAT, UPDATE_OPENMAT, UPDATE_GYM, RESET_MAT_ID } from '../actions/types'

export default (state = null, action) => {
    switch(action.type) {
        case (CREATE_OPENMAT):
            return action.payload
        case (UPDATE_OPENMAT):
            return action.payload
        case (UPDATE_GYM):
            return action.payload
        case (RESET_MAT_ID):
            return null
        default:
            return state
    }
}