import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const StartButton = ({ startButtonClick, restartButtonClick, trigger }) => {
    if(trigger){
        return (
            <div className="button-wrap">
                <button
                    className="button start"
                    onClick={restartButtonClick}
                >PAUSE</button>
            </div>
        )
    }else {
        return (
            <div className="button-wrap">
                <button
                    className="button start"
                    onClick={startButtonClick}
                >START</button>
            </div>
        )
    }
}

const ResetButton = ({ onClick }) => {
    return (
        <div className="button-wrap">
            <button className="button reset" onClick={onClick}>RESET</button>
        </div>
    )
}

const Controller = () => {
    const dispatch = useDispatch();
    const updateBoxType = useCallback(payload => {
        dispatch({
            type: "gridBoard/updateBoxType",
            payload: payload
        })
    }, [dispatch]);
    const [trigger, setTrigger] = useState(false)
    const [pathCount, setPathCount] = useState(0)
    const [shortestPathCount, setShortestPathCount] = useState(0)
    const [elapsedTime, setElapsedTime] = useState("00:00:00")
    const [moveCount, setMoveCount] = useState(0);

    const { visitedPoints, shortestPath } = useSelector(({ visitedPoints, shortestPath }) => ({
        visitedPoints: visitedPoints,
        shortestPath: shortestPath
    }))

    const savedCallback = useRef();

    function callback() {
        if(visitedPoints[pathCount] != undefined){
            updateBox({
                point: visitedPoints[pathCount].index,
                pointType: 'visited'
            })
            setMoveCount(moveCount + 1)
            setPathCount(pathCount + 1)
        }else{ 
            updateBox({
                point: shortestPath[shortestPathCount],
                pointType: 'path'
            })
            setShortestPathCount(shortestPathCount + 1)
        }
    }

    useEffect(() => {
        savedCallback.current = callback
    });
    
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if(trigger) {
            let id = setInterval(tick, 3);
            return () => {
                clearInterval(id)
            };
        }
    },[trigger])

    const startButtonClick = () => {
        if(shortestPath.length === 0){
            updateShortestPath({
                algorithm: 'Daijkstra'
            })
        }
        setTrigger(true)
    }

    const restartButtonClick = () => {
        setTrigger(false)
    }

    const resetState = useCallback(() => {
        dispatch({
            type: 'controllor/resetState'
        })
    }, [dispatch])

    const resetButtonClick = () => {
        setTrigger(false)
        setPathCount(0)
        setShortestPathCount(0)
        setMoveCount(0)
        setElapsedTime("00:00:00")
        resetState()
    }

    const {boardCoordinate, startPoint, endPoint} = useSelector( ({boardCoordinate, startPoint, endPoint }) => ({
        boardCoordinate: boardCoordinate,
        startPoint: startPoint,
        endPoint: endPoint
    }));

    const updateBox = useCallback(payload => dispatch({
        type: 'controller/updateBox',
        payload: payload
    }),[dispatch])

    const updatePath = useCallback(payload => dispatch({
        type: 'controller/updatePath',
        payload: payload
    }),[dispatch])

    const updateShortestPath = useCallback(payload => dispatch({
        type: 'controller/updateShortestPath',
        payload: payload
    }),[dispatch])



    return (
        <section id="controller">
            <div className="right">
                <StartButton 
                startButtonClick={startButtonClick} 
                restartButtonClick={restartButtonClick}
                trigger={trigger}/>
                <ResetButton onClick={resetButtonClick} />
                <div className="counter">
                    {/* <div className="counter-box">
                        <p className="elapsed-time">{elapsedTime}</p>
                    </div> */}
                    <div className="counter-box">
                        <p className="move-counter">{moveCount}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Controller;