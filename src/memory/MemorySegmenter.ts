interface IMemorySegment {
	[property: string]: any;
}

interface IForeignSegment {
	username: string;
	id?: number;
}

interface IMemorySegmenterCache {
	segments: { [id: number]: IMemorySegment };
	lastAccessed: { [id: number]: number };
	lastModified: { [id: number]: number };
}

interface IMemorySegmenter {
	activeSegments: Array<number>;
	activeForeignSegment?: IForeignSegment;
	publicSegments: Array<number>;
}

const MemorySegmenterDefaults: IMemorySegmenter = {
	activeSegments: [],
	activeForeignSegment: undefined,
	publicSegments: [],
};

const MAX_ACTIVE_SEGMENTS = 10;

/**
 * Singleton
 *
 * @export
 * @class MemorySegmenter
 */
export class MemorySegmenter {
	private static _instance: MemorySegmenter;

	private _data: IMemorySegmenter;

	private _cache: IMemorySegmenterCache = {
		segments: {},
		lastAccessed: {},
		lastModified: {},
	};

	private constructor() {
		this._data = _.defaultsDeep({}, MemorySegmenterDefaults);
	}

	public static get Instance(): MemorySegmenter {
		return this._instance || (this._instance = new this());
	}

	public static get data(): IMemorySegmenter {
		return this._instance._data;
	}

	public static get cache(): IMemorySegmenterCache {
		return this._instance._cache;
	}

	/**
	 *
	 *
	 * @static
	 * @param {...Array<number>} ids
	 * @memberof MemorySegmenter
	 */
	public static requestSegments(...ids: Array<number>) {
		for (let id of ids) {
			if (!this.data.activeSegments.includes(id)) {
				this.data.activeSegments.push(id);
				if (this.data.activeSegments.length > MAX_ACTIVE_SEGMENTS) {
					let removeSegment = this.data.activeSegments.shift() as number;

					console.log(`Maximum number of active memory segments reached; removing segment ${removeSegment}`);
				}
			}
		}
	}

	/**
	 * Get memory segment from RawMemory (cached)
	 *
	 * @static
	 * @param {number} id
	 * @returns {IMemorySegment}
	 * @memberof MemorySegmenter
	 */
	public static getSegment(id: number): IMemorySegment {
		let currentTick = Game.time;

		if ((this.cache.lastAccessed[id] || 0) > this.cache.lastModified[id] || 0) {
			return this.cache.segments[id];
		} else {
			let rawData = RawMemory.segments[id];
			let segment: IMemorySegment;
			try {
				segment = JSON.parse(rawData);
			} catch (e) {
				if (e instanceof SyntaxError) {
					// This can happen if the RawData string was not valid JSON or it was undefined/empty
					// In which case we will initialize the segment as an empty object
					segment = {};
					this.cache.lastModified[id] = currentTick;
				} else {
					throw e;
				}
			}

			this.cache.segments[id] = segment;
			this.cache.lastAccessed[id] = currentTick;

			return segment;
		}
	}

	/**
	 *
	 *
	 * @static
	 * @param {number} id
	 * @param {string} key
	 * @returns {(any | undefined)}
	 * @memberof MemorySegmenter
	 */
	public static getSegmentProperty(id: number, key: string): any | undefined {
		let segment = MemorySegmenter.getSegment(id);
		return segment[key];
	}

	/**
	 *
	 *
	 * @static
	 * @param {number} id
	 * @param {IMemorySegment} segment
	 * @memberof MemorySegmenter
	 */
	public static setSegment(id: number, segment: IMemorySegment): void {
		let currentTick = Game.time;

		this.cache.segments[id] = segment;
		this.cache.lastModified[id] = currentTick;
	}

	/**
	 *
	 *
	 * @static
	 * @param {number} id
	 * @param {string} key
	 * @param {*} value
	 * @memberof MemorySegmenter
	 */
	public static setSegmentProperty(id: number, key: string, value: any): void {
		let currentTick = Game.time;
		let segment = MemorySegmenter.getSegment(id);

		segment[key] = value;
		this.cache.lastModified[id] = currentTick;
	}

	/**
	 *
	 *
	 * @static
	 * @param {number} id
	 * @memberof MemorySegmenter
	 */
	public static markSegmentAsPublic(id: number): void {
		if (!this.data.publicSegments.includes(id)) {
			this.data.publicSegments.push(id);
		}
	}

	/**
	 *
	 *
	 * @static
	 * @param {string} username
	 * @param {number} [id]
	 * @returns {void}
	 * @memberof MemorySegmenter
	 */
	public static requestForeignSegment(username: string, id?: number): void {
		// TODO: Implement this
		return;
	}

	/**
	 *
	 *
	 * @static
	 * @returns {IMemorySegment}
	 * @memberof MemorySegmenter
	 */
	public static getForeignSegment(): IMemorySegment {
		// TODO: Implement this
		return {};
	}

	public static run(): void {
		let currentTick = Game.time;

		RawMemory.setActiveSegments(this.data.activeSegments);
		RawMemory.setPublicSegments(this.data.publicSegments);
		if (this.data.activeForeignSegment) {
			// TODO:
		} else {
			RawMemory.setActiveForeignSegment(null);
		}

		// Commit segment that were changed during current tick to memory
		for (let id in this.cache.lastModified) {
			if (this.cache.lastModified[id] === currentTick) {
				RawMemory.segments[id] = JSON.stringify(this.cache.segments[id]);
			}
		}
	}
}
