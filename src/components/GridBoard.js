import GridBox from './GridBox';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const GridBoard = () => {

    const { countAxisX, countAxisY } = useSelector( ({ countAxisX, countAxisY }) => ({
        countAxisX: countAxisX,
        countAxisY: countAxisY
    }))

    const { startPoint, endPoint } = useSelector( ({startPoint, endPoint}) => ({
        startPoint: startPoint,
        endPoint: endPoint
    }))

    const { boardCoordinate } = useSelector( ({boardCoordinate }) => ({
        boardCoordinate: boardCoordinate
    }))
    const dispatch = useDispatch();

    const updateToVisitPoints  = useCallback( points => dispatch({
        type: "gridBoard/updateToVisitPoints",
        payload: points
    }), [dispatch])

    const { toVisitPoints } = useSelector( ({ toVisitPoints }) => ({
        toVisitPoints: toVisitPoints
    }))

    const getToVisitPoints = (point) => {
        point = boardCoordinate[point]
        const x = point.x;
        const y = point.y;

        const up = `${y+1}-${x}`;
        const down = `${y-1}-${x}`;
        const left = `${y}-${x-1}`;
        const right = `${y}-${x+1}`;

        return [left,up,down,right].filter(el=>{
            if(boardCoordinate[el] !== undefined 
                && !boardCoordinate[el]['visited']
                && !boardCoordinate[el]['wall']
                ){
                    return true
                }
                else {
                    return false
                }
        });
    }

    const search = () => {
        const toVisitPoints  = getToVisitPoints('0-0')
        updateToVisitPoints(toVisitPoints)
    }

    const gridList =  Object.keys(boardCoordinate).map(point => {
        const {x, y, visited, wall, cost} = boardCoordinate[point];
        const key = `${y}-${x}`;
        const gridBox = <GridBox x={x} y={y} visited={visited} wall={wall} cost={cost} key={key}></GridBox>
        return gridBox
    })
    
    const getGridBoard = ()=> {
        const gridBoard = [];
        [...Array(countAxisY).keys()].forEach(y => {
            const gridRow = gridList.filter(el => el.props.y == y)
            gridBoard.push(<div className="row" key={`row-${y}`}>{gridRow}</div>)
        })
        return gridBoard
    }

    return (
        <section className="grid-board">
            {getGridBoard()}
        </section>
    );
};

export default GridBoard;