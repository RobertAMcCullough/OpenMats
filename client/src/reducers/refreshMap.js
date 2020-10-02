import { REFRESH_MAP } from '../actions/types'

//null means waiting for initial response
export default (state = false, action) => {
    switch(action.type) {
        case (REFRESH_MAP):
            return action.payload
        default:
            return state
    }
}