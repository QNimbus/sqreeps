import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES, Qreep } from 'qreep/Qreep';

export type buildTargetType = ConstructionSite;

export class TaskBuild extends Task {
	public static taskName = 'build';

	public target: buildTargetType;

	constructor(target: buildTargetType, settings?: ITaskSettings, alias?: string) {
		super(TaskBuild.taskName, target, settings, alias);

		this.settings.targetRange = TASK_TARGET_RANGES.BUILD;
	}

	public isValidTask(): boolean {
		let creep = this.creep as Qreep;
		return creep && creep.carry.energy > 0;
	}

	public isValidTarget(): boolean {
		return this.target && this.target.my && this.target.progress < this.target.progressTotal;
	}

	public work(): number {
		return this.creep!.build(this.target);
	}
}
