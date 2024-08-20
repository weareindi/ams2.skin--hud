import { zerofill } from "./ValueUtils";

/**
 * 
 */
export function display(v = null, z = null, s = null, l = null) {
    let zf = zerofill(v, z);
    
    let value = v;
    if (v === 0) {
        value = `0`;
    }

    return {
        zerofill: zf,
        value: value,
        suffix: s,
        label: l
    }
}

/**
 * 
 */
export function random(array) {
    return  array[ Math.floor( Math.random() * array.length ) ];
}

/**
 * 
 */
export function weightedArray(array) {
    const weightedArray = array;
    
    for (let ai = 0; ai < weightedArray.length; ai++) {
        weightedArray[ai].id = ai;
    }

    return [].concat(...weightedArray.map((obj) => Array(Math.ceil(obj.weight * 100)).fill(obj))); 
}