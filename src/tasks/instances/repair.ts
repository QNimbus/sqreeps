import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES, Qreep } from 'qreep/Qreep';

export type repairTargetType = Structure;

export class TaskRepair extends Task {

    public static taskName = 'repair';

    constructor(target: repairTargetType, settings?: ITaskSettings, alias?: string) {
        super(TaskRepair.taskName, target, settings, alias);

        this.settings.targetRange = TASK_TARGET_RANGES.REPAIR;
    }

    public isValidTask(): boolean {
        return !!this.creep && this.creep.carry.energy > 0;
    }

    public isValidTarget(): boolean {
        let target = this.target as repairTargetType;
        return target && target.hits < target.hitsMax;
    }

    public work(): number {
        let creep = this.creep as Qreep;
        let target = this.target as repairTargetType;
        let structureHealth = target.hits + creep.getActiveBodyparts(WORK) * REPAIR_POWER;

        let result = this.creep!.repair(this.target as repairTargetType); // Perform actual repairing

        // Check if repair is complete to prevent wasting the next tick
        if (structureHealth > target.hitsMax) {
            this.finish()
        }
        return result;
    }
}
