import {Cache} from '../store/Cache';
import {Sling} from '../store/Sling';
import {Cqx} from './Cqx';
import {Locator} from './Locator';
import {ServiceProxy} from './ServiceProxy';

/**
 * A container for sharing global services and other objects like the cache.
 * Also provides access to the Java API.
 */
export class Container {
  public readonly cache: Cache;
  public readonly sling: Sling;

  private readonly cqx: Cqx | undefined;

  public constructor(cache: Cache, sling: Sling, cqx?: Cqx) {
    this.cache = cache;
    this.sling = sling;
    this.cqx = cqx;
  }

  /**
   * @param name Fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getOsgiService(name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('Cannot find OSGi service: ' + name);
      }

      return this.cqx.getOsgiService(name);
    });
  }

  /**
   * Get a sling model adapted from request
   * @param name fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getRequestModel(path: string, name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('Cannot find request model: ' + name);
      }

      return this.cqx.getRequestModel(path, name);
    });
  }

  /**
   * Get a sling model adapted from current resource
   * @param name fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getResourceModel(path: string, name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('Cannot find resource model: ' + name);
      }

      return this.cqx.getResourceModel(path, name);
    });
  }

  private getServiceProxy(args: IArguments, locator: Locator): ServiceProxy {
    return new ServiceProxy(this.cache, locator, this.createKey(args));
  }

  private createKey(params: IArguments): string {
    let key = '';

    for (let i = 0; i < params.length; i++) {
      if (i > 0) {
        key += '_';
      }
      key += params[i];
    }

    return key;
  }
}
