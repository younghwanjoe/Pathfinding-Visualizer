import { cloneDeep } from 'lodash';

const daijkstra = (boardCoordinate, startPoint, endPoint) => {
  const visitedPoints = [];
  const boardCoordinateCopy = cloneDeep(boardCoordinate);
  let orderCount = 0;
  boardCoordinateCopy[startPoint] = {
    ...boardCoordinateCopy[startPoint],
    shortest: 0,
    order: orderCount,
  };
  orderCount = +1;
  let unvisitedPoints = Object.values(boardCoordinateCopy).filter((el) => {
    return el.pointType === 'unvisited' && el.shortest !== Infinity;
  });
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
        boardCoordinateCopy[currentPoint.index].order = orderCount;
        orderCount += 1;
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
              boardCoordinateCopy[point].shortest = currentPoint.shortest;
              boardCoordinateCopy[point].prev = currentPoint.index;
            }
          });
        }
      }
    }
    unvisitedPoints = Object.values(boardCoordinateCopy).filter((el) => {
      return el.pointType === 'unvisited' && el.shortest !== Infinity;
    });
  }

  const shortestPath = [];
  let lastPoint = endPoint;
  while (lastPoint !== null) {
    if (boardCoordinateCopy[lastPoint] !== undefined) {
      lastPoint = boardCoordinateCopy[lastPoint].prev;
      if (lastPoint !== null) {
        shortestPath.push(lastPoint);
        boardCoordinateCopy[lastPoint].pointType = 'path';
        // boardCoordinateCopy[lastPoint].order = orderCount;
        orderCount += 1;
      }
    } else {
      lastPoint = null;
    }
  }
  shortestPath.reverse();
  return {
    visitedPoints: visitedPoints,
    shortestPath: shortestPath,
  };
};

export default daijkstra;
