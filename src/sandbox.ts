// Sandbox code: Let's you try out random stuff at the end of main loop

import { log } from './console/log';
import { Qreep } from 'qreep/Qreep';
import { MemorySegmenter } from 'Memory/MemorySegmenter';
import { $ } from 'Memory/Cache';

export function sandbox() {
	try {
		let currentTick = Game.time;
		let room = Game.rooms['W7N4'];
		let spawns = room.spawns;

		// log.debug(`Sources: ${room.sources}`);
		// log.debug(`Mineral: ${room.mineral}`);

		let myController = $.structures({ ref: 'testObject' }, 'myController', () => {
			return new Array(room.controller!);
		});

		log.debug(myController);
		log.debug(myController[0].progress);
	} catch (e) {
		log.error(e);
	}
}
