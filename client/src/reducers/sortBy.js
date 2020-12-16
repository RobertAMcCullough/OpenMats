import { SORT_BY } from '../actions/types'

export default (state = "Distance", action) => {
    switch(action.type) {
        case (SORT_BY):
            if(action.payload===undefined) return state
            return action.payload
        default:
            return state
    }
}