import { Task } from 'tasks/Task';
import { isSource } from 'declarations/typeGuards';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';
import { log } from 'console/log';

export type harvestTargetType = Source | Mineral;

export class TaskHarvest extends Task {
	public static taskName = 'harvest';
	public target: harvestTargetType;

	constructor(target: harvestTargetType, settings: ITaskSettings = {}, alias?: string) {
		// Settings
		settings = _.defaults(settings, { targetRange: TASK_TARGET_RANGES.HARVEST } as ITaskSettings);

		super(TaskHarvest.taskName, target, settings, alias);
	}

	public isValidTask(): boolean {
		return !!this.creep && _.sum(this.creep.carry) < this.creep.carryCapacity;
	}

	public isValidTarget(): boolean {
		if (isSource(this.target)) {
			return (this.target as Source).energy > 0;
		} else {
			return (this.target as Mineral).mineralAmount > 0;
		}
	}

	public work(): number {
		return this.creep!.harvest(this.target);
	}
}
