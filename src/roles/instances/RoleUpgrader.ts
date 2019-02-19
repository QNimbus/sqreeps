import { Role } from '../Role';
import { log } from 'console/log';
import { Qreep } from 'qreep/Qreep';
import { Tasks } from 'tasks/Tasks';

export class RoleUpgrader extends Role {

    public controller?: StructureController;
    public source?: Source;

    constructor(name: string, obj: HasPos) {
        super(name, obj);

        this.findRelevantSites();
    }

    private findRelevantSites(): void {
        let room = Game.rooms[this.pos.roomName];
        if (room) {
            let source = this.pos.findClosestByRange(FIND_SOURCES);

            this.controller = room.controller && room.controller.my ? room.controller : undefined;
            this.source = source ? source : undefined;
        }
    }

    public getAssignment(this: RoleUpgrader, creep: Qreep): void {
        let controller = Game.rooms[creep.pos.roomName].controller as StructureController;

        if (controller && controller.my) {
            creep.memory.target = controller.id;
            log.debug(`Creep '${creep.name}' assigned to room controller: '${creep.memory.target}'`);
        } else {
            log.debug(`Unable to give creep '${creep.name}' an upgrading assignment`);
        }
    }

    public handleUpgrader(upgrader: Qreep): void {
        if (!upgrader.task || !upgrader.task.isValid()) {
            if (!upgrader.isEmpty) {
                upgrader.task = Tasks.upgrade(this.controller!);
            } else {
                upgrader.task = Tasks.harvest(this.source!);
            }
        }
    }

    public run(this: RoleUpgrader): void {
        if (this.controller) {
            let roleCreeps = _.map(_.filter(Game.creeps, c => c.role() === 'upgrader'), (creep) => new Qreep(creep));

            this.runQreeps(roleCreeps, this.handleUpgrader.bind(this))
        }
    }
}
