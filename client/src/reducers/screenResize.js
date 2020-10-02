import { SCREEN_RESIZE } from '../actions/types'

//null means waiting for initial response
export default (state = false, action) => {
    switch(action.type) {
        case (SCREEN_RESIZE):
            return action.payload
        default:
            return state
    }
}