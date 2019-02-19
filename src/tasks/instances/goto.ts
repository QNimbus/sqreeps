import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';
import { hasPos } from 'declarations/typeGuards';

export type gotoTargetType = { pos: RoomPosition } | RoomPosition;

export class TaskGoto extends Task {

    public static taskName = 'goto';

    constructor(target: gotoTargetType, settings?: ITaskSettings, alias?: string) {
        let targetPos: RoomPosition;
        if (hasPos(target)) {
            targetPos = target.pos;
        } else {
            targetPos = target;
        }

        super(TaskGoto.taskName, { ref: 'pos', pos: targetPos }, settings, alias);

        // Settings
        this.settings.targetRange = TASK_TARGET_RANGES.GOTO;
    }

    public isValidTask(): boolean {
        return !!this.creep && !this.creep.pos.inRangeTo(this.targetPos, this.settings.targetRange!);
    }

    public isValidTarget(): boolean {
        return true;
    }

    public work(): number {
        return OK;
    }
}
