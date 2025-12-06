import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  /**
   * @description The storage of the service.
   */
  private readonly STORAGE = {
    __WHITELIST__: new Map<string, unknown>(),
    __BLACKLIST__: new Map<string, unknown>(),
  };

  /**
   * @description Get the value of a key in a storage.
   * @param key - The key to get the value of.
   * @param storage - The storage to get the value from.
   * @returns The value of the key.
   */
  public get<T extends unknown>(
    key: string,
    storage: keyof typeof this.STORAGE,
  ): T | undefined {
    return this.STORAGE[storage].get(key) as T | undefined;
  }

  /**
   * @description Set the value of a key in a storage.
   * @param key - The key to set the value of.
   * @param value - The value to set.
   * @param storage - The storage to set the value in.
   */
  public set(key: string, value: unknown, storage: keyof typeof this.STORAGE) {
    this.STORAGE[storage].set(key, value);
  }

  /**
   * @description Delete the value of a key in a storage.
   * @param key - The key to delete the value of.
   * @param storage - The storage to delete the value from.
   */
  public delete(key: string, storage: keyof typeof this.STORAGE) {
    this.STORAGE[storage].delete(key);
  }

  /**
   * @description Clear the storage.
   * @param storage - The storage to clear.
   */
  public clear(storage: keyof typeof this.STORAGE) {
    this.STORAGE[storage].clear();
  }

  /**
   * @description Get the storages.
   * @returns The storages.
   */
  public storages(): (keyof typeof this.STORAGE)[] {
    return Object.keys(this.STORAGE) as (keyof typeof this.STORAGE)[];
  }
}
