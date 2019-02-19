import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';

export type buildTargetType = ConstructionSite;

export class TaskBuild extends Task {

    public static taskName = 'build';

    constructor(target: buildTargetType, settings?: ITaskSettings, alias?: string) {
        super(TaskBuild.taskName, target, settings, alias);

        this.settings.targetRange = TASK_TARGET_RANGES.BUILD;
    }

    public isValidTask(): boolean {
        return !!this.creep && this.creep.carry.energy > 0;
    }

    public isValidTarget(): boolean {
        let target = this.target as buildTargetType;
        return target && target.my && target.progress < target.progressTotal;
    }

    public work(): number {
        return this.creep!.build(this.target as buildTargetType);
    }
}
