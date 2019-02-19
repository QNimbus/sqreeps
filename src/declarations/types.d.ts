declare var global: any;

declare namespace NodeJS {
    interface Global {

        __VERSION__: string;

        deref(ref: string): {} | null;
    }
}

interface IPos {
    x: number;
    y: number;
    roomName: string;
}

interface IRole {
    name: string;

    pos: RoomPosition;
}

interface IDirective {

}

interface CreepMemory {
    role: string;
    room: string;

    task?: ITask;
    working?: boolean;
    target?: string;
}

interface Memory {
    uuid: number;
    log: any;
}

interface HasPos {
    pos: RoomPosition
}
