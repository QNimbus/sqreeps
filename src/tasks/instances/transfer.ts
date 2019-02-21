import { Task } from 'tasks/Task';
import { EnergyStructure, StoreStructure, isEnergyStructure, isStoreStructure } from 'declarations/typeGuards';
import { TASK_TARGET_RANGES } from 'qreep/Qreep';

export type transferTargetType = EnergyStructure | StoreStructure | Creep;

export class TaskTransfer extends Task {
	public static taskName = 'transfer';

	public target: transferTargetType;
	public data: {
		resourceType: ResourceConstant;
		amount?: number;
	};

	constructor(
		target: transferTargetType,
		resourceType: ResourceConstant = RESOURCE_ENERGY,
		amount?: number,
		settings?: ITaskSettings,
		alias?: string
	) {
		super(TaskTransfer.taskName, target, settings, alias);

		this.settings.targetRange = TASK_TARGET_RANGES.TRANSFER;

		this.data = {
			resourceType: resourceType,
			amount: amount,
		};
	}

	public isValidTask(): boolean {
		let amount = this.data.amount || 1;
		let cargo = (!!this.creep && this.creep.carry[this.data.resourceType]) || 0;
		return cargo >= amount;
	}

	public isValidTarget(): boolean {
		let amount = this.data.amount || 1;

		if (this.target instanceof Creep) {
			return this.target.carryCapacity - _.sum(this.target.carry) >= amount;
		} else if (isEnergyStructure(this.target) && this.data.resourceType === RESOURCE_ENERGY) {
			return this.target.energy + amount <= this.target.energyCapacity;
		} else if (isStoreStructure(this.target)) {
			return _.sum(this.target.store) + amount <= this.target.storeCapacity;
		}
		return false;
	}

	public work(): number {
		return this.creep!.transfer(this.target, this.data.resourceType, this.data.amount);
	}
}
