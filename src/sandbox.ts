// Sandbox code: Let's you try out random stuff at the end of main loop

import { log } from './console/log';
import { Qreep } from 'qreep/Qreep';
import { MemorySegmenter } from 'Memory/MemorySegmenter';

export function sandbox() {
	try {
		let currentTick = Game.time;
		let room = Game.rooms['W7N4'];
		let spawns = room.spawns;

		log.debug(`Sources: ${room.sources}`);
		log.debug(`Mineral: ${room.mineral}`);
	} catch (e) {
		log.error(e);
	}
}
