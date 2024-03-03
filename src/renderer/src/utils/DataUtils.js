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
