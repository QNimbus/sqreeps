import { Role } from 'roles/Role';
import { Dominion } from 'Dominion/Dominion';

export abstract class DominionSite {
	public dominion: Dominion;
	public room: Room;
	public pos: RoomPosition;
	public ref: string;

	public memory: IDominionSiteMemory;
	public role?: Role;

	/**
	 *Creates an instance of DominionSite.
	 * @param {Dominion} dominion
	 * @param {RoomObject} instantiationObject
	 * @param {string} name
	 * @param {boolean} [includePos=false]
	 * @memberof DominionSite
	 */
	constructor(dominion: Dominion, instantiationObject: RoomObject, name: string, includePos: boolean = false) {
		this.dominion = dominion;
		this.room = instantiationObject.room!;
		this.pos = instantiationObject.pos;

		this.ref = includePos ? `${name}@${instantiationObject.pos.name}` : `${name}@${this.dominion.name}`;
	}

	/**
	 *
	 *
	 * @readonly
	 * @type {string}
	 * @memberof DominionSite
	 */
	get print(): string {
		return '<a href="#!/room/' + Game.shard.name + '/' + this.pos.roomName + '">[' + this.ref + ']</a>';
	}
}
