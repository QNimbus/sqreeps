import { Qreep } from 'qreep/Qreep';

export abstract class Role implements IRole, IRef {
	public name: string;
	public pos: RoomPosition;
	public ref: string;

	public room: Room;

	constructor(name: string, obj: IHasPos) {
		this.name = name;
		this.pos = obj.pos;
		this.ref = this.name;

		this.room = obj.pos.room;
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
