import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateBoxAction,
  setStartPointAction,
  setEndPointAction,
  updateDragTargetAction,
} from '../modules';

const GridBox = (props) => {
  const { x, y, pointType } = props;
  const { startPoint, endPoint, dragTarget } = useSelector(
    ({ startPoint, endPoint, dragTarget }) => ({
      startPoint,
      endPoint,
      dragTarget,
    })
  );
  const boxPoint = `${y}-${x}`;
  const [boxClass, setBoxClass] = useState('box');


  useEffect(() => {
    switch(pointType){
      case 'path':
        setBoxClass('box path');
        break;
      case 'unvisited':
        setBoxClass('box')
        break;
      case 'visited':
        setBoxClass('box visited')
        break;
      case 'wall':
        setBoxClass('box wall');
        break;
      case 'start':
        setBoxClass('box start-point');
        break;
      case 'end':
        setBoxClass('box end-point');
        break;
      default:
        return
    }
  },[pointType])

  const { boardCoordinate } = useSelector(({ boardCoordinate }) => ({
    boardCoordinate: boardCoordinate,
  }));

  const dispatch = useDispatch();

  const updateBox = useCallback(
    ({point,pointType}) =>
      dispatch(
        updateBoxAction({
          point,pointType
        })
      ),
    [dispatch]
  );

  const dispatchStartPoint = useCallback(
    ({point}) => {
      dispatch(
        setStartPointAction({
          point,
          pointType: 'end'
        })
      );
    },
    [dispatch]
  );

  const dispatchEndPoint = useCallback(
    ({point}) => {
      dispatch(
        setEndPointAction({
          point
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
    dispatchEndPoint({point:boxPoint});
  };

  const onClick = (e) => {
    e.preventDefault();
    if(pointType === 'wall' || pointType === 'unvisited'){
      updateBox({
        point: boxPoint,
        pointType: pointType === 'wall' ? 'unvisited' : 'wall'
      });
    }
  };
  const dispatchDragTarget = useCallback(
     ({point})=> {
        dispatch(
          updateDragTargetAction({
            point
          })
        );
    },
    [dispatch]
  );

  const onDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (boxPoint === startPoint) {
      dispatchDragTarget({point: boxPoint});
    } else if (boxPoint === endPoint) {
      dispatchDragTarget({point: boxPoint});
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
    dispatchDragTarget({point:null});
  };

  const onDrop = (e) => {
    if (dragTarget === startPoint) {
      dispatchStartPoint({point:boxPoint});
    } else if (dragTarget === endPoint) {
      dispatchEndPoint({point:boxPoint});
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
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      draggable={true}
    ></div>
  );
};

export default GridBox;
