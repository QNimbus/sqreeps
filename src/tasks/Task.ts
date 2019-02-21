import { Qreep } from 'qreep/Qreep';
import { Tasks } from './Tasks';
import { log } from 'console/log';
import { nullTargetRef } from 'utils/types';

type targetType = { ref: string; pos: IPos };

/**
 * Task class
 *
 * Class to encapuslate a task that is performed by a Creep; Task has a target (and target position) and will move th assigned creep
 * to the target position to perform the task until the task condition is no longer valid. It's possible to chain multiple tasks together
 * so that when a task finished, the next task is fetched.
 *
 * The Task constructor needs a task name and a target as a minumum.
 *
 * @export
 * @abstract
 * @class Task
 */
export abstract class Task {
	public name: string; // Name of the Task (e.g. 'goto', 'build', 'harvest', etc)
	public alias: string; // Alias for Task (defaults to the Task name if not specified)

	public settings: ITaskSettings; // Settings object for Task - allows for some customization
	public creepRef: ICreepRef; // Reference to creep assigned to Task (Game.creeps[creepRef.name])
	public targetRef: ITargetRef; // Reference to target associated with Task (ref and pos)

	public nextTaskRef?: ITask; // Serialized task data for next Task (optional)

	// Local cache for Task properties
	private _target?: targetType;
	private _targetPos: RoomPosition;
	private _creep?: Qreep;

	constructor(
		taskName: string,
		target: targetType,
		settings: ITaskSettings = {},
		alias?: string
	) {
		this.name = taskName;
		this.alias = alias ? alias : taskName;

		this.creepRef = { name: '' };
		this.targetRef = nullTargetRef;

		this.target = target;

		this.settings = _.defaults(settings, {
			targetRange: 1,
			nextPos: undefined,
			once: false,
		});
	}

	// Properties

	/**
	 * Returns true if task has a creep assigned and is within the required range of the target
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Task
	 */
	get isNearTarget(): boolean {
		return (
			this.hasCreepAssigned &&
			this.creep!.pos.inRangeTo(
				this.targetPos,
				this.settings.targetRange!
			)
		);
	}

	/**
	 * Returns true if task has a Qreep assigned
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Task
	 */
	get hasCreepAssigned(): boolean {
		return Boolean(this.creepRef.name);
	}

	/**
	 * Getter for assigned Qreep
	 *
	 * @type {(Qreep | undefined)}
	 * @memberof Task
	 */
	get creep(): Qreep | undefined {
		if (!this._creep) {
			this._creep = this.creepRef.name
				? new Qreep(Game.creeps[this.creepRef.name])
				: undefined;
		}
		return this._creep;
	}

	/**
	 * Setter for assigned Qreep
	 *
	 * @memberof Task
	 */
	set creep(creep: Qreep | undefined) {
		this.creepRef.name = creep ? creep.name : undefined;
		this._creep = creep;
	}

	get target(): targetType | undefined {
		if (!this._target) {
			this._target = deref(this.targetRef.ref);
		}
		return this._target;
	}

	set target(target: targetType | undefined) {
		if (target) {
			this.targetRef.ref = target.ref;
			this.targetRef.pos = target.pos;
			this._target = target;
		}
	}

	get targetPos(): RoomPosition {
		if (!this._targetPos) {
			this._targetPos = derefRoomPosition(this.targetRef.pos);
		}
		return this._targetPos;
	}

	get nextTask(): Task | undefined {
		return this.nextTaskRef
			? Tasks.initialize(this.nextTaskRef)
			: undefined;
	}

	set nextTask(task: Task | undefined) {
		this.nextTaskRef = task ? task.taskPrototype : undefined;

		// If task is already assigned to a Qreep, update it (taskPrototype changed due to changed parent)
		if (this.hasCreepAssigned) {
			this.creep!.task = this;
		}
	}

	get taskPrototype(): ITask {
		return {
			name: this.name,
			alias: this.alias,
			targetRef: this.targetRef,
			creepRef: this.creepRef,
			nextTaskRef: this.nextTaskRef,
			settings: this.settings,
		};
	}

	set taskPrototype(taskPrototype: ITask) {
		this.name = taskPrototype.name;
		this.alias = taskPrototype.alias;
		this.targetRef = taskPrototype.targetRef;
		this.creepRef = taskPrototype.creepRef;
		this.nextTaskRef = taskPrototype.nextTaskRef;
		this.settings = taskPrototype.settings;
	}

	// Methods

	public abstract isValidTask(): boolean;
	public abstract isValidTarget(): boolean;
	public abstract work(): number;

	public run(): number | undefined {
		if (this.isNearTarget) {
			let result = this.work();

			if (this.settings.once && result === OK) {
				this.finish();
			}
			return result;
		} else {
			this.moveToTarget();
		}
		return undefined;
	}

	public moveToTarget(): void {
		this.hasCreepAssigned &&
			this.creep!.moveTo(this.targetPos, {
				range: this.settings.targetRange,
			});
	}

	public moveToNextPos(): void {
		if (this.settings.nextPos) {
			let nextPos = derefRoomPosition(this.settings.nextPos);
			this.hasCreepAssigned && this.creep!.moveTo(nextPos);
		}
	}

	public isValid(): boolean {
		let validTask = this.creepRef.name && this.isValidTask();
		let validTarget = this.targetRef.ref && this.isValidTarget();

		if (validTask && validTarget) {
			return true;
		} else {
			let isValid = false;
			if (this.nextTaskRef) {
				// Assign creep to next task in queue
				this.nextTask!.creep = this.creep;
				isValid = this.nextTask!.isValid();
			}
			this.finish();
			return isValid;
		}
	}

	public finish(): void {
		this.moveToNextPos();
		if (this.hasCreepAssigned) {
			// Move to next task (this.nextTask can be undefined, in which case the task chain is completed)
			this.creep!.task = this.nextTask;
		} else {
			log.debug(
				`No creep executing ${this.name}! Task: ${JSON.stringify(
					this.taskPrototype,
					undefined,
					'\t'
				)}`
			);
		}
	}

	public appendTask(newTask: Task): Task {
		newTask.nextTask = this;
		if (this.hasCreepAssigned) {
			this.creep!.task = newTask;
		}
		return newTask;
	}
}
