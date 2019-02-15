interface Creep {
    link: string;

    run(this: Creep): void;
    role(this: Creep): string | undefined;
    performRole(this: Creep): void;
}

interface StructureSpawn {
    run(this: StructureSpawn): void;
    maxCreep(this: StructureSpawn, roleName: string, partsLimit?: number): string | 0 | -1 | -2 | -4 | -3 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -14 | -15;
}

interface RoomObject {
    link: string;

    ref: string;
}

interface RoomPosition {
    isEdge(this: RoomPosition): boolean;

    capacity(this: RoomPosition, range?: number): number;
    countAvailablePositions(this: RoomPosition, range?: number): number;
    countAdjacentObstacles(this: RoomPosition, range?: number): number;
    countAdjacentCreeps(this: RoomPosition, range?: number): number;

    findNearestAvailableSource(this: RoomPosition): Source | null;
}

interface ConstructionSite {
    isWalkable: boolean;
}

interface StructureContainer {
    isFull: boolean;
    isEmpty: boolean;
    energy: number;
}

interface String {
    padRight(this: String, length: number, char?: string): string;
    padLeft(this: String, length: number, char?: string): string;
}

interface Number {
    toPercent(this: Number, decimals?: number): string;
    clamp(this: Number, minVal: number, maxVal: number): number;
    truncate(this: Number, decimals: number): number;
}
