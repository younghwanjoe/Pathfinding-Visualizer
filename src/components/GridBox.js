import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateBoxAction,
  setStartPointAction,
  setEndPointAction,
  updateDragTargetAction,
} from '../modules';

const GridBox = (props) => {
  const { x, y, pointType, visited, wall } = props;
  const { startPoint, endPoint, dragTarget } = useSelector(
    ({ startPoint, endPoint, dragTarget }) => ({
      startPoint,
      endPoint,
      dragTarget,
    })
  );
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
      dispatch(
        updateBoxAction({
          payload: payload,
        })
      ),
    [dispatch]
  );

  const dispatchStartPoint = useCallback(
    (payload) => {
      dispatch(
        setStartPointAction({
          payload: payload,
        })
      );
    },
    [dispatch]
  );

  const dispatchEndPoint = useCallback(
    (payload) => {
      dispatch(
        setEndPointAction({
          payload: payload,
        })
      );
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
    updateBox({
      point: boxPoint,
      pointType:
        boardCoordinate[boxPoint]['pointType'] === 'wall'
          ? 'unvisited'
          : 'wall',
    });
  };
  const dispatchDragTarget = useCallback(
    (payload) => {
      dispatch(
        updateDragTargetAction({
          payload: payload,
        })
      );
    },
    [dispatch]
  );

  const onDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (boxPoint === startPoint) {
      dispatchDragTarget('startPoint');
    } else if (boxPoint === endPoint) {
      dispatchDragTarget('endPoint');
    } else if (dragTarget === null) {
      updateBox({
        point: boxPoint,
        pointType:
          boardCoordinate[boxPoint]['pointType'] === 'wall'
            ? 'unvisited'
            : 'wall',
      });
    }
  };

  const onDragOver = (e) => {
    // The default action for dragOver is "Reset the current drag operation to none".
    e.preventDefault();
  };

  const onDragEnd = (e) => {
    e.preventDefault();
    dispatchDragTarget(null);
  };

  const onDrop = (e) => {
    if (dragTarget === 'startPoint') {
      dispatchStartPoint(boxPoint);
    } else if (dragTarget === 'endPoint') {
      dispatchEndPoint(boxPoint);
    }
  };
  return (
    <div
      id={`column ${boxPoint}`}
      className={boxClass}
      onContextMenu={rightMouseClick}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      draggable={true}
    ></div>
  );
};

export default GridBox;
