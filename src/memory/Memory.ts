export class Mem {
	protected static cleanCreeps() {
		for (let creepName in Memory.creeps) {
			if (Game.creeps[creepName] === undefined) {
				delete Memory.creeps[creepName];
			}
		}
	}

	protected static cleanFlags() {
		for (let flagName in Memory.flags) {
			if (Game.flags[flagName] === undefined) {
				delete Memory.flags[flagName];
			}
		}
	}

	public static format() {
		Mem.initMemory();
	}

	public static clean() {
		Mem.cleanCreeps();
		Mem.cleanFlags();
	}

	private static initMemory() {
		global._cache = <ICache>{
			access: {},
			expire: {},
			structures: {},
		};
	}
}
