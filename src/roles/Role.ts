import { Qreep } from 'qreep/Qreep';

export abstract class Role implements IRole {

    public name: string;
    public pos: RoomPosition

    constructor(name: string, obj: IHasPos) {
        this.name = name;
        this.pos = obj.pos;
    }

    public runQreeps(this: Role, roleCreeps: Array<Qreep>, taskHandler: (creep: Qreep) => void): void {
        for (let creep of roleCreeps) {
            if (creep.isIdle) {
                // Assign new task to creep
                taskHandler(creep);
            }
            creep.run();
        }
    }

    public abstract run(this: Role): void;
}
