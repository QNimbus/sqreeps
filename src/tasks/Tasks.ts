import { harvestTargetType, TaskHarvest } from './instances/TaskHarvest';
import { upgradeTargetType, TaskUpgrade } from './instances/TaskUpgrade';
import { TaskBuild, buildTargetType } from './instances/TaskBuild';
import { transferTargetType, TaskTransfer } from './instances/TaskTransfer';
import { log } from 'console/log';
import { TaskInvalid } from './instances/TaskInvalid';

export type TaskType = TaskHarvest | TaskUpgrade | TaskTransfer | TaskInvalid;

export class Tasks {
    public static harvest(target: harvestTargetType): TaskHarvest {
        return new TaskHarvest(target);
    }

    public static upgrade(target: upgradeTargetType): TaskUpgrade {
        return new TaskUpgrade(target);
    }

    public static transfer(target: transferTargetType): TaskTransfer {
        return new TaskTransfer(target);
    }

    public static build(target: buildTargetType): TaskBuild {
        return new TaskBuild(target);
    }

    public static initialize(taskPrototype: ITask): TaskType {
        let taskName = taskPrototype.name;
        let target = deref(taskPrototype.targetRef);
        let task: TaskType;

        switch (taskName) {
            case TaskHarvest.taskName: {
                task = new TaskHarvest(target as harvestTargetType);
                break;
            }
            case TaskUpgrade.taskName: {
                task = new TaskUpgrade(target as upgradeTargetType);
                break;
            }
            case TaskTransfer.taskName: {
                task = new TaskTransfer(target as transferTargetType);
                break;
            }
            case TaskBuild.taskName: {
                task = new TaskBuild(target as buildTargetType);
                break;
            }
            default: {
                log.error(`Trying to assign invalid task to creep: ${taskName} => ${taskPrototype.creepRef}`);
                task = new TaskInvalid();
                break;
            }
        }

        // Restore target and assigned creep onto task
        task.taskPrototype = taskPrototype;
        return task;
    }
}
