/**
 * This class is a proxy that wraps a java object of type JsProxy.
 * The proxy put all calls into the cache.
 */
export interface ServiceProxy {
  /**
   * Call a method on the proxied object. returns the cached value if available.
   *
   * @param name of java method to call
   * @param args to java method
   */
  invoke<T>(method: string, ...args: any[]): T;

  get<T>(name: string): T;

  getObject<T extends object>(): T;
}
