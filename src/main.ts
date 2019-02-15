import { ErrorMapper } from 'utils/ErrorMapper';

import './globals';
import './prototypes/Prototypes';
import './utils/utils';

import { log } from 'console/log';
import { sandbox } from 'sandbox';
import { SqreepsConsole } from 'console/console';
import { Mem } from 'memory/Memory';
import { Qreep } from 'qreep/Qreep';
import { RoleHarvester } from 'roles/instances/RoleHarvester';
import { RoleUpgrader } from 'roles/instances/RoleUpgrader';

function main(): void {
  let harvesterRole: RoleHarvester;
  let upgraderRole: RoleUpgrader;
  let flagHarvest = Game.flags['Flag1'];
  let flagController = Game.flags['Flag2'];

  if (flagHarvest) {
    harvesterRole = new RoleHarvester('harvester', flagHarvest);
    harvesterRole.run();
  }

  if (flagController) {
    upgraderRole = new RoleUpgrader('upgrader', flagController);
    upgraderRole.run();
  }

  // Animate each creep
  for (let name in Game.creeps) {
    let qreep = new Qreep(Game.creeps[name]);
    qreep.run();
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
