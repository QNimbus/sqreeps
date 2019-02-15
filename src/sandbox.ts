// Sandbox code: Let's you try out random stuff at the end of main loop

import { log } from './console/log';
import { Qreep } from 'qreep/Qreep';

export function sandbox() {
    try {
        let creeps = Game.creeps;
        for (let creepName in creeps) {
            let qreep = new Qreep(creeps[creepName]);
        }
    } catch (e) {
        log.error(e);
    }
}
