import { useState } from 'react';

const GridBox = (props) => {
    const {x,y}  = props;

    const [ boxType, setBoxType ]= useState('blank');
    const [ boxClass, setBoxClass ] = useState('box');

    const clickBox = () => {
        const newType = boxType === "blank" ? "wall" : "blank";
        setBoxType(newType);

        const newClass = boxClass.includes("wall") ? "box" : "box wall";
        setBoxClass(newClass);
    }
    const mouseEnter = () => {
        setBoxClass(boxClass+" hover");
    }
    const mouseLeave = () => {
        setBoxClass(boxClass.replace(" hover",""));
    }

    return <div id={`column ${y}-${x}`} 
    className={boxClass}
    onClick={clickBox}
    onMouseEnter={mouseEnter}
    onMouseLeave={mouseLeave}
    ></div>
}

export default GridBox