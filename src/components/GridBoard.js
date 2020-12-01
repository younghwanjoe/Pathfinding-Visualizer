import GridBox from './GridBox';
import { useSelector } from 'react-redux';

const GridBoard = () => {

    const { countAxisX, countAxisY, boardCoordinate, startPoint, endPoint } = useSelector( ({ countAxisX, countAxisY,boardCoordinate, startPoint, endPoint }) => ({
        countAxisX, countAxisY, boardCoordinate, startPoint, endPoint
    }))

    const gridList =  Object.keys(boardCoordinate).map(point => {
        
        const {x, y, pointType, visited, wall, cost, order} = boardCoordinate[point];
        const boxPoint = `${y}-${x}`;
        let boxClass = ""
        const boxStyle= {
            'animationDelay': order === null ? 0 : `${order*0.02}s`
        };
        if(pointType === 'path'){
           boxClass = 'box visited path'
        } else if(pointType === 'unvisited'){
           boxClass = 'box'
        } else if(pointType === 'visited'){
           boxClass = 'box visited'
        } else if(pointType === 'wall'){
           boxClass = 'box wall'
        } 

        if(boxPoint === startPoint) {
           boxClass = 'box start-point'
        } else if(boxPoint === endPoint) {
           boxClass = 'box end-point'
        }
        const gridBox = <GridBox boxClass={boxClass} boxStyle={boxStyle} x={x} y={y} pointType={pointType} visited={visited} wall={wall} cost={cost} order={order} key={boxPoint}></GridBox>
        return gridBox
    })
    
    const getGridBoard = ()=> {
        const gridBoard = [];
        [...Array(countAxisY).keys()].forEach(y => {
            const gridRow = gridList.filter(el => el.props.y === y)
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