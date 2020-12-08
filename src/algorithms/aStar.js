import { cloneDeep } from 'lodash';
import { forEachChild } from 'typescript';

const aStar = (boardCoordinate, startPoint, endPoint) => {
    const boardCoordinateCopy = cloneDeep(boardCoordinate);
    const visitedPoints = [];
    const shortestPath = [];
    const openList = [];
    const closedList = [];
    boardCoordinateCopy[startPoint] = {
        ...boardCoordinateCopy[startPoint],
        distanceFromStart: 0,
        heuristicDistance: 0,
        fValue: null,
        open: false,
        closed: false,
        prev: null
    }
    let currentPoint = boardCoordinateCopy[startPoint];
    while (currentPoint.index !== endPoint) {
        const neighbors = ((currentPoint) => {
            const x = currentPoint.x
            const y = currentPoint.y
            const up = `${y + 1}-${x}`;
            const down = `${y - 1}-${x}`;
            const left = `${y}-${x - 1}`;
            const right = `${y}-${x + 1}`;
            return [left, up, down, right].filter(point => boardCoordinateCopy[point] !== undefined && boardCoordinateCopy[point].pointType === 'unvisited');
        })(currentPoint)
        neighbors.forEach(point => {
            if (!openList.includes(point) && !closedList.includes(point)) {
                openList.push(point);
                const distanceFromStart = Math.abs(boardCoordinateCopy[startPoint].x - boardCoordinateCopy[point].x)
                    +
                    Math.abs(boardCoordinateCopy[startPoint].y - boardCoordinateCopy[point].y)
                const heuristicDistance = 1* boardCoordinateCopy[point].x + 3 * boardCoordinateCopy[point].y;
                const fValue = distanceFromStart + heuristicDistance;

                if (fValue < boardCoordinateCopy[point].fValue || boardCoordinateCopy[point].fValue === undefined) {
                    boardCoordinateCopy[point].distanceFromStart = distanceFromStart;
                    boardCoordinateCopy[point].heuristicDistance = heuristicDistance;
                    boardCoordinateCopy[point].fValue = fValue;
                    boardCoordinateCopy[point].prev = currentPoint.index;
                }
            }
        })
        closedList.push(currentPoint.index);
        const newCurrentPoint = ((openList) => {
            const openListPoints = openList.map(point => {
                return boardCoordinateCopy[point]
            })
            const sortList = openListPoints.sort((a, b) => {
                if (a.fValue <= b.fValue) {
                    return -1;
                } else {
                    return 1;
                }
            })
            return sortList[0];
        })(openList)
        openList.splice(openList.indexOf(newCurrentPoint.index), 1);
        visitedPoints.push(currentPoint)
        currentPoint = newCurrentPoint;
    }
    let prev = boardCoordinateCopy[endPoint].prev;
    while(prev != null){
        shortestPath.push(prev);
        prev = boardCoordinateCopy[prev].prev;
    }
    shortestPath.reverse();
    return {
        visitedPoints: visitedPoints,
        shortestPath: shortestPath
    }

}
export default aStar;