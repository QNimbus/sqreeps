import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES, Qreep } from 'qreep/Qreep';

export type upgradeTargetType = StructureController;

export class TaskUpgrade extends Task {
	public static taskName = 'upgrade';

	public target: upgradeTargetType;

	constructor(target: upgradeTargetType, settings: ITaskSettings = {}, alias?: string) {
		// Settings
		settings = _.defaults(settings, { targetRange: TASK_TARGET_RANGES.UPGRADE } as ITaskSettings);

		super(TaskUpgrade.taskName, target, settings, alias);
	}

	public isValidTask(): boolean {
		let creep = this.creep as Qreep;
		return creep && creep.carry.energy > 0;
	}

	public isValidTarget(): boolean {
		return this.target && this.target.my;
	}

	public work(): number {
		return this.creep!.upgradeController(this.target);
	}

	public onAssign(): void { }
}
