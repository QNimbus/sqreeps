import { ErrorMapper } from 'utils/ErrorMapper';

import './globals';
import './prototypes/Prototypes';
import './utils/utils';

import { log } from 'console/log';
import { sandbox } from 'sandbox';
import { SqreepsConsole } from 'console/console';
import { Mem } from 'memory/Memory';
import { RoleHarvester } from 'roles/instances/RoleHarvester';
import { RoleUpgrader } from 'roles/instances/RoleUpgrader';
import { Role } from 'roles/Role';
import { RoleTester } from 'roles/instances/RoleTester';

class Directive implements IDirective {
  public static initializeRole(flag: Flag): Role | undefined {
    switch (flag.color) {
      case COLOR_YELLOW: {
        return new RoleHarvester('harvester', flag);
      }
      case COLOR_PURPLE: {
        return new RoleUpgrader('upgrader', flag);
      }
      case COLOR_BROWN: {
        return new RoleTester('tester', flag);
      }
      default: {
        return;
      }
    }
  }
}

function main(): void {

  // Get directives and initialize Roles
  for (let flagName in Game.flags) {
    let flag = Game.flags[flagName];
    let role = Directive.initializeRole(flag);

    if (role && role instanceof Role) {
      role.run();
    }
  }

  // Animate each spawn
  for (let name in Game.spawns) {
    Game.spawns[name].run();
  }

  if (Game.time % 10 === 5) {
    Mem.clean();
  }

  sandbox();
};

export const loop = ErrorMapper.wrapLoop(main);

// This gets run on each global reset
function onGlobalReset(): void {
  log.alert(`Codebase was updated or global reset. Type 'help' for a list of console commands.`);

  SqreepsConsole.init();
  Mem.format();
}

// Run the global reset code
onGlobalReset();
