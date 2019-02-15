import { min, max } from 'utils/utils';

String.prototype.padRight = function (this: String, length: number, char = ' '): string {
    return this + char.repeat(Math.max(length - this.length, 0));
};

String.prototype.padLeft = function (this: String, length: number, char = ' '): string {
    return char.repeat(Math.max(length - this.length, 0)) + this;
};

Number.prototype.toPercent = function (this: Number, decimals = 0): string {
    return (this.valueOf() * 100).toFixed(decimals) + '%';
};

Number.prototype.truncate = function (this: Number, decimals: number): number {
    var re = new RegExp('(\\d+\\.\\d{' + decimals + '})(\\d)'),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

Number.prototype.clamp = function (this: Number, minVal: number, maxVal: number): number {
    return min(max(+this, minVal), maxVal);
};

Object.defineProperty(ConstructionSite.prototype, 'isWalkable', {
    get() {
        return this.structureType == STRUCTURE_ROAD ||
            this.structureType == STRUCTURE_CONTAINER ||
            this.structureType == STRUCTURE_RAMPART;
    },
    configurable: true,
});
