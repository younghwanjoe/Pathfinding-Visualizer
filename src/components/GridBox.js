import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GridBox = (props) => {
    const { x, y, visited, wall, cost } = props;
    const { startPoint, endPoint } = useSelector(({ startPoint, endPoint })=>({
        startPoint: startPoint,
        endPoint: endPoint
    }))
    const boxPoint = `${y}-${x}`
    useEffect(() => {
        if (wall) {
            setBoxClass('box wall')
        } 
        else if(boxPoint == startPoint) {
            setBoxClass('box start-point')
        }
        else if(boxPoint == endPoint) {
            setBoxClass('box end-point')
        }
        else {
            setBoxClass('box')
        }
    },[wall, startPoint, endPoint])
    const [boxClass, setBoxClass] = useState('box');

    const { boardCoordinate } = useSelector(({ boardCoordinate }) => ({
        boardCoordinate: boardCoordinate
    }));

    const dispatch = useDispatch();
    const updateBoxType = useCallback(payload => {
        dispatch({
            type: "gridBoard/updateBoxType",
            payload: payload
        })
    }, [dispatch]);

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

    const mouseEnter = () => {
        setBoxClass(boxClass + " hover");
    }
    const mouseLeave = () => {
        setBoxClass(boxClass.replace(" hover", ""));
    }
    const rightMouseClick = (e) => {
        e.preventDefault();
        dispatchStartPoint(boxPoint);
        setBoxClass("box start-point");

    }

    const onClick = (e) => {
        e.preventDefault();
        if (boxPoint === startPoint) {
            dispatchStartPoint(false);
        } else if (boxPoint === endPoint) {
            dispatchEndPoint(false);
        }

        updateBoxType({ point: boxPoint, wall: !boardCoordinate[boxPoint]['wall'] })

    }
    const onDragStart = (e) => {
        e.preventDefault();
        console.log(boxPoint)
        if (boxPoint === startPoint) {
            dispatchStartPoint(false);
        } else if (boxPoint === endPoint) {
            dispatchEndPoint(false);
        }

        const newClass = boxClass.includes("wall") ? "box" : "box wall";
        setBoxClass(newClass);
    }

    return <div id={`column ${boxPoint}`}
        className={boxClass}
        onContextMenu={rightMouseClick}
        onClick={onClick}
        onDragEnter={onClick}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
    ></div>
}

export default GridBox