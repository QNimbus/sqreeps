import { asciiLogoSmall } from 'visuals/logo';
import { toColumns } from 'utils/utils';
import { log } from 'console/log';

export class SqreepsConsole {

    static init() {
        global.help = this.help();
        global.print = this.print;
        global.killAll = this.killAll;
        global.setLogLevel = (logLevel: number) => { log.setLogLevel(logLevel); return 'Done.'; };
    }

    static killAll = function () {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            creep.suicide();
        }
    }

    static help = function () {
        let minWidth = asciiLogoSmall[0].length;
        let msg = '\n<font color="#dd0000">';

        for (let line of asciiLogoSmall) {
            msg += line + '\n';
        }
        msg += '</font>';

        let descr: { [functionName: string]: string } = {};
        descr['help'] = 'show this message';
        descr['info()'] = 'display version and operation information';
        descr['setLogLevel(int)'] = 'set the logging level from 0 - 4';
        descr['print(...args[])'] = 'log stringified objects to the console';

        // Console list
        let descrMsg = toColumns(descr, { justify: true, padChar: '_', minWidth: minWidth });
        let maxLineLength = _.max(_.map(descrMsg, line => line.length));
        msg += '\n';
        msg += 'Console Commands: '.padRight(maxLineLength, '=') + '\n\n' + descrMsg.join('\n');

        msg += '\n\nRefer to the repository for more information\n';

        return msg;
    }

    static print(...args: any[]): string {
        for (let arg of args) {
            let cache: any = [];
            let msg = JSON.stringify(arg, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Duplicate reference found
                        try {
                            // If this value does not reference a parent it can be deduped
                            return JSON.parse(JSON.stringify(value));
                        } catch (error) {
                            // discard key if value cannot be deduped
                            return;
                        }
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }, '\t');
            cache = null;
            log.debug(msg);
        }
        return 'Done.';
    }
}
