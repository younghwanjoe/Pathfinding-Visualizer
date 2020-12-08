import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import daijkstra from '../algorithms/daijkstra';
import aStar from '../algorithms/aStar';

const StartButton = ({ startButtonClick, restartButtonClick, trigger }) => {
    if (trigger) {
        return (
            <div className="button-wrap">
                <button
                    className="button start"
                    onClick={restartButtonClick}
                >PAUSE</button>
            </div>
        )
    } else {
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

const AlgorithmDropBox = ({ onChange }) => {
    return (
        <div className="button-wrap">
            <form>
                {/* <label htmlFor="algorithm">algorithm:</label> */}
                <select className="select-container" name="algorithm" onChange={onChange}>
                    <option value="A-star">A-star</option>
                    <option value="Daijkstra">Daijkstra</option>
                </select>
            </form>
        </div>
    )
}

const Controller = () => {
    const { boardCoordinate, startPoint, endPoint } = useSelector(({ boardCoordinate, startPoint, endPoint }) => ({
        boardCoordinate: boardCoordinate,
        startPoint: startPoint,
        endPoint: endPoint
    }));
    const dispatch = useDispatch();
    const updateBox = useCallback(payload => dispatch({
        type: 'controller/updateBox',
        payload: payload
    }), [dispatch])


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

    const [shortestPath, setShortestPath] = useState([]);
    const [visitedPoints, setVisitedPoints] = useState([]);

    const savedCallback = useRef();
    function callback() {
        if (visitedPoints[pathCount] != undefined) {
            updateBox({
                point: visitedPoints[pathCount].index,
                pointType: 'visited'
            })
            setMoveCount(moveCount + 1)
            setPathCount(pathCount + 1)
        } else {
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
        if (trigger) {
            let id = setInterval(tick, 3);
            return () => {
                clearInterval(id)
            };
        }
    }, [trigger])

    const startButtonClick = () => {
        const { visitedPoints: newVisitedPointsResult, shortestPath: newShortestPath }
            = ((algorithmType) => {
                if (algorithmType === 'Daijkstra') {
                    return daijkstra(boardCoordinate, startPoint, endPoint)
                } else if (algorithmType === 'A-star') {
                    return aStar(boardCoordinate, startPoint, endPoint)
                }
            })(algorithmType)
        setVisitedPoints(newVisitedPointsResult);
        setShortestPath(newShortestPath);
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
    const [algorithmType, setAlgorithmType] = useState('A-star');
    const algorithmTypeChange = (e) => {
        setAlgorithmType(e.target.value)
    }

    return (
        <section id="controller">
            <div className="right">
                <AlgorithmDropBox
                    onChange={algorithmTypeChange}
                ></AlgorithmDropBox>
                <StartButton
                    startButtonClick={startButtonClick}
                    restartButtonClick={restartButtonClick}
                    trigger={trigger} />
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