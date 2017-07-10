import {Cache} from '../store/Cache';

export interface JsProxy {
  invoke(name: string, args: any[]): string;
  get(name: string): string;
  getObject(): string;
}

/**
 * this class is a proxy that wraps java object of type JsProxy. The  proxy
 * put all calls into the cache.
 */
export class ServiceProxy {
  private cache: Cache;
  private name: string;
  private locator: () => any;

  public constructor(cache: Cache, locator: () => JsProxy, name: string) {
    this.cache = cache;
    this.locator = locator;
    this.name = name;
  }

  /**
   * call a method on the proxied object. returns the cached value if available.
   *
   * @param name of java method to call
   * @param args to java method
   * @returns {any}
   */
  public invoke(method: string, ...args: any[]): any {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      method,
      args
    );

    return this.cache.wrapServiceCall(cacheKey, (): any => {
      const service: JsProxy = this.locator();
      const result = service.invoke(method, args);

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }

  public get(name: string): any {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      name,
      []
    );

    return this.cache.wrapServiceCall(cacheKey, (): any => {
      const service: JsProxy = this.locator();
      const result = service.get(name);

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }

  public getObject(): any {
    const cacheKey: string = this.cache.generateServiceCacheKey(
      this.name,
      '',
      []
    );

    return this.cache.wrapServiceCall(cacheKey, (): any => {
      const service: JsProxy = this.locator();
      const result = service.getObject();

      if (result == null) {
        return null;
      }

      return JSON.parse(result);
    });
  }
}
