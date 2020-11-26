import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const StartButton = () => {
    return (
        <div className="button-wrap">
            <button className="button start">START</button>
        </div>
    )
}

const EndButton = () => {
    return (
        <div className="button-wrap">
            <button className="button start">END</button>
        </div>
    )
}

const Controller = () => {

    const [elapsedTime, setElapsedTime] = useState("00:00:00")
    const [moveCount, setMoveCount] = useState(0);
    return (
        <section id="controller">
            {/* <div className="left">
                <div className="button-wrap">
                    <button className="button start">START POINT</button>
                </div>
                <div className="button-wrap">
                    <button className="button stop">END POINT</button>
                </div>
                <div className="button-wrap">
                    <button className="button stop">WALL</button>
                </div>
            </div> */}
            <div className="right">
                <StartButton/>
                <EndButton/>
                <div className="counter">
                    <div className="counter-box">
                        <p className="elapsed-time">{elapsedTime}</p>
                    </div>
                    <div className="counter-box">
                        <p className="move-counter">{moveCount}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Controller;