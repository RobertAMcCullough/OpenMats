import { FETCH_TOTALS } from '../actions/types'

//null means waiting for initial response
export default (state = {mats:0,gyms:0,states:0}, action) => {
    switch(action.type) {
        case (FETCH_TOTALS):
            if(!action.payload.data) return {mats:0,gyms:0,states:0}
            return action.payload.data
        default:
            return state
    }
}