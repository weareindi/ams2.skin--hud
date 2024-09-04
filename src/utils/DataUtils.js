import { getZerofill } from "./ValueUtils";

/**
 *
 * @param {*} items
 * @returns Array Objects prepared for view templates
 */
export function getViewObject(items = []) {
    const placeholder = {
        label: null,
        value: null,
        zerofill: null,
        suffix: null,
        seperator: null,
        state: null,
        additional: null,
    }

    for (let ii = 0; ii < items.length; ii++) {
        items[ii] = {...placeholder, ...items[ii]};

        if (items[ii].value === 0) {
            items[ii].value = `0`;
        }

        items[ii].zerofill = getZerofill(items[ii].value, items[ii].zerofill);
    }

    return items;
}

/**
 *
 * @param {*} array
 * @returns
 */
export function random(array) {
    return array[ Math.floor( Math.random() * array.length ) ];
}

/**
 *
 * @param {*} array An array of objects with a 'weight' key from 0 to 1 (eg. 0.6)
 * @returns
 */
export function weightedArray(array) {
    const weightedArray = array;

    for (let ai = 0; ai < weightedArray.length; ai++) {
        weightedArray[ai].id = ai;
    }

    return [].concat(...weightedArray.map((obj) => Array(Math.ceil(obj.weight * 100)).fill(obj)));
}