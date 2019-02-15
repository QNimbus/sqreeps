export function countCreeps(type?: string): number {
    let creeps = Game.creeps;

    if (type) {
        return _.filter(creeps, c => c.role() === type).length;
    } else {
        return Object.keys(creeps).length;
    }

}
