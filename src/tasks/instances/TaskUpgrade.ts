import { Task, TASK_TARGET_RANGES } from 'tasks/Task';

export type upgradeTargetType = StructureController;

export class TaskUpgrade extends Task {

    public static taskName = 'upgrade';

    constructor(target: upgradeTargetType) {
        super(TaskUpgrade.taskName, target);

        this.settings.targetRange = TASK_TARGET_RANGES.UPGRADE;
    }

    public isValidTask(): boolean {
        return (<Creep>this.creep).carry.energy > 0;
    }

    public isValidTarget(): boolean {
        return (<upgradeTargetType>this.target) && (<upgradeTargetType>this.target).my;
    }

    public work(): number {
        return (<Creep>this.creep).upgradeController((<upgradeTargetType>this.target));
    }

    public onAssign(): void {

    }
}
