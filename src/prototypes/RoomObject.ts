import 'prototypes/Misc';

// Properties

Object.defineProperty(RoomObject.prototype, 'ref', {
    get: function (): string {
        return this.id || this.name || '';
    }, configurable: true,
});

Object.defineProperty(RoomObject.prototype, 'link', {
    get: function (): string {
        return '<a href="#!/room/' + Game.shard.name + '/' + this.pos.roomName + '">[' + this.id + ']</a>';
    },
    configurable: true,
});
