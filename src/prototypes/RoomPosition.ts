import { abs, min, max } from 'utils/utils';

// Methods

RoomPosition.prototype.isEdge = function (this: RoomPosition): boolean {
    return this.x === 0 || this.x === 49 || this.y === 0 || this.y === 49;
}

RoomPosition.prototype.countAdjacentObstacles = function (this: RoomPosition, range: number = 1): number {
    let [x, y] = [this.x, this.y];
    let roomTerain = Game.map.getRoomTerrain(this.roomName);
    let wallCount = 0;

    for (let x_ = (x - range).clamp(0, 49), _x = (x + range).clamp(0, 49); x_ <= _x; x_++) {
        for (let y_ = (y - range).clamp(0, 49), _y = (y + range).clamp(0, 49); y_ <= _y; y_++) {
            if (!(x_ === x && y_ === y) && roomTerain.get(x_, y_) === TERRAIN_MASK_WALL) {
                ++wallCount;
            }
        }
    }
    return wallCount;
}

RoomPosition.prototype.countAdjacentCreeps = function (this: RoomPosition, range: number = 1): number {
    return this.findInRange(FIND_CREEPS, range).length;
}

RoomPosition.prototype.capacity = function (this: RoomPosition, range: number = 1): number {
    let [x, y] = [this.x.clamp(0, 49), this.y.clamp(0, 49)];

    range = range.clamp(1, 49);
    let maxPositions = abs(min(x + range, 49) - max(x - range, 0) + 1) * abs(min(y + range, 49) - max(y - range, 0) + 1) - 1;
    let countWalls = this.countAdjacentObstacles(range);

    return maxPositions - countWalls;
}

RoomPosition.prototype.countAvailablePositions = function (this: RoomPosition, range: number = 1): number {
    return this.capacity(range) - this.countAdjacentCreeps(range);
}

RoomPosition.prototype.findNearestAvailableSource = function (this: RoomPosition): Source | null {
    let sources: Array<Source> = Game.rooms[this.roomName].find(FIND_SOURCES_ACTIVE);
    let dir: Array<{ source: Source, openPos: number, dist: number }> = [];

    sources.forEach(source => {
        dir.push({ source: source, openPos: source.pos.countAvailablePositions(), dist: this.getRangeTo(source.pos) });
    })

    dir.sort((a, b) => a.dist - b.dist);

    return dir[0].source || null;
}
