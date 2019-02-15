import { assert } from 'chai';
import { Game } from './mock';
import { Qreep } from 'qreep/Qreep';

interface Memory {
  [name: string]: any;
  creeps: { [name: string]: CreepMemory };
  flags: { [name: string]: FlagMemory };
  rooms: { [name: string]: RoomMemory };
  spawns: { [name: string]: SpawnMemory };
}

interface CreepMemory { }
interface FlagMemory { }
interface RoomMemory { }
interface SpawnMemory { }

declare const Memory: Memory;

describe("qreep", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
    // runs before each test in this block
    // @ts-ignore : allow adding Game to global
    // global.Game = _.clone(Game);
    // // @ts-ignore : allow adding Memory to global
    // global.Memory = _.clone(Memory);

    // // Create mock-creeps

    // Game.creeps['miner1'] = {};
    // Memory.creeps['miner1'] = { role: 'miner' };

    // // Create 5 miner creeps
    // [...Array(5)].map((val, index) => `miner${index}`).forEach((creep) => {
    //   Memory.creeps[creep].push({ role: 'miner' });
    //   Game.creeps[creep].push({});
    //   Game.creeps[creep].memory = Memory.creeps[creep]

    // });
  });

  // it("should count 6 creeps", () => {
  //   assert.isTrue(Qreep.countCreeps() === 6);
  // });
});
