import { combineReducers } from 'redux';

const boardCoordinate ={}

const initialState = {
    clickType : 'wall',
    'boardCoordinate': boardCoordinate,
    startPoint: false,
    endPoint: false
}

const setStartPointAction = (payload)=> ({
    type: 'gridBox/setStartPoint',
    payload: payload
});

const setEndPointAction = (payload) => ({
    type: 'gridBox/setEndPoint',
    payload: payload
})

const reducer = (state =  initialState, action) => {
    switch(action.type) {
        case 'gridBox/setStartPoint' :
            return {
                ...state,
                startPoint: action.payload
            }
        case 'gridBox/setEndPoint' :
            return {
                ...state,
                endPoint: action.payload
            }
        default:
            return state;
    }
}

export default reducer;