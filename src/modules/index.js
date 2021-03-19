import cloneDeep from 'lodash/fp/cloneDeep';

const COUNT_AXIS_X = 30;
const COUNT_AXIS_Y = 20;

// initializing boardCoordinate
const START_POINT = '5-5';
const END_POINT = '10-10';

const createBoardCoordinate = (countAxisX,countAxisY,startPoint,endPoint) => {
  const board = {}
  for(let y=0; y < countAxisY; y++){
    for(let x=0; x < countAxisX; x++){
      board[`${y}-${x}`] = {
        index: `${y}-${x}`,
        x: x,
        y: y,
        pointType: 'unvisited',
        wall: false,
        visited: false,
        cost: 1,
        shortest: Infinity, //shortest cost from startPoint
        prev: null, //previous vertex
      };
    }
  }
  board[startPoint]['pointType'] = 'start'
  board[endPoint]['pointType'] = 'end'
  return board
};

const boardCoordinate = createBoardCoordinate(COUNT_AXIS_X,COUNT_AXIS_Y,START_POINT,END_POINT);

const initialState = {
  boardCoordinate: boardCoordinate,
  startPoint: START_POINT,
  endPoint: END_POINT,
  countAxisX: COUNT_AXIS_X,
  countAxisY: COUNT_AXIS_Y,
  currentSearchPoints: [],
  algorithm: 'dijkstra',
  visitedPoints: [],
  shortestPath: [],
  dragTarget: null,
};

export const SET_START_POINT = 'gridBox/setStartPoint';
export const SET_END_POINT = 'gridBox/setEndPoint';
export const RESET_STATE = 'controllor/resetState';
export const UPDATE_BOX = 'controller/updateBox';
export const UPDATE_SHORTEST_PATH = 'controller/updateShortestPath';
export const UPDATE_DRAG_TARGET = 'updateDragTarget';

export function setStartPointAction({ point }) {
  return { type: SET_START_POINT, point };
}
export function setEndPointAction({ point }) {
  return { type: SET_END_POINT, point };
}
export function resetStateAction() {
  return { type: RESET_STATE };
}
export function updateBoxAction({ point, pointType }) {
  return { type: UPDATE_BOX, point, pointType };
}
export function updateShortestPathAction({ algorithm }) {
  return { type: UPDATE_SHORTEST_PATH, algorithm };
}
export function updateDragTargetAction({ point }) {
  return { type: UPDATE_DRAG_TARGET, point };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_START_POINT: {
      const {point} = action;
      const {startPoint} = state;
      const prevBox = {
        ...state['boardCoordinate'][startPoint],
        pointType: 'unvisited'
      };
      const newBox = {
        ...state['boardCoordinate'][point],
        pointType: 'start'
      };
      return {
        ...state,
        boardCoordinate: {
          ...state['boardCoordinate'],
          [startPoint]: prevBox,
          [point]: newBox,
        },
        startPoint: point,
      };
    }

    case SET_END_POINT: {
      const {point} = action;
      const {endPoint} = {...state};
      const prevBox = {
        ...state['boardCoordinate'][endPoint],
        pointType: 'unvisited'
      };
      const newBox = {
        ...state['boardCoordinate'][point],
        pointType: 'end'
      };
      return {
        ...state,
        boardCoordinate: {
          ...state['boardCoordinate'],
          [endPoint]: prevBox,
          [point]: newBox,
        },
        endPoint: point,
      };
    }

    case RESET_STATE: {
      return initialState;
    }

    case UPDATE_BOX: {
      const { point, pointType } = action;
      const newBox = {
        ...state['boardCoordinate'][point],
        pointType
      };
      return {
        ...state,
        boardCoordinate: {
          ...state['boardCoordinate'],
          [point]: newBox,
        },
      };
    }

    case UPDATE_SHORTEST_PATH: {
      switch (action.algorithm) {
        case 'Daijkstra': {
          const visitedPoints = [];
          const { startPoint, endPoint } = state;
          const boardCoordinateCopy = cloneDeep(state.boardCoordinate);
          boardCoordinateCopy[startPoint] = {
            ...boardCoordinateCopy[startPoint],
            shortest: 0,
          };
          let unvisitedPoints = Object.values(boardCoordinateCopy).filter(
            (el) => {
              return el.pointType === 'unvisited' && el.shortest !== Infinity;
            }
          );
          let foundEndPoint = false;
          while (unvisitedPoints.length >= 1 && foundEndPoint === false) {
            const searchPoints = unvisitedPoints.sort(function (a, b) {
              if (a.shortest >= b.shortest) {
                return 1;
              } else {
                return -1;
              }
            });
            for (let i = 0; i < searchPoints.length; i++) {
              const currentPoint = searchPoints[i];
              if (currentPoint.index === endPoint) {
                foundEndPoint = true;
                break;
              } else {
                boardCoordinateCopy[currentPoint.index].pointType = 'visited';
                visitedPoints.push(currentPoint);
                const x = currentPoint.x;
                const y = currentPoint.y;
                const up = `${y + 1}-${x}`;
                const down = `${y - 1}-${x}`;
                const left = `${y}-${x - 1}`;
                const right = `${y}-${x + 1}`;
                const neighbors = [left, up, down, right].filter(
                  (point) =>
                    boardCoordinateCopy[point] !== undefined &&
                    boardCoordinateCopy[point].pointType === 'unvisited'
                );
                if (neighbors.length > 0) {
                  neighbors.forEach((point) => {
                    if (
                      boardCoordinateCopy[point].shortest >
                      boardCoordinateCopy[point].cost + currentPoint.shortest
                    ) {
                      boardCoordinateCopy[point].shortest =
                        currentPoint.shortest;
                      boardCoordinateCopy[point].prev = currentPoint.index;
                    }
                  });
                }
              }
            }
            unvisitedPoints = Object.values(boardCoordinateCopy).filter(
              (el) => {
                return el.pointType === 'unvisited' && el.shortest !== Infinity;
              }
            );
          }

          const shortestPath = [];
          let lastPoint = endPoint;
          while (lastPoint !== null) {
            if (boardCoordinateCopy[lastPoint] !== undefined) {
              lastPoint = boardCoordinateCopy[lastPoint].prev;
              if (lastPoint !== null) {
                shortestPath.push(lastPoint);
                boardCoordinateCopy[lastPoint].pointType = 'path';
              }
            } else {
              lastPoint = null;
            }
          }
          shortestPath.reverse();
          return {
            ...state,
            visitedPoints: visitedPoints,
            shortestPath: shortestPath,
          };
        }
        default:
          return state;
      }
    }

    case UPDATE_DRAG_TARGET: {
      const point = action.point;
      return {
        ...state,
        dragTarget: point,
      };
    }
    default:
      return state;
  }
};

export default reducer;
