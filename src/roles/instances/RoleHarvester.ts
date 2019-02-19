import { Role } from '../Role';
import { Qreep } from 'qreep/Qreep';
import { Tasks } from 'tasks/Tasks';
import { log } from 'console/log';

export class RoleHarvester extends Role {

    public harvestPos?: RoomPosition;
    public source?: Source;
    public container?: StructureContainer;
    public constructionSite?: ConstructionSite<STRUCTURE_CONTAINER>;

    public allowDropMining: boolean;

    constructor(name: string, obj: HasPos) {
        super(name, obj);

        this.allowDropMining = false; // Allow drop mining at lower levels?

        this.findRelevantSites();
    }

    private findRelevantSites(): void {
        let room = Game.rooms[this.pos.roomName];
        if (room) {
            let nearbyContainers = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: s => s.structureType === STRUCTURE_CONTAINER }) as StructureContainer[];
            let sources = this.pos.lookFor(LOOK_SOURCES);
            this.source = _.first(sources);
            this.container = _.first(nearbyContainers) || undefined;

            if (!this.container) {
                let nearbyConstructionSites = this.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, { filter: s => s.structureType === STRUCTURE_CONTAINER }) as ConstructionSite<STRUCTURE_CONTAINER>[];
                this.constructionSite = _.first(nearbyConstructionSites) || undefined;
            }
        }
    }

    private manageHarvestingContainer(): void {
        if (!this.allowDropMining) {
            if (!this.container && this.constructionSite) {

            }
        }
    }

    public handleHarvester(harvester: Qreep): void {
        // Is the current task still valid or do we need a new task
        if (!harvester.task || !harvester.task.isValid()) {
            if (this.constructionSite) {
                if (!harvester.isFull) {
                    harvester.task = Tasks.harvest(this.source!);
                } else {
                    harvester.task = Tasks.build(this.constructionSite!);
                }
                return;
            }

            if (this.container) {
                if (this.container.isFull || !harvester.isFull) {
                    harvester.task = Tasks.harvest(this.source!);
                } else {
                    harvester.task = Tasks.transfer(this.container!);
                }
                return;
            }

            if (!harvester.isFull) {
                harvester.task = Tasks.harvest(this.source!);
            } else {
                harvester.task = Tasks.transfer(Game.spawns['Spawn1']);
            }
        }
    }

    public run(this: RoleHarvester): void {
        let roleCreeps = _.map(_.filter(Game.creeps, c => c.role() === 'harvester'), (creep) => new Qreep(creep));

        this.runQreeps(roleCreeps, this.handleHarvester.bind(this))
    }
}
