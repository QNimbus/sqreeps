import { Task } from 'tasks/Task';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';

export type upgradeTargetType = StructureController;

export class TaskUpgrade extends Task {

    public static taskName = 'upgrade';

    constructor(target: upgradeTargetType, settings?: ITaskSettings, alias?: string) {
        super(TaskUpgrade.taskName, target, settings, alias);

        this.settings.targetRange = TASK_TARGET_RANGES.UPGRADE;
    }

    public isValidTask(): boolean {
        return !!this.creep && this.creep.carry.energy > 0;
    }

    public isValidTarget(): boolean {
        return (this.target as upgradeTargetType) && (this.target as upgradeTargetType).my;
    }

    public work(): number {
        return this.creep!.upgradeController((<upgradeTargetType>this.target));
    }

    public onAssign(): void {

    }
}
