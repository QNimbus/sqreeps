import { log } from 'console/log';

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
var roomStructuresID: { [roomName: string]: { [structureType: string]: string[] } } = {};

Room.prototype.updateStructureCache = function(): void {
	// if cache is expired or doesn't exist
	if (!roomStructuresID[this.name]) {
		let roomName: string = this.name;
		let roomStructures = this.find(FIND_STRUCTURES);
		let roomStructuresGroupedByType = _.groupBy(roomStructures, s => s.structureType);

		roomStructuresID[roomName] = _.mapValues(roomStructuresGroupedByType, structures =>
			_.map(structures, s => s.id)
		);
	}
};

multiplePerRoomList.forEach(function(type) {
	// e.g. type = spawn, property = spawns
	Object.defineProperty(Room.prototype, `${type}s`, {
		get: function() {
			if (this['_' + type + 's']) {
				log.debug(`Cache hit for '${type}s'`);
				return this['_' + type + 's'];
			} else {
				this.updateStructureCache();
				if (roomStructuresID[this.name][type]) {
					return (this['_' + type + 's'] = _.map(roomStructuresID[this.name][type], Game.getObjectById));
				} else {
					return (this['_' + type + 's'] = []);
				}
			}
		},
		configurable: true,
	});
});
