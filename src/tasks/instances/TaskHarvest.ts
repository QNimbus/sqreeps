import { isSource } from 'declarations/typeGuards';
import { Task, TASK_TARGET_RANGES } from 'tasks/Task';

export type harvestTargetType = Source | Mineral;

export class TaskHarvest extends Task {

    public static taskName = 'harvest';

    constructor(target: harvestTargetType) {
        super(TaskHarvest.taskName, target);

        this.settings.targetRange = TASK_TARGET_RANGES.HARVEST;
    }

    public isValidTask(): boolean {
        return _.sum((<Creep>this.creep).carry) < (<Creep>this.creep).carryCapacity;
    }

    public isValidTarget(): boolean {
        if (isSource(<harvestTargetType>this.target)) {
            return (<Source>this.target).energy > 0;
        } else {
            return (<Mineral>this.target).mineralAmount > 0;
        }
    }

    public work(): number {
        return (<Creep>this.creep).harvest(<harvestTargetType>this.target);
    }
}
