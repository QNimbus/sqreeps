import { Role } from '../Role';
import { Qreep } from 'qreep/Qreep';
import { Tasks } from 'tasks/Tasks';

export class RoleTester extends Role {

    constructor(name: string, obj: IHasPos) {
        super(name, obj);
    }

    private handler(this: RoleTester, tester: Qreep): void {
        let spawn = Game.spawns['Spawn1'];
        let room = spawn.room;
        let sources = room.find(FIND_SOURCES);
        let source = _.first(sources);

        tester.task = Tasks.chain([
            Tasks.goto(source, undefined, 'Go to source'),
            Tasks.harvest(source, { once: true } as ITaskSettings, 'Harvest source'),
            Tasks.goto(spawn, undefined, 'Go to spawn'),
            Tasks.transfer(spawn, undefined, undefined, undefined, 'Transfer energy to spawn')
        ]);
    }

    // public run(this: RoleTester): void {
    //     let roleCreeps = _.map(_.filter(Game.creeps, c => c.role() === 'tester'), (creep) => new Qreep(creep));

    //     for (let creep of roleCreeps) {
    //         if (creep.isIdle) {
    //             log.debug('Idle...');
    //             // Assign new task to creep

    //             let spawn = Game.spawns['Spawn1'];
    //             let room = spawn.room;
    //             let sources = room.find(FIND_SOURCES);
    //             let source = _.first(sources);

    //             creep.task = Tasks.chain([
    //                 Tasks.goto(source, 'Go to source'),
    //                 Tasks.harvest(source, 'Harvest source'),
    //                 Tasks.goto(this, 'Go to flag'),
    //                 Tasks.drop(this, 'Drop energy'),
    //                 Tasks.goto(spawn, 'Go to spawn'),
    //                 Tasks.transfer(spawn, 'Transfer energy to spawn')
    //             ]);
    //         }
    //         creep.run();
    //     }
    // }

    public run(this: RoleTester): void {
        let roleCreeps = _.map(_.filter(Game.creeps, c => c.role() === 'tester'), (creep) => new Qreep(creep));

        this.runQreeps(roleCreeps, this.handler.bind(this));
    }
}
