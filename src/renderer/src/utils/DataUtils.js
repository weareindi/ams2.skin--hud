import { zerofill } from "./ValueUtils";

/**
 * 
 */
export function display(v = null, z = null, s = null, l = null) {
    let zf = zerofill(v, z);

    return {
        zerofill: zf,
        value: v,
        suffix: s,
        label: l
    }
}
