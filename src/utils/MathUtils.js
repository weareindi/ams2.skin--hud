/**
 * 
 * @param {*} n 
 */
export function invertNumber(n) {
    return n - (n * 2);
}

/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
export function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @returns 
 */
export function randomBool() {
    return Math.random() < 0.5;
}

/**
 * 
 * @returns 
 */
export function isNumber(n) {
    return !isNaN(n);
}

