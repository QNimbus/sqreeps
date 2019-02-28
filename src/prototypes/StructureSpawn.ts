import { Qreep } from 'qreep/Qreep';
import { countCreeps } from 'utils/helpers';
import { min } from 'utils/utils';

/**
 *
 *
 * @param {StructureSpawn} this
 */
StructureSpawn.prototype.run = function(this: StructureSpawn): void {
	let maxHarvesters: number = 0;
	let roomSources = this.room.find(FIND_SOURCES);

	if (this.room.controller && this.room.controller.level < 2) {
		roomSources.forEach(s => (maxHarvesters += s.pos.capacity(1)));
	} else {
		maxHarvesters = 2;
	}

	if (countCreeps('harvester') < 2) {
		this.maxCreep('harvester');
	} else if (countCreeps('tester') < 1) {
		this.maxCreep('tester');
	} else if (countCreeps('upgrader') < 2) {
		this.maxCreep('upgrader');
	}
};

/**
 *
 *
 * @param {StructureSpawn} this
 * @param {string} roleName
 * @param {number} [partsLimit=50]
 * @returns {(string | 0 | -1 | -2 | -4 | -3 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -14 | -15)}
 */
StructureSpawn.prototype.maxCreep = function(
	this: StructureSpawn,
	role: string,
	partsLimit: number = 50
): string | 0 | -1 | -2 | -4 | -3 | -5 | -6 | -7 | -8 | -9 | -10 | -11 | -12 | -14 | -15 {
	let costs = Qreep.bodyPartCost([CARRY, WORK, MOVE]);
	let energyAvailable = this.room.energyCapacityAvailable;
	let numberOfBodyParts = min(partsLimit, ~~(energyAvailable / costs));

	let carryParts = [...Array(numberOfBodyParts)].map(() => CARRY);
	let workParts = [...Array(numberOfBodyParts)].map(() => WORK);
	let moveParts = [...Array(numberOfBodyParts)].map(() => MOVE);

	let creepName = Qreep.generateName(role) || role;

	return this.createCreep(Array.prototype.concat(carryParts, workParts, moveParts), creepName, {
		role: role,
		room: this.room.name,
	});
};
