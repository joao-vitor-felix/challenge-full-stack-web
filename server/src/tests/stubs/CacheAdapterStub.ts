import { ICache } from "@/adapters/interfaces/ICache";

export class CacheAdapterStub implements ICache {
  get<T = any>(_key: string): T | undefined {
    return {} as T;
  }

  set(_key: string, _value: any): boolean {
    return true;
  }

  has(_key: string): boolean {
    return true;
  }

  keys(): string[] {
    return [];
  }

  delete(_key: string | string[]): number {
    return 1;
  }

  clear(): void {
    return;
  }
}
