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
global.deref = function (refString: string): RoomObject {
    return Game.getObjectById(refString) as RoomObject ||
        Game.flags[refString] ||
        Game.creeps[refString] ||
        null;
};
