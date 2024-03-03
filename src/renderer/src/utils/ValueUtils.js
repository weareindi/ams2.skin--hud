/**
 * Prefix string with zeros
 * @param {*} v 
 * @param {*} n 
 * @returns 
 */
export function zerofill(value = null, total = null) {
    if (typeof value === 'undefined' || value === null) {
        return null;
    }

    if (typeof value === 'undefined' || total === null) {
        return null;
    }

    const valueString = `${value}`;
    return ('00000').substring(0, total).slice(valueString.length);
}

