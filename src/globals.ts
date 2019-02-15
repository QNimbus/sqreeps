declare const __VERSION__: string;
global.__VERSION__ = '0.0.1';

/**
 * Dereference any object by identifier.
 * (e.g. 'MyCreep' returns a creep with name 'MyCreep' or 'c44207728e621fc' returns RoomObject with id c44207728e621fc)
 *
 * @param {string} refString
 * @returns {({} | null)}
 */
declare function deref(ref: string): RoomObject;
declare function deref(ref: { x: number, y: number, roomName: string }): RoomPosition;
global.deref = function (ref: string | { x: number, y: number, roomName: string }): RoomObject | RoomPosition {
    if (typeof ref === 'string') {
        return Game.getObjectById(ref) as RoomObject ||
            Game.flags[ref] ||
            Game.creeps[ref] ||
            null;
    } else {
        return new RoomPosition(ref.x, ref.y, ref.roomName);
    }
};
