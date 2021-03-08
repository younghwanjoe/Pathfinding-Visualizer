import React from 'react';
import GridBox from './GridBox';
import { useSelector } from 'react-redux';

const GridBoard = () => {
  const { countAxisY } = useSelector(({ countAxisY }) => ({
    countAxisY,
  }));

  const { boardCoordinate } = useSelector(({ boardCoordinate }) => ({
    boardCoordinate: boardCoordinate,
  }));

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

  const getGridBoard = () => {
    const gridBoard = [];
    [...Array(countAxisY).keys()].forEach((y) => {
      const gridRow = gridList.filter((el) => el.props.y === y);
      gridBoard.push(
        <div className="row" key={`row-${y}`}>
          {gridRow}
        </div>
      );
    });
    return gridBoard;
  };

  return <section className="grid-board">{getGridBoard()}</section>;
};

export default GridBoard;
