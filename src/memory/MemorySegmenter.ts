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

const MAX_ACTIVE_SEGMENTS = 10;

const MemorySegmenterDefaults: IMemorySegmenter = {
	activeSegments: [],
	activeForeignSegment: undefined,
	publicSegments: [],
};

export class MemorySegmenter {
	private static _instance: MemorySegmenter;

	private segmenter: IMemorySegmenter;

	private _cache: IMemorySegmenterCache = {
		segments: {},
		lastAccessed: {},
		lastModified: {},
	};

	private constructor() {
		this.segmenter = _.defaultsDeep({}, MemorySegmenterDefaults);
	}

	public static get Instance(): MemorySegmenter {
		return this._instance || (this._instance = new this());
	}

	public static get memory(): IMemorySegmenter {
		return this._instance.segmenter;
	}

	public static get cache(): IMemorySegmenterCache {
		return this._instance._cache;
	}

	public static requestSegments(...ids: Array<number>) {
		for (let id of ids) {
			if (!this.memory.activeSegments.includes(id)) {
				this.memory.activeSegments.push(id);
				if (this.memory.activeSegments.length > MAX_ACTIVE_SEGMENTS) {
					let removeSegment = this.memory.activeSegments.shift();
					console.log(`Maximum number of active memory segments reached; removing segment ${removeSegment}`);
				}
			}
		}
	}
}
