const countAxisX = 30;
const countAxisY = 30;

// initializing boardCoordinate
const boardCoordinate = {};
[...Array(countAxisY).keys()].forEach(y => {
    [...Array(countAxisX).keys()].forEach(x => {
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
    endPoint: '20-20',
    countAxisX: 50,
    countAxisY: 25,
    toVisitPoints: ['0-0'],
    currentSearchPoints: [],
    toVisitPoints: []
}



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
        case 'gridBoard/updateToVisitPoints' : {
            return {
                ...state,
                toVisitPoints: action.payload
            }
        }
        default:
            return state;
    }
}

export default reducer;