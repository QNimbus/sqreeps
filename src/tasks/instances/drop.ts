import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';
import { hasPos } from 'declarations/typeGuards';

export type dropTargetType = { pos: RoomPosition } | RoomPosition;

export class TaskDrop extends Task {
	public static taskName = 'drop';
	public data: {
		resourceType: ResourceConstant;
		amount?: number;
	};

	constructor(
		target: dropTargetType,
		resourceType: ResourceConstant = RESOURCE_ENERGY,
		amount?: number,
		settings?: ITaskSettings,
		alias?: string
	) {
		let targetPos: RoomPosition;
		if (hasPos(target)) {
			targetPos = target.pos;
		} else {
			targetPos = target;
		}

		super(TaskDrop.taskName, { ref: 'pos', pos: targetPos }, settings, alias);

		// Settings
		this.settings.targetRange = TASK_TARGET_RANGES.DROP;

		this.data = {
			resourceType: resourceType,
			amount: amount,
		};
	}

	public isValidTask(): boolean {
		let amount = this.data.amount || 1;
		let cargo = (!!this.creep && this.creep.carry[this.data.resourceType]) || 0;
		return cargo >= amount;
	}

	public isValidTarget(): boolean {
		return true;
	}

	public work(): number {
		return this.creep!.drop(this.data.resourceType, this.data.amount);
	}
}
