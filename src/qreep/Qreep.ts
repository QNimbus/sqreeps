import { isSqreep } from "declarations/typeGuards";
import { Task, TASK_TARGET_RANGES } from "tasks/Task";
import { initializer } from "tasks/initializer";

export function toCreep(creep: Qreep | Creep): Creep {
	return isSqreep(creep) ? creep.creep : creep;
}

export function toSqreep(creep: Qreep | Creep): Qreep {
	return isSqreep(creep) ? creep : new Qreep(creep);
}

export class Qreep {
	public creep: Creep;
	public owner: Owner;
	public body: Array<BodyPartDefinition>;
	public memory: CreepMemory;
	public room: Room;
	public pos: RoomPosition;
	public carry: StoreDefinition;
	public carryCapacity: number;

	public id: string;
	public name: string;
	public roleName: string;
	public fatigue: number;
	public hits: number;
	public hitsMax: number;
	public my: boolean;
	public spawning: boolean;
	public ticksToLive?: number;
	public saying: string;

	private _task?: Task;

	constructor(creep: Creep) {
		this.creep = creep;
		this.body = creep.body;
		this.memory = creep.memory;
		this.room = creep.room;
		this.pos = creep.pos;
		this.carry = creep.carry;
		this.carryCapacity = creep.carryCapacity;

		this.id = creep.id;
		this.name = creep.name;
		this.roleName = creep.memory.role;
		this.fatigue = creep.fatigue;
		this.hits = creep.hits;
		this.hitsMax = creep.hitsMax;
		this.my = creep.my;
		this.owner = creep.owner;
		this.spawning = creep.spawning;
		this.ticksToLive = creep.ticksToLive;
		this.saying = creep.saying;

		global[this.name] = this;
	}

	get link(): string {
		return (
			'<a href="#!/room/' +
			Game.shard.name +
			"/" +
			this.pos.roomName +
			'">[' +
			this.name +
			"]</a>"
		);
	}

	get task(): Task | undefined {
		if (!this._task) {
			// initializeTask returns a new Task based on the properties in the creep memory (taskPrototype)
			this._task = this.memory.task
				? initializer(this.memory.task)
				: undefined;
		}
		return this._task;
	}

	set task(task: Task | undefined) {
		if (task) {
			task.creep = this;
			this.memory.task = task.taskPrototype;
		} else {
			this.memory.task = undefined;
		}
		this._task = undefined;
	}

	get hasTask(): boolean {
		return !!this.task && this.task.isValid();
	}

	get isIdle(): boolean {
		return !this.task || !this.task.isValid();
	}

	get isFull(): boolean {
		return this.carry.energy === this.carryCapacity;
	}

	get isEmpty(): boolean {
		return this.carry.energy === 0;
	}

	get availableCarryCapacity(): number {
		return this.carryCapacity - _.sum(this.carry);
	}

	// Custom Qreep methods

	public role(this: Qreep): string | undefined {
		return this.memory.role;
	}

	public performRole(this: Qreep): void {
		let roleName = this.role();

		if (roleName) {
			try {
				// let role = roles(roleName);
				// role.run(this);
			} catch (e) {}
		}
	}

	public run = function(this: Qreep): number | undefined {
		if (this.task) {
			return this.task.run();
		}
		return undefined;
	};

	public goHarvest(this: Qreep, source: Source | Mineral): number {
		if (this.pos.inRangeTo(source, TASK_TARGET_RANGES.HARVEST)) {
			return this.harvest(source);
		} else {
			return this.moveTo(source);
		}
	}

	public goUpgrade(this: Qreep, controller: StructureController) {
		if (this.pos.inRangeTo(controller, TASK_TARGET_RANGES.UPGRADE)) {
			return this.upgradeController(controller);
		} else {
			return this.moveTo(controller);
		}
	}

	public goTransfer(
		this: Qreep,
		target: Creep | Qreep | Structure,
		resourceType: ResourceConstant = RESOURCE_ENERGY,
		amount?: number
	): number {
		if (this.pos.inRangeTo(target.pos, TASK_TARGET_RANGES.TRANSFER)) {
			return this.transfer(target, resourceType, amount);
		} else {
			return this.moveTo(target);
		}
	}

	public goWithdraw(
		this: Qreep,
		target: Structure | Tombstone,
		resourceType: ResourceConstant = RESOURCE_ENERGY,
		amount?: number
	) {
		if (this.pos.inRangeTo(target.pos, TASK_TARGET_RANGES.WITHDRAW)) {
			return this.withdraw(target, resourceType, amount);
		} else {
			return this.moveTo(target);
		}
	}

	// Wrapped Creep methods

	public transfer(
		this: Qreep,
		target: Creep | Qreep | Structure,
		resourceType: ResourceConstant = RESOURCE_ENERGY,
		amount?: number
	): number {
		if (target instanceof Qreep) {
			return this.creep.transfer(target.creep, resourceType, amount);
		} else {
			return this.creep.transfer(target, resourceType, amount);
		}
	}

	public attack = Creep.prototype.attack;
	public attackController = Creep.prototype.attackController;
	public build = Creep.prototype.build;
	public cancelOrder = Creep.prototype.cancelOrder;
	public claimController = Creep.prototype.claimController;
	public dismantle = Creep.prototype.dismantle;
	public drop = Creep.prototype.drop;
	public generateSafeMode = Creep.prototype.generateSafeMode;
	public getActiveBodyparts = Creep.prototype.getActiveBodyparts;
	public harvest = Creep.prototype.harvest;
	public heal = Creep.prototype.heal;
	public move = Creep.prototype.move;
	public moveByPath = Creep.prototype.moveByPath;
	public moveTo = Creep.prototype.moveTo;

	public notifyWhenAttacked = Creep.prototype.notifyWhenAttacked;
	public pickup = Creep.prototype.pickup;
	public rangedAttack = Creep.prototype.rangedAttack;
	public rangedHeal = Creep.prototype.rangedHeal;
	public rangedMassAttack = Creep.prototype.rangedMassAttack;
	public picrepairkup = Creep.prototype.repair;
	public reserveController = Creep.prototype.reserveController;
	public repair = Creep.prototype.repair;
	public say = Creep.prototype.say;
	public signController = Creep.prototype.signController;
	public suicide = Creep.prototype.suicide;
	public upgradeController = Creep.prototype.upgradeController;
	public withdraw = Creep.prototype.withdraw;

	/**
	 * Return the spawn costs for a single creep bodypart, or an array of bodyparts
	 *
	 * @static
	 * @param {(Array<BodyPartConstant> | BodyPartConstant)} body
	 * @returns {number}
	 * @memberof Qreep
	 */
	public static bodyPartCost(
		body: Array<BodyPartConstant> | BodyPartConstant
	): number {
		let bodyParts: Array<BodyPartConstant> = Array.prototype.concat(
			[],
			body
		);

		return bodyParts.reduce(
			(costs: number, currentValue: BodyPartConstant) => {
				return (costs += BODYPART_COST[currentValue]);
			},
			0
		);
	}

	/**
	 * Returns a creepname for a specific role with an index (e.g. 'miner2' for the 2nd miner)
	 *
	 * @param {string} role
	 * @returns {(string | undefined)}
	 */
	public static generateName = function(role: string): string | undefined {
		let currentCount = Qreep.countCreeps(role);
		let candidateNames = [...Array(currentCount + 1)].map(
			(_, index) => `${role}${index + 1}`
		);
		let creepNames = _.filter(Object.keys(Game.creeps), creepName =>
			creepName.startsWith(role)
		);

		for (let name of candidateNames) {
			if (!_.contains(creepNames, name)) {
				return name;
			}
		}
		return undefined;
	};

	public static countCreeps = function(role?: string): number {
		return _.filter(Game.creeps, creep =>
			role ? creep.memory.role === role : true
		).length;
	};
}
