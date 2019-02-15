import { Task, TASK_TARGET_RANGES } from 'tasks/Task';

export type buildTargetType = ConstructionSite;

export class TaskBuild extends Task {

    public static taskName = 'build';

    constructor(target: buildTargetType) {
        super(TaskBuild.taskName, target);

        this.settings.targetRange = TASK_TARGET_RANGES.BUILD;
    }

    public isValidTask(): boolean {
        return (<Creep>this.creep).carry.energy > 0;
    }

    public isValidTarget(): boolean {
        let target = this.target as buildTargetType;
        return target && target.my && target.progress < target.progressTotal;
    }

    public work(): number {
        return (<Creep>this.creep).build(<buildTargetType>this.target);
    }
}
