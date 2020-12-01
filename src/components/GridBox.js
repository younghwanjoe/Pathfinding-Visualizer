import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GridBox = (props) => {
    const { x, y, pointType, visited, wall, order, boxClass, boxStyle } = props;
    const { startPoint, endPoint } = useSelector(({ startPoint, endPoint })=>({
        startPoint: startPoint,
        endPoint: endPoint
    }))
    const boxPoint = `${y}-${x}`
    const { boardCoordinate } = useSelector(({ boardCoordinate }) => ({
        boardCoordinate: boardCoordinate
    }));
    const dispatch = useDispatch();

    const updateBox = useCallback(payload => dispatch({
        type: 'controller/updateBox',
        payload: payload
    }),[dispatch])

    const dispatchStartPoint = useCallback(payload => {
        dispatch({
            type: "gridBox/setStartPoint",
            payload: payload
        })
    }, [dispatch]);
    
    const dispatchEndPoint = useCallback(payload => {
        dispatch({
            type: "gridBox/setEndPoint",
            payload: payload
        })
    }, [dispatch]);

    const rightMouseClick = (e) => {
        e.preventDefault();
        dispatchStartPoint(boxPoint);
        // setBoxClass("box start-point");
    }

    const onClick = (e) => {
        e.preventDefault();
        // if (boxPoint === startPoint) {
        //     dispatchStartPoint(false);
        // } else if (boxPoint === endPoint) {
        //     dispatchEndPoint(false);
        // }
        updateBox({ 
            point: boxPoint, 
            pointType: boardCoordinate[boxPoint]['pointType'] === 'wall' ? 'unvisited' : 'wall'
        })

    }

    const onDrag = (e) => {
        e.preventDefault();
        console.log(boxPoint)
        boxClass = "box wall";
    }

    const onDragStart = (e) => {
        e.preventDefault();
        if (boxPoint === startPoint) {
            dispatchStartPoint(false);
        } else if (boxPoint === endPoint) {
            dispatchEndPoint(false);
        }

        const newClass = boxClass.includes("wall") ? "box" : "box wall";
        // setBoxClass(newClass);
    }

    return <div id={`column ${boxPoint}`}
        className={boxClass}
        style={boxStyle}
        onContextMenu={rightMouseClick}
        onClick={onClick}
        onDragEnter={onDrag}
        onDrag={onDrag}
    ></div>
}

export default GridBox