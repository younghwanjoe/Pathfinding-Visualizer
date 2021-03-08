import cloneDeep from 'lodash/fp/cloneDeep';

const countAxisX = 50;
const countAxisY = 20;

// initializing boardCoordinate
const boardCoordinate = {};
[...Array(countAxisY).keys()].forEach((y) => {
  [...Array(countAxisX).keys()].forEach((x) => {
    boardCoordinate[`${y}-${x}`] = {
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
  });
});

const initialState = {
  boardCoordinate: boardCoordinate,
  startPoint: '5-5',
  endPoint: '10-10',
  countAxisX: countAxisX,
  countAxisY: countAxisY,
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

export function setStartPointAction({ payload }) {
  return { type: SET_START_POINT, payload };
}
export function setEndPointAction({ payload }) {
  return { type: SET_END_POINT, payload };
}
export function resetStateAction({ payload }) {
  return { type: RESET_STATE, payload };
}
export function updateBoxAction({ payload }) {
  return { type: UPDATE_BOX, payload };
}
export function updateShortestPathAction({ payload }) {
  return { type: UPDATE_SHORTEST_PATH, payload };
}
export function updateDragTargetAction({ payload }) {
  return { type: UPDATE_DRAG_TARGET, payload };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_START_POINT: {
      return {
        ...state,
        startPoint: action.payload,
      };
    }

    case SET_END_POINT: {
      return {
        ...state,
        endPoint: action.payload,
      };
    }

    case RESET_STATE: {
      return initialState;
    }

    case UPDATE_BOX: {
      const payload = action.payload;
      const keys = Object.keys(payload);
      const newBox = {
        ...state['boardCoordinate'][action.payload.point],
      };
      keys.forEach((key) => {
        newBox[key] = payload[key];
      });
      return {
        ...state,
        boardCoordinate: {
          ...state['boardCoordinate'],
          [action.payload.point]: newBox,
        },
      };
    }

    case UPDATE_SHORTEST_PATH: {
      switch (action.payload.algorithm) {
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
      const payload = action.payload;
      return {
        ...state,
        dragTarget: payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
