import { getCacheExpiration } from 'utils/utils';
import { profile } from 'Profiler/Decorator';

const CACHE_TIMEOUT = 50;

@profile
export class $ {
	static structures<T extends Structure>(
		object: IRef,
		key: string,
		initializer: () => Array<T>,
		expire = CACHE_TIMEOUT
	): Array<T> {
		const cacheKey = `${object.ref}s#${key}`;

		if (!_cache.structures[cacheKey] || Game.time > _cache.expire[cacheKey]) {
			_cache.structures[cacheKey] = initializer();
			_cache.expire[cacheKey] = getCacheExpiration(expire);
			console.log('Cache miss!');
		} else {
			// Refresh structure list by ID if not already accessed this game tick
			if ((_cache.access[cacheKey] || 0) < Game.time) {
				_cache.structures[cacheKey] = _.map(_cache.structures[cacheKey] || [], s =>
					Game.getObjectById(s.id)
				) as Array<Structure>;
				_cache.access[cacheKey] = Game.time;
			}
			console.log('Cache hit!');
		}
		return _cache.structures[cacheKey] as Array<T>;
	}
}
