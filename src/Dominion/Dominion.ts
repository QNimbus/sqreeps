import { DominionSite } from 'DominionSite/DominionSite';

export class Dominion {
	public id: number;
	public name: string;
	public ref: string;

	public room: Room;
	public sites?: Array<DominionSite>;

	public spawns: Array<StructureSpawn>;

	constructor(id: number, roomName: string) {
		this.id = id;
		this.name = roomName;
		this.ref = roomName;

		this.room = Game.rooms[roomName];
	}

	private registerDominionStructures(): void {
		this.spawns = _.filter(this.room.spawns);
	}
}
