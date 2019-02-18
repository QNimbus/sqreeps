import { Task } from "./Task";
import { TaskHarvest, harvestTargetType } from "./instances/TaskHarvest";
import { TaskUpgrade, upgradeTargetType } from "./instances/TaskUpgrade";
import { TaskTransfer, transferTargetType } from "./instances/TaskTransfer";
import { TaskBuild, buildTargetType } from "./instances/TaskBuild";
import { TaskInvalid } from "./instances/TaskInvalid";
import { log } from "console/log";

export function initializer(taskPrototype: ITask): Task {
	let taskName = taskPrototype.name;
	let target = deref(taskPrototype.targetRef);
	let task: any;

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
			log.error(
				`Trying to assign invalid task to creep: ${taskName} => ${
					taskPrototype.creepRef
				}`
			);
			task = new TaskInvalid();
			break;
		}
	}

	// Restore target and assigned creep onto task
	task.taskPrototype = taskPrototype;
	return task;
}
