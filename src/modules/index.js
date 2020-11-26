import { combineReducers } from 'redux';
import { useStore } from 'react-redux';

const countAxisX = 50;
const countAxisY = 25;

// initializing boardCoordinate
const boardCoordinate = {};
[...Array(countAxisX).keys()].forEach(y => {
    [...Array(countAxisY).keys()].forEach(x => {
        boardCoordinate[`${y}-${x}`] = {}
        boardCoordinate[`${y}-${x}`]['x'] = x
        boardCoordinate[`${y}-${x}`]['y'] = y
        boardCoordinate[`${y}-${x}`]['visited'] = false;
        boardCoordinate[`${y}-${x}`]['wall'] = false;
        boardCoordinate[`${y}-${x}`]['cost'] = "INF";
    })
})

const initialState = {
    clickType : 'wall',
    boardCoordinate: boardCoordinate,
    startPoint: '0-0',
    endPoint: '10-10',
    countAxisX: countAxisX,
    countAxisY: countAxisY,
    toVisitPoints: ['0-0'],
    currentSearchPoints: [],
    currentVisitedPoints: []
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
        case 'gridBox/setStartPoint' : {
            return {
                ...state,
                startPoint: action.payload
            }
        }
        case 'gridBox/setEndPoint' : {
            return {
                ...state,
                endPoint: action.payload
            }
        }
        case 'gridBoard/updateBoxType' : {
            
            return {
                ...state,
                boardCoordinate:  {
                    ...state['boardCoordinate'],
                    [action.payload.point] : {
                        ...state['boardCoordinate'][action.payload.point],
                        wall: action.payload.wall  
                    }
                }
            }
        }
        default:
            return state;
    }
}

export default reducer;