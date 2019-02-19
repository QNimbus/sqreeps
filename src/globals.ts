declare const __VERSION__: string;
global.__VERSION__ = '0.0.1';

/**
 * Dereference any object by identifier.
 * (e.g. 'MyCreep' returns a creep with name 'MyCreep' or 'c44207728e621fc' returns RoomObject with id c44207728e621fc)
 *
 * @param {string} refString
 * @returns {({} | undefined)}
 */
declare function deref(ref: string): RoomObject | undefined;
declare function derefRoomPosition(ref: IPos): RoomPosition;

global.deref = function (ref: string): RoomObject | undefined {
    return Game.getObjectById(ref) as RoomObject ||
        Game.flags[ref] ||
        Game.creeps[ref] ||
        Game.spawns[ref] ||
        undefined;
};

global.derefRoomPosition = function (ref: IPos): RoomPosition {
    return new RoomPosition(ref.x, ref.y, ref.roomName);
};

