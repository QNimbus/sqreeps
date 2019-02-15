import { color } from 'utils/utils';

const FATAL = -1;
const fatalColor = '#d65156';

function time(): string {
    return color(Game.time.toString(), 'gray');
}

export enum LogLevels {
    ERROR,		// log.level = 0
    WARNING,	// log.level = 1
    ALERT,		// log.level = 2
    INFO,		// log.level = 3
    DEBUG		// log.level = 4
}

/**
 * Debug level for log output
 */
export const LOG_LEVEL: number = LogLevels.INFO;

/**
 * Prepend log output with current tick number.
 */
export const LOG_PRINT_TICK: boolean = true;

/**
 * Maximum padding for source links (for aligning log output).
 */
export const LOG_MAX_PAD: number = 100;

export class Log {
    public get showTick(): boolean {
        return Memory.settings.log.showTick;
    }

    public set showTick(value: boolean) {
        Memory.settings.log.showTick = value;
    }

    public get level(): number {
        return Memory.settings.log.level;
    }

    public setLogLevel(value: number): void {
        let changeValue = true;
        switch (value) {
            case LogLevels.ERROR:
                console.log(`Logging level set to ${value}. Displaying: ERROR.`);
                break;
            case LogLevels.WARNING:
                console.log(`Logging level set to ${value}. Displaying: ERROR, WARNING.`);
                break;
            case LogLevels.ALERT:
                console.log(`Logging level set to ${value}. Displaying: ERROR, WARNING, ALERT.`);
                break;
            case LogLevels.INFO:
                console.log(`Logging level set to ${value}. Displaying: ERROR, WARNING, ALERT, INFO.`);
                break;
            case LogLevels.DEBUG:
                console.log(`Logging level set to ${value}. Displaying: ERROR, WARNING, ALERT, INFO, DEBUG.`);
                break;
            default:
                console.log(`Invalid input: ${value}. Loging level can be set to integers between `
                    + LogLevels.ERROR + ' and ' + LogLevels.DEBUG + ', inclusive.');
                changeValue = false;
                break;
        }
        if (changeValue) {
            Memory.settings.log.level = value;
        }
    }

    public error(...args: any[]): undefined {
        if (this.level >= LogLevels.ERROR) {
            console.log.apply(this, this.buildArguments(LogLevels.ERROR).concat(Array.prototype.slice.call(args)));
        }
        return undefined;
    }

    public warning(...args: any[]): undefined {
        if (this.level >= LogLevels.WARNING) {
            console.log.apply(this, this.buildArguments(LogLevels.WARNING).concat(Array.prototype.slice.call(args)));
        }
        return undefined;
    }

    public alert(...args: any[]): undefined {
        if (this.level >= LogLevels.ALERT) {
            console.log.apply(this, this.buildArguments(LogLevels.ALERT).concat(Array.prototype.slice.call(args)));
        }
        return undefined;
    }

    public notify(message: string): undefined {
        this.alert(message);
        Game.notify(message);
        return undefined;
    }

    public info(...args: any[]): undefined {
        if (this.level >= LogLevels.INFO) {
            console.log.apply(this, this.buildArguments(LogLevels.INFO).concat(Array.prototype.slice.call(args)));
        }
        return undefined;
    }

    public debug(...args: any[]) {
        if (this.level >= LogLevels.DEBUG) {
            console.log.apply(this, this.buildArguments(LogLevels.DEBUG).concat(Array.prototype.slice.call(args)));
        }
    }

    private buildArguments(level: number): any {
        const out: string[] = [];
        switch (level) {
            case LogLevels.ERROR:
                out.push(color('ERROR  ', 'red'));
                break;
            case LogLevels.WARNING:
                out.push(color('WARNING', 'orange'));
                break;
            case LogLevels.ALERT:
                out.push(color('ALERT  ', 'yellow'));
                break;
            case LogLevels.INFO:
                out.push(color('INFO   ', 'green'));
                break;
            case LogLevels.DEBUG:
                out.push(color('DEBUG  ', 'gray'));
                break;
            case FATAL:
                out.push(color('FATAL  ', fatalColor));
                break;
            default:
                break;
        }
        if (this.showTick) {
            out.push(time());
        }
        return out;
    }

    constructor() {
        _.defaultsDeep(Memory, {
            settings: {
                log: {
                    level: LOG_LEVEL,
                    showTick: LOG_PRINT_TICK,
                }
            }
        });
    }
}

export const log = new Log();
