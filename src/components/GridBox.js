import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GridBox = (props) => {
    const { x, y } = props;
    const boxPoint = `${y}-${x}`

    const [boxType, setBoxType] = useState('blank');
    const [boxClass, setBoxClass] = useState('box');

    const { startPoint, endPoint } = useSelector(state => ({
        startPoint: state.startPoint,
        endPoint: state.endPoint
    }))

    const dispatch = useDispatch();
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

    const clickBox = () => {
        if(boxPoint === startPoint){
            dispatchStartPoint(false);
        } else if(boxPoint === endPoint) {
            dispatchEndPoint(false);
        }

        const newType = boxType === "blank" ? "wall" : "blank";
        setBoxType(newType);

        const newClass = boxClass.includes("wall") ? "box" : "box wall";
        setBoxClass(newClass);
    }
    const mouseEnter = () => {
        setBoxClass(boxClass + " hover");
    }
    const mouseLeave = () => {
        setBoxClass(boxClass.replace(" hover", ""));
    }
    const rightMouseClick = (e) => {
        e.preventDefault();
        console.log(startPoint,endPoint);
        if(!startPoint){
            dispatchStartPoint(boxPoint);
            setBoxClass("box start-point");
        }else if(startPoint && !endPoint){
            dispatchEndPoint(boxPoint);
            setBoxClass("box end-point");
        }
    }

    return <div id={`column ${boxPoint}`}
        className={boxClass}
        onClick={clickBox}
        onContextMenu={rightMouseClick}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
    ></div>
}

export default GridBox