import GridBox from './GridBox';
import { useCallback } from 'react';
import { shallowEqual,useSelector, useDispatch } from 'react-redux';

const GridBoard = () => {
    const { countAxisX, countAxisY } = useSelector( ({ countAxisX, countAxisY }) => ({
        countAxisX: countAxisX,
        countAxisY: countAxisY
    }));
    const { startPoint, endPoint } = useSelector( ({startPoint, endPoint}) => ({
        startPoint: startPoint,
        endPoint: endPoint
    }))
    const { boardCoordinate } = useSelector( ({boardCoordinate }) => ({
        boardCoordinate: boardCoordinate
    }))
    const dispatch = useDispatch();
    const updateToVisitPoints  = useCallback((points) => ({
        toVisitPoints: points
    }), [dispatch])

    const { toVisitPoints } = useSelector( ({ toVisitPoints }) => ({
        toVisitPoints: toVisitPoints
    }))
    const getToVisitPoints = (point) => {
        point = boardCoordinate[point]
        const x = point.x;
        const y = point.y;

        const result = [];
        
        const up = `${y+1}-${x}`;
        const down = `${y-1}-${x}`;
        const left = `${y}-${x-1}`;
        const right = `${y}-${x+1}`;

        return [left,up,down,right].filter(el=>{
            if(boardCoordinate[el] != undefined 
                && !boardCoordinate[el]['visited']
                && !boardCoordinate[el]['wall']
                ){
                    return true
                }
        });
    }

    const search = () => {
        const toVisitPoints  = getToVisitPoints('0-0')
        updateToVisitPoints(toVisitPoints)
    }
    search()

    const gridList =  Object.keys(boardCoordinate).map(point => {
        const {x, y, visited, wall, cost} = boardCoordinate[point];
        const key = `${y}-${x}`;
        const gridBox = <GridBox x={x} y={y} visited={visited} wall={wall} cost={cost} key={key }></GridBox>
        return gridBox
    })

    return (
        <section className="grid-board">
            {gridList}
        </section>
    );
};

export default GridBoard;