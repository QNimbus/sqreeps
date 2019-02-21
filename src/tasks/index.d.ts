interface ITask {
    name: string;
    alias: string;

    settings: ITaskSettings;
    creepRef: ICreepRef;
    targetRef: ITargetRef;

    nextTaskRef?: ITask;
}

interface ICreepRef {
    name?: string;
}

interface ITargetRef {
    ref: string;
    pos: IPos;
}

interface ITaskSettings {
    targetRange?: number;
    nextPos?: RoomPosition;
    once?: boolean;
}
