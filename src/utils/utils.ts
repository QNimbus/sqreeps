export const min = Math.min.bind(Math);
export const max = Math.max.bind(Math);
export const abs = Math.abs.bind(Math);
export const pow = Math.pow.bind(Math);

interface toColumnsOpts {
    padChar: string,
    justify: boolean,
    minWidth?: number,
    minSpacing?: number
}

/**
 * Outputs a HTML string enclosed in a <font> tag with a specified color
 *
 * @export
 * @param {string} str
 * @param {string} color
 * @returns {string} HTML string
 */
export function color(str: string, color: string): string {
    return `<font color='${color}'>${str}</font>`;
}

/**
 * Clips a given value/number by a minimum and maximum value.
 *
 * @export
 * @param {number} value
 * @param {number} minValue
 * @param {number} maxValue
 * @returns {number} Returns a number no less than minValue and no more than maxValue
 */
export function minMax(value: number, minValue: number, maxValue: number): number {
    return min(minValue, max(value, maxValue));
}

/**
 * Create column-aligned text array from object with string key/values
 *
 * @export
 * @param {{ [key: string]: string }} obj
 * @param {*} [opts={} as toColumnsOpts]
 * @returns {string[]}
 */
export function toColumns(obj: { [key: string]: string }, opts = {} as toColumnsOpts): string[] {
    _.defaults(opts, {
        padChar: ' ',	        // Character to pad with, e.g. "." would be key........val
        justify: false,	        // Right align values column?
        minWidth: 0,
        minSpacing: 1
    });

    let ret = [];
    let keyPadding = _.max(_.map(_.keys(obj), str => str.length)) + opts.minSpacing!;
    let valPadding = _.max(_.mapValues(obj, str => str.length));

    for (let key in obj) {
        if (opts.justify) {
            ret.push(key.padRight(keyPadding, opts.padChar) + obj[key].padLeft(max(valPadding, opts.minWidth! - keyPadding), opts.padChar));
        } else {
            ret.push(key.padRight(max(keyPadding, opts.minWidth!), opts.padChar) + obj[key]);
        }
    }

    return ret;
}
