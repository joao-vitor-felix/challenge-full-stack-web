import NodeCache from "node-cache";
import { ICache } from "./interfaces/ICache";

const ONE_HOUR = 60 * 60;

export class CacheAdapter implements ICache {
  cache: NodeCache;

  constructor(ttlSeconds = ONE_HOUR) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  get<T = any>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set(key: string, value: any): boolean {
    return this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string | string[]): number {
    return this.cache.del(key);
  }

  keys(): string[] {
    return this.cache.keys();
  }

  clear(): void {
    this.cache.flushAll();
  }
}
