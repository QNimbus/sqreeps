import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES, Qreep } from 'qreep/Qreep';

export type repairTargetType = Structure;

export class TaskRepair extends Task {
	public static taskName = 'repair';

	public target: repairTargetType;

	constructor(target: repairTargetType, settings: ITaskSettings = {}, alias?: string) {
		// Settings
		settings = _.defaults(settings, { targetRange: TASK_TARGET_RANGES.REPAIR } as ITaskSettings);

		super(TaskRepair.taskName, target, settings, alias);
	}

	public isValidTask(): boolean {
		return !!this.creep && this.creep.carry.energy > 0;
	}

	public isValidTarget(): boolean {
		return this.target && this.target.hits < this.target.hitsMax;
	}

	public work(): number {
		let creep = this.creep as Qreep;
		let structureHealth = this.target.hits + creep.getActiveBodyparts(WORK) * REPAIR_POWER;

		let result = this.creep!.repair(this.target); // Perform actual repairing

		// Check if repair is complete to prevent wasting the next tick
		if (structureHealth > this.target.hitsMax) {
			this.finish();
		}
		return result;
	}
}
