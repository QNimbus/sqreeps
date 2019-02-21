import { Task } from 'tasks/Task';
import { harvestTargetType, TaskHarvest } from './instances/harvest';
import { upgradeTargetType, TaskUpgrade } from './instances/upgrade';
import { buildTargetType, TaskBuild } from './instances/build';
import { transferTargetType, TaskTransfer } from './instances/transfer';
import { gotoTargetType, TaskGoto } from './instances/goto';
import { TaskInvalid } from './instances/invalid';
import { log } from 'console/log';
import { TaskDrop, dropTargetType } from './instances/drop';
import { TaskRepair, repairTargetType } from './instances/repair';

export class Tasks {

	public static chain(tasks: Task[], setNextPos = true): Task {
		if (tasks.length === 0) {
			throw new Error(`Need at least one task to create a chain.`)
		}

		if (setNextPos) {
			for (let index = 0, length = tasks.length - 1; index < length; index++) {
				tasks[index].settings.nextPos = tasks[index + 1].targetPos;
			}
		}

		// Create first task in the chain
		let task = _.last(tasks);		// Get last task from list
		tasks = _.dropRight(tasks);		// And remove it from list

		for (let index = (tasks.length - 1); index >= 0; index--) {
			task = task.appendTask(tasks[index]);
		}

		return task;
	}

	public static initialize(taskPrototype: ITask): Task {
		let taskName = taskPrototype.name;
		let target = deref(taskPrototype.targetRef.ref);
		let targetPos = target ? target.pos : taskPrototype.targetRef.pos;
		let task: Task;

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
			case TaskRepair.taskName: {
				task = new TaskRepair(target as repairTargetType);
				break;
			}
			case TaskGoto.taskName: {
				task = new TaskGoto(targetPos as gotoTargetType);
				break;
			}
			case TaskDrop.taskName: {
				task = new TaskDrop(targetPos as dropTargetType);
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

	public static harvest(target: harvestTargetType, settings?: ITaskSettings, alias?: string): TaskHarvest {
		return new TaskHarvest(target, settings, alias);
	}

	public static upgrade(target: upgradeTargetType, settings?: ITaskSettings, alias?: string): TaskUpgrade {
		return new TaskUpgrade(target, settings, alias);
	}

	public static transfer(target: transferTargetType, resourceType: ResourceConstant = RESOURCE_ENERGY, amount?: number, settings?: ITaskSettings, alias?: string): TaskTransfer {
		return new TaskTransfer(target, resourceType, amount, settings, alias);
	}

	public static build(target: buildTargetType, settings?: ITaskSettings, alias?: string): TaskBuild {
		return new TaskBuild(target, settings, alias);
	}

	public static repair(target: repairTargetType, settings?: ITaskSettings, alias?: string): TaskRepair {
		return new TaskRepair(target, settings, alias);
	}

	public static goto(target: gotoTargetType, settings?: ITaskSettings, alias?: string): TaskGoto {
		return new TaskGoto(target, settings, alias);
	}

	public static drop(target: dropTargetType, resourceType: ResourceConstant = RESOURCE_ENERGY, amount?: number, settings?: ITaskSettings, alias?: string): TaskDrop {
		return new TaskDrop(target, resourceType, amount, settings, alias);
	}

	public static invalid(): TaskInvalid {
		return new TaskInvalid();
	}
}
