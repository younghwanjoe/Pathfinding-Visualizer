import React from 'react';
import GridBox from './GridBox';
import { useSelector } from 'react-redux';

const GridBoard = () => {

  const { countAxisX, countAxisY,boardCoordinate } = useSelector(({ countAxisX, countAxisY, boardCoordinate }) => ({
    countAxisX,
    countAxisY,
    boardCoordinate,
  }));

  const getGridBoard = () => {
    const gridList = Object.keys(boardCoordinate).map((point) => {
      const { x, y, pointType, visited, wall, cost } = boardCoordinate[point];
      const key = `${y}-${x}`;
      const gridBox = (
        <GridBox
          x={x}
          y={y}
          pointType={pointType}
          visited={visited}
          wall={wall}
          cost={cost}
          key={key}
        ></GridBox>
      );
      return gridBox;
    });
    const gridBoard = [];
    
    for(let y =0; y< countAxisY; y++){
      const gridRow = gridList.splice(0,countAxisX)
      gridBoard.push(
        <div className="row" key={`row-${y}`}>
          {gridRow}
        </div>
      );
    }
    return gridBoard;
  };

  return <section className="grid-board">{getGridBoard()}</section>;
};

export default GridBoard;
