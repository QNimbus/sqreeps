import { Role } from '../Role';
import { log } from 'console/log';
import { Qreep, TASK_TARGET_RANGES } from 'qreep/Qreep';
import { Tasks } from 'tasks/Tasks';

export class RoleUpgrader extends Role {

    public controller?: StructureController;
    public source?: Source;
    public container?: StructureContainer;
    public constructionSite?: ConstructionSite<STRUCTURE_CONTAINER>;

    constructor(name: string, obj: IHasPos) {
        super(name, obj);

        this.findRelevantSites();
    }

    private findRelevantSites(): void {
        let room = Game.rooms[this.pos.roomName];
        if (room) {
            let source = this.pos.findClosestByRange(FIND_SOURCES);

            this.controller = room.controller && room.controller.my ? room.controller : undefined;
            this.source = source ? source : undefined;

            let nearbyContainers = this.pos.findInRange(FIND_STRUCTURES, TASK_TARGET_RANGES.UPGRADE, { filter: s => s.structureType === STRUCTURE_CONTAINER }) as StructureContainer[];
            this.container = _.first(nearbyContainers) || undefined;

            if (!this.container) {
                let nearbyConstructionSites = this.pos.findInRange(FIND_CONSTRUCTION_SITES, TASK_TARGET_RANGES.UPGRADE, { filter: s => s.structureType === STRUCTURE_CONTAINER }) as ConstructionSite<STRUCTURE_CONTAINER>[];
                this.constructionSite = _.first(nearbyConstructionSites) || undefined;
            }
        }
    }

    public handleUpgrader(upgrader: Qreep): void {
        let source = this.source as Source;
        let controller = this.controller as StructureController;

        // Do we have a container construction site nearby?
        if (this.constructionSite) {
            upgrader.task = Tasks.chain([
                Tasks.harvest(source, undefined, 'Harvest source'),
                Tasks.build(this.constructionSite, undefined, 'Build container'),
                Tasks.harvest(source, undefined, 'Harvest source'),
                Tasks.upgrade(controller, undefined, 'Upgrade controller')
            ]);
            return;
        }

        if (!upgrader.isEmpty) {
            upgrader.task = Tasks.upgrade(this.controller!);
        } else {
            upgrader.task = Tasks.harvest(this.source!);
        }
    }

    public run(this: RoleUpgrader): void {
        if (this.controller) {
            let upgraders = _.map(_.filter(Game.creeps, c => c.role() === 'upgrader'), (creep) => new Qreep(creep));

            this.runQreeps(upgraders, upgrader => this.handleUpgrader(upgrader));
        }
    }
}
