import { getCacheExpiration } from 'utils/utils';

const STRUCTURE_CACHE_TIMEOUT = 10;

// Array of structure types of which there can be multiple in one room
const multiplePerRoomList = [
	STRUCTURE_SPAWN,
	STRUCTURE_EXTENSION,
	STRUCTURE_ROAD,
	STRUCTURE_WALL,
	STRUCTURE_RAMPART,
	STRUCTURE_KEEPER_LAIR,
	STRUCTURE_PORTAL,
	STRUCTURE_LINK,
	STRUCTURE_TOWER,
	STRUCTURE_LAB,
	STRUCTURE_CONTAINER,
	STRUCTURE_POWER_BANK,
];

// Array of structure types of which there can be only one in a room
const singlePerRoomList = [
	STRUCTURE_OBSERVER,
	STRUCTURE_POWER_SPAWN,
	STRUCTURE_EXTRACTOR,
	STRUCTURE_TERMINAL,
	STRUCTURE_CONTROLLER,
	STRUCTURE_STORAGE,
];

// An object containing roomname's, each holding keys for each structure type which hold the ID(s) of every structure type in the room
// e.g. :
//
// roomStructuresID: {
//    'W7N4': {
//        'container': [ "5c6f157276549f0030ec474b" "5c6f33f338d6d60036ca8b9b"],
//        'spawn': [ "5c6d5d981e2ae30024471cb1" ],
//        'controller': [ "ff7a07728e60965" ],
//    }
// }
//
// roomStructuresID['W7N4']['container'] = [
//    "5c6f157276549f0030ec474b",
//    "5c6f33f338d6d60036ca8b9b"
// ]
let roomStructuresID: { [roomName: string]: { [structureType: string]: string[] } } = {};
let roomStructuresExpiration: { [roomName: string]: number } = {};

Room.prototype.updateStructureCache = function(): void {
	let currentTick = Game.time;

	// If cache is expired or entry doesn't exist
	if (
		!roomStructuresID[this.name] ||
		!roomStructuresExpiration[this.name] ||
		currentTick > roomStructuresExpiration[this.name]
	) {
		let roomName: string = this.name;
		let roomStructures = this.find(FIND_STRUCTURES);
		let roomStructuresGroupedByType = _.groupBy(roomStructures, s => s.structureType);

		roomStructuresExpiration[roomName] = getCacheExpiration(STRUCTURE_CACHE_TIMEOUT);
		roomStructuresID[roomName] = _.mapValues(roomStructuresGroupedByType, structures =>
			_.map(structures, s => s.id)
		);
	}
};

// Generate properties for all structure types
// e.g. type = spawn, property = spawns
// Object.defineProperty(Room.prototype, 'spawns')
// Object.defineProperty(Room.prototype, 'extensions')
// Object.defineProperty(Room.prototype, 'roads')
// Object.defineProperty(Room.prototype, 'ramparts')
// et cetera
multiplePerRoomList.forEach(function(type) {
	Object.defineProperty(Room.prototype, `${type}s`, {
		get: function() {
			let typeIndex = `_${type}s`;

			if (this[typeIndex]) {
				return this[typeIndex];
			} else {
				this.updateStructureCache();
				if (roomStructuresID[this.name][type]) {
					return (this[typeIndex] = _.map(roomStructuresID[this.name][type], Game.getObjectById));
				} else {
					return (this[typeIndex] = []);
				}
			}
		},
		configurable: true,
	});
});

singlePerRoomList.forEach(function(type) {
	Object.defineProperty(Room.prototype, `${type}`, {
		get: function() {
			let typeIndex = `_${type}`;

			if (this[typeIndex]) {
				return this[typeIndex];
			} else {
				this.updateStructureCache();
				if (roomStructuresID[this.name][type]) {
					return (this[typeIndex] = Game.getObjectById(_.first(roomStructuresID[this.name][type])));
				} else {
					return (this[typeIndex] = undefined);
				}
			}
		},
		configurable: true,
	});
});

Object.defineProperty(Room.prototype, 'sources', {
	get(): Array<Source> {
		if (!this._sources) {
			this._sources = this.find(FIND_SOURCES);
		}
		return this._sources;
	},
	configurable: true,
});

Object.defineProperty(Room.prototype, 'mineral', {
	get(): Mineral {
		if (!this._mineral) {
			this._mineral = _.first(this.find(FIND_MINERALS));
		}
		return this._mineral;
	},
	configurable: true,
});
