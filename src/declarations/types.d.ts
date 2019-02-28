declare var global: any;

declare namespace NodeJS {
	interface Global {
		_cache: ICache;

		__VERSION__: string;

		deref(ref: string): {} | null;
	}
}

declare var _cache: ICache;

// Creep API interfaces

interface CreepMemory {
	role: string;
	room: string;

	task?: ITask;
	working?: boolean;
	target?: string;
}

interface Memory {
	uuid: number;
	log: any;
}

// Custom interfaces

interface ICache {
	access: { [key: string]: number };
	expire: { [key: string]: number };

	structures: { [key: string]: Structure[] };
}

interface IPos {
	x: number;
	y: number;
	roomName: string;
}

interface IRef {
	ref: string;
}

interface IRole {
	name: string;

	pos: RoomPosition;
}

interface IDirective {}

interface IDominionSiteMemory {
	[key: string]: any;
}

interface IHasPos {
	pos: RoomPosition;
}
