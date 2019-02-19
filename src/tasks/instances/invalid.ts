import { Task } from 'tasks/Task';

export class TaskInvalid extends Task {

    constructor() {
        super('INVALID', <never>null as RoomObject);
    }

    isValidTask() {
        return false;
    }

    isValidTarget() {
        return false;
    }

    work() {
        return OK;
    }
}
