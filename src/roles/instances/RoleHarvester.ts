import { Role } from '../Role';
import { log } from 'console/log';
import { Qreep } from 'qreep/Qreep';
import { Tasks } from 'tasks/Tasks';
import { TASK_TARGET_RANGES } from 'tasks/Task';

export class RoleHarvester extends Role {

    public harvestPos?: RoomPosition;
    public source?: Source;

    constructor(name: string, obj: HasPos) {
        super(name, obj);

        this.findRelevantSites();
    }

    private findRelevantSites(): void {
        let room = Game.rooms[this.pos.roomName];
        if (room) {
            this.source = _.first(this.pos.lookFor(LOOK_SOURCES));
        }
    }

    public handleHarvester(harvester: Qreep): void {
        if (!harvester.task || !harvester.task.isValid()) {
            if (!harvester.isFull) {
                harvester.task = Tasks.harvest(this.source!);
            } else {
                harvester.task = Tasks.transfer(Game.spawns['Spawn1']);
            }
        }
    }

    public run(this: RoleHarvester): void {
        let roleCreeps = _.map(_.filter(Game.creeps, c => c.role() === 'harvester'), (creep) => new Qreep(creep));

        this._run(roleCreeps, this.handleHarvester.bind(this))
    }
}
