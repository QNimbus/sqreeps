import { DominionSite } from './DominionSite';
import { Dominion } from 'Dominion/Dominion';

export class QreepFactory extends DominionSite {

    public spawns: Array<StructureSpawn>;
    public availableSpawns: Array<StructureSpawn>;

    constructor(dominion: Dominion, mainSpawn: StructureSpawn) {
        super(dominion, mainSpawn, 'Factory');

        this.spawns = this.dominion.spawns;
        this.availableSpawns = _.filter(this.spawns, (spawn as StructureSpawn) => {spawn.})
    }
}
