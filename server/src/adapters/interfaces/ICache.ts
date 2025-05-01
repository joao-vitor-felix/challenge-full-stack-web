export interface ICache {
  get<T = any>(key: string): T | undefined;
  set(key: string, value: any, ttl?: number): boolean;
  has(key: string): boolean;
  keys(): string[];
  delete(key: string | string[]): number;
  clear(): void;
}
