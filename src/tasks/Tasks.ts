import { Task } from "tasks/Task";
import { harvestTargetType, TaskHarvest } from "./instances/TaskHarvest";
import { upgradeTargetType, TaskUpgrade } from "./instances/TaskUpgrade";
import { TaskBuild, buildTargetType } from "./instances/TaskBuild";
import { transferTargetType, TaskTransfer } from "./instances/TaskTransfer";
import { TaskInvalid } from "./instances/TaskInvalid";

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
}
