import { EnergyStructure, StoreStructure, isEnergyStructure, isStoreStructure } from 'declarations/typeGuards';
import { Task, TASK_TARGET_RANGES } from 'tasks/Task';

export type transferTargetType =
    EnergyStructure
    | StoreStructure
    | Creep;

export class TaskTransfer extends Task {

    public static taskName = 'transfer';
    public data: {
        resourceType: ResourceConstant,
        amount?: number
    }

    constructor(target: transferTargetType, resourceType: ResourceConstant = RESOURCE_ENERGY, amount?: number) {
        super(TaskTransfer.taskName, target);

        this.settings.targetRange = TASK_TARGET_RANGES.TRANSFER;

        this.data = {
            resourceType: resourceType,
            amount: amount,
        };
    }

    public isValidTask(): boolean {
        let amount = this.data.amount || 1;
        let cargo = (<Creep>this.creep).carry[this.data.resourceType] || 0;
        return cargo >= amount;
    }

    public isValidTarget(): boolean {
        let amount = this.data.amount || 1;
        let target = this.target;

        if (target instanceof Creep) {
            return (target.carryCapacity - _.sum(target.carry)) >= amount;
        } else if (isEnergyStructure(target) && this.data.resourceType === RESOURCE_ENERGY) {
            return target.energy + amount <= target.energyCapacity;
        } else if (isStoreStructure(target)) {
            return (target.storeCapacity - _.sum(target.store)) >= amount;
        }
        return false;
    }

    public work(): number {
        return (<Creep>this.creep).transfer((<transferTargetType>this.target), this.data.resourceType, this.data.amount);
    }
}
