interface Creep {
	link: string;

	run(this: Creep): void;
	role(this: Creep): string | undefined;
	performRole(this: Creep): void;
}

interface Room {
	// Multiple structures per room
	spawns: Array<StructureSpawn>;
	extensions: Array<StructureExtension>;
	roads: Array<StructureRoad>;
	constructedWalls: Array<StructureWall>;
	ramparts: Array<StructureRampart>;
	keeperLairs: Array<StructureKeeperLair>;
	portals: Array<StructurePortal>;
	links: Array<StructureLink>;
	towers: Array<StructureTower>;
	labs: Array<StructureLab>;
	containers: Array<StructureContainer>;
	powerBanks: Array<StructurePowerBank>;

	sources: Array<Source>;
	mineral: Mineral;

	updateStructureCache(this: Room): void;
}

interface StructureSpawn {
	run(this: StructureSpawn): void;
	maxCreep(
		this: StructureSpawn,
		roleName: string,
		partsLimit?: number
	): string | 0 | -1 | -2 | -4 | -3 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -14 | -15;
}

interface RoomObject {
	link: string;

	ref: string;
}

interface RoomPosition {
	name: string;
	coordinateName: string;
	room: Room;

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
