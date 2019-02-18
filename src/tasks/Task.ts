import { initializer } from "./initializer";
import { Qreep } from "qreep/Qreep";

type targetType = RoomObject;

export const TASK_TARGET_RANGES = {
	BUILD: 3,
	REPAIR: 3,
	UPGRADE: 3,
	TRANSFER: 1,
	WITHDRAW: 1,
	HARVEST: 1,
	DROP: 0,
};

export abstract class Task implements ITask {
	public name: string;
	public settings: {
		targetRange: number;
		nextPos?: RoomPosition;
	};

	public creepRef: string;
	public targetRef: string;

	public parent?: ITask;

	constructor(taskName: string, target: targetType) {
		this.name = taskName;

		this.creepRef = this.targetRef = "";

		this.target = target;

		this.settings = {
			targetRange: 1,
		};
	}

	// Properties

	get isWorking(): boolean {
		return (
			this.creep !== undefined &&
			(<Creep>this.creep!).pos.inRangeTo(
				(<targetType>this.target).pos,
				this.settings.targetRange
			)
		);
	}

	get creep(): Creep | Qreep {
		return Game.creeps[this.creepRef];
	}

	set creep(creep: Creep | Qreep) {
		this.creepRef = creep.name;
	}

	get target(): targetType {
		return deref(this.targetRef);
	}

	set target(target: targetType) {
		if (target) {
			this.targetRef = target.ref;
		}
	}

	get parentTask(): Task | undefined {
		return this.parent ? initializer(this.parent) : undefined;
	}

	set parentTask(task: Task | undefined) {
		this.parent = task ? task.taskPrototype : undefined;

		// If task is already assigned to a Qreep, update it (taskPrototype changed due to changed parent)
		if (this.creep) {
			(<Qreep>this.creep).task = this;
		}
	}

	get taskPrototype(): ITask {
		return {
			name: this.name,
			targetRef: this.targetRef,
			creepRef: this.creepRef,
		};
	}

	set taskPrototype(taskPrototype: ITask) {
		this.name = taskPrototype.name;
		this.targetRef = taskPrototype.targetRef;
		this.creepRef = taskPrototype.creepRef;
	}

	// Methods

	public abstract isValidTask(): boolean;
	public abstract isValidTarget(): boolean;
	public abstract work(): number;

	public run(): number | undefined {
		if (this.isWorking) {
			let result = this.work();
			return result;
		} else {
			this.moveToTarget();
		}
		return undefined;
	}

	public moveToTarget(): void {
		(<Creep>this.creep).moveTo((<targetType>this.target).pos, {
			range: this.settings.targetRange,
		});
	}

	public moveToNextPos(): void {
		if (this.settings.nextPos) {
			(<Creep>this.creep).moveTo(this.settings.nextPos, {
				range: this.settings.targetRange,
			});
		}
	}

	public isValid(): boolean {
		let validTask = this.creep && this.isValidTask();
		let validTarget = this.target && this.isValidTarget();

		if (validTask && validTarget) {
			return true;
		} else {
			this.finish();
			return this.parent ? this.parentTask!.isValid() : false;
		}
	}

	public finish(): void {
		if (this.creep) {
			(<Qreep>this.creep).task = this.parentTask;
		}
	}

	public newSubTask(newTask: Task): Task {
		newTask.parent = this;
		if (this.creep) {
			(<Qreep>this.creep).task = newTask;
		}
		return newTask;
	}
}
