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
        let source = this.source as Source;

        // Do we have a container construction site nearby?
        if (this.constructionSite) {
            harvester.task = Tasks.chain([Tasks.harvest(source), Tasks.build(this.constructionSite)]);
            return;
        }

        // Are we mining into the container?
        if (this.container) {
            if (!harvester.isFull) {
                harvester.task = Tasks.harvest(source);
            } else {
                // Deposit energy in container if possible, otherwise try spawn
                if (!this.container.isFull) {
                    harvester.task = Tasks.transfer(this.container);
                } else {
                    let nearbyEnergyStructure = Game.spawns['Spawn1']; // TODO: Find nearby energy structure that needs refilling
                    if (nearbyEnergyStructure && nearbyEnergyStructure.energy < nearbyEnergyStructure.energyCapacity) {
                        // TODO: Make spawngroup or extensions accesible for Role class instead of hardcoding spawn structure
                        harvester.task = Tasks.transfer(nearbyEnergyStructure);
                    } else {
                        // Drop mine
                        harvester.task = Tasks.harvest(source);
                    }
                }
            }
            return;
        } else {
            harvester.task = Tasks.chain([Tasks.harvest(source), Tasks.transfer(Game.spawns['Spawn1'])]);
            return;
        }
    }

    public run(this: RoleHarvester): void {
        let harvesters = _.map(_.filter(Game.creeps, c => c.role() === 'harvester'), (creep) => new Qreep(creep));

        this.runQreeps(harvesters, harvester => this.handleHarvester(harvester));
    }
}
