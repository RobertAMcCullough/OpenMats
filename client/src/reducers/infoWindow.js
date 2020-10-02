import { INFO_WINDOW } from '../actions/types'

export default (state = null, action) => {
    switch(action.type) {
        case (INFO_WINDOW):
            return action.payload
        default:
            return state
    }
}