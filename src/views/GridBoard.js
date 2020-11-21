import GridBox from './GridBox';

const GridBoard = () => {
    const countAxisX = 60;
    const countAxisY = 25;
    const gridList = [];
    [...Array(countAxisY).keys()].forEach(y => {
        const rowArray= [];
        [...Array(countAxisX).keys()].forEach(x => {
            const key = `${y}-${x}`;
            rowArray.push(<GridBox x={x} y={y} key={key} />)
        })
        gridList.push(<div className={`row ${y}`}>{rowArray}</div>)
    });
    return <section className="grid-board">
                {gridList}
            </section>;
};

export default GridBoard;