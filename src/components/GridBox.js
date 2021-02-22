import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GridBox = (props) => {
  const { x, y, pointType, visited, wall } = props;
  const { startPoint, endPoint } = useSelector(({ startPoint, endPoint }) => ({
    startPoint: startPoint,
    endPoint: endPoint,
  }));
  const boxPoint = `${y}-${x}`;
  useEffect(() => {
    if (pointType === 'path') {
      setBoxClass('box path');
    } else if (pointType === 'unvisited') {
      setBoxClass('box');
    } else if (pointType === 'visited') {
      setBoxClass('box visited');
    } else if (pointType === 'wall') {
      setBoxClass('box wall');
    }

    if (boxPoint === startPoint) {
      setBoxClass('box start-point');
    } else if (boxPoint === endPoint) {
      setBoxClass('box end-point');
    }
  }, [startPoint, endPoint, boxPoint, pointType, wall, visited]);
  const [boxClass, setBoxClass] = useState('box');

  const { boardCoordinate } = useSelector(({ boardCoordinate }) => ({
    boardCoordinate: boardCoordinate,
  }));

  const dispatch = useDispatch();

  const updateBox = useCallback(
    (payload) =>
      dispatch({
        type: 'controller/updateBox',
        payload: payload,
      }),
    [dispatch]
  );

  const dispatchStartPoint = useCallback(
    (payload) => {
      dispatch({
        type: 'gridBox/setStartPoint',
        payload: payload,
      });
    },
    [dispatch]
  );

  const dispatchEndPoint = useCallback(
    (payload) => {
      dispatch({
        type: 'gridBox/setEndPoint',
        payload: payload,
      });
    },
    [dispatch]
  );

  const mouseEnter = () => {
    setBoxClass(boxClass + ' hover');
  };
  const mouseLeave = () => {
    setBoxClass(boxClass.replace(' hover', ''));
  };
  const rightMouseClick = (e) => {
    e.preventDefault();
    dispatchEndPoint(boxPoint);
    // setBoxClass("box start-point");
  };

  const onClick = (e) => {
    e.preventDefault();
    // if (boxPoint === startPoint) {
    //     dispatchStartPoint(false);
    // } else if (boxPoint === endPoint) {
    //     dispatchEndPoint(false);
    // }
    updateBox({
      point: boxPoint,
      pointType:
        boardCoordinate[boxPoint]['pointType'] === 'wall'
          ? 'unvisited'
          : 'wall',
    });
  };
  const onDragStart = (e) => {
    e.preventDefault();
    console.log(boxPoint);
    if (boxPoint === startPoint) {
      dispatchStartPoint(false);
    } else if (boxPoint === endPoint) {
      dispatchEndPoint(false);
    }

    const newClass = boxClass.includes('wall') ? 'box' : 'box wall';
    setBoxClass(newClass);
  };

  return (
    <div
      id={`column ${boxPoint}`}
      className={boxClass}
      onContextMenu={rightMouseClick}
      onClick={onClick}
      onDragEnter={onClick}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      draggable={true}
    ></div>
  );
};

export default GridBox;
