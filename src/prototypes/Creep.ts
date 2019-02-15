// Properties

Object.defineProperty(Creep.prototype, 'link', {
    get: function (): string {
        return '<a href="#!/room/' + Game.shard.name + '/' + this.pos.roomName + '">[' + this.name + ']</a>';
    },
    configurable: true,
})

Object.defineProperty(Creep.prototype, 'task', {
    get: function () {
        // if (this.memory.hasOwnProperty('task') && this.memory.task) {
        //     var target = deref(this.memory.task.targetRef);
        //     var task = tasks(this.memory.task.name, target) as Task;

        //     task.creep = this.memory.task.creepName;
        //     task.target = target;

        //     return task;
        // } else {
        //     return null;
        // }
    },
    set: function (newTask) {
        // if (newTask !== null) {
        //     log.debug(`use Creep.assign() to assign tasks. Creep.task = ___ should only be used to null a task.`);
        // } else {
        //     this.memory.task = newTask;
        // }
    },
    configurable: true,
});

// Methods

Creep.prototype.role = function (this: Creep): string | undefined {
    return this.memory.role;
}

Creep.prototype.performRole = function (this: Creep): void {
    let roleName = this.role();
    let role;

    if (roleName) {
        try {
            // role = roles(roleName);
            // role.run(new Qreep(this));
        } catch (e) {

        }
    }
}

Creep.prototype.run = function (this: Creep): void {
    this.performRole();
}
