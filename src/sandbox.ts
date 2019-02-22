// Sandbox code: Let's you try out random stuff at the end of main loop

import { log } from './console/log';
import { Qreep } from 'qreep/Qreep';
import { MemorySegmenter } from 'Memory/MemorySegmenter';

let json = (obj: {}) => {
	JSON.stringify(obj, undefined, '\t');
};

export function sandbox() {
	try {
		let currentTick = Game.time;
		let ff = MemorySegmenter.Instance;
		if (currentTick % 1 === 0) {
			if (MemorySegmenter.memory.activeSegments.length === 0) {
				log.debug(`Resetting memory....`);
				MemorySegmenter.requestSegments(1, 2, 3, 4, 5, 6, 7, 8, 9);
				MemorySegmenter.requestSegments(10, 11);
			}
		}
		// log.debug(JSON.stringify(ff));

		// console.log(`[${currentTick}] Segments count : ${Object.keys(RawMemory.segments).length}`);
		// console.log(`[${currentTick}] Segments count : ${JSON.stringify(Object.keys(RawMemory.segments))}`);
		// Object.keys(RawMemory.segments).forEach((key, index, array) => {
		// 	let sKey = parseInt(key);
		// 	console.log(`[${currentTick}] Segment[${key}] : ${RawMemory.segments[sKey]}`);
		// });
		// if (currentTick % 10 === 0) {
		// 	console.log(`[${currentTick}] Setting active segments to '[66]' for next tick`);
		// 	RawMemory.setActiveSegments([66]);
		// }
		// if (currentTick % 10 === 1) {
		// 	RawMemory.segments[66] = JSON.stringify({ testData: 'My Test' });
		// }
		// if (currentTick % 10 === 4) {
		// 	console.log(`[${currentTick}] Setting active segments to '[3]' for next tick`);
		// 	RawMemory.setActiveSegments([3]);
		// }
		// if (currentTick % 10 === 7) {
		// 	console.log(`[${currentTick}] Setting active segments to '[3, 66]' for next tick`);
		// 	RawMemory.setActiveSegments([3, 66]);
		// }
	} catch (e) {
		log.error(e);
	}
}

// 		roomStructureIDs[this.name] = _.mapValues(_.groupBy(this.find(FIND_STRUCTURES),
// 															(s: Structure) => s.structureType),
// 												  (structures: Structure[]) => _.map(structures, s => s.id));
