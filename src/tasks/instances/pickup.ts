import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES, Qreep } from 'qreep/Qreep';

export type pickupTargetType = Resource;

export class TaskPickup extends Task {
	public static taskName = 'pickup';

	public target: pickupTargetType;

	constructor(target: pickupTargetType, settings?: ITaskSettings, alias?: string) {
		super(TaskPickup.taskName, target, settings, alias);

		// Settings
		this.settings.targetRange = TASK_TARGET_RANGES.PICKUP;
	}

	public isValidTask(): boolean {
		let creep = this.creep as Qreep;
		return !creep.isFull;
	}

	public isValidTarget(): boolean {
		return this.target && this.target.amount > 0;
	}

	public work(): number {
		return this.creep!.pickup(this.target);
	}
}
