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

const MemorySegmenterDefaults = {};

export class MemorySegmenter {
	private static cache: IMemorySegmenterCache = {
		segments: {},
		lastAccessed: {},
		lastModified: {},
	};
}
