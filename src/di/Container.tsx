import {JavaApi} from '../component/JavaApi';
import {TextPool} from '../component/text/TextPool';
import {Cache} from '../store/Cache';
import {Sling} from '../store/Sling';
import {JavaApiFactory, javaApiFactoryFactory} from '../store/javaApiFactory';
import {JavaXssUtils} from '../xss/JavaXssUtils';
import {JsXssUtils} from '../xss/JsXssUtils';
import {XssUtils} from '../xss/XssUtils';
import {CachedServiceProxy} from './CachedServiceProxy';
import {Cqx} from './Cqx';
import {Locator} from './Locator';
import {ServiceProxy} from './ServiceProxy';

interface Services {
  [name: string]: object | undefined;
}

/**
 * A container for sharing global services and other objects like the cache.
 * Also provides access to the Java API.
 */
export class Container {
  public readonly cache: Cache;
  public readonly sling: Sling;
  public javaApiFactory: JavaApiFactory;
  public textPool: TextPool;
  public xssUtils: XssUtils;

  public readonly cqx: Cqx | undefined;
  private readonly services: Services;

  public constructor(cache: Cache, sling: Sling, cqx?: Cqx) {
    this.cache = cache;
    this.sling = sling;
    this.cqx = cqx;
    this.services = Object.create(null);
    this.javaApiFactory = javaApiFactoryFactory(this);
    this.xssUtils =
      !!cqx && cqx.getXssApi
        ? new JavaXssUtils(cqx.getXssApi())
        : new JsXssUtils();
    this.textPool = new TextPool();
  }

  public setService(name: string, service: object): this {
    this.services[name] = service;

    return this;
  }

  public getService<T extends object = object>(name: string): T | undefined {
    return this.services[name] as T;
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
  public getRequestModel(
    path: string,
    selectors: string[],
    name: string
  ): ServiceProxy {
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
  public getResourceModel(
    path: string,
    selectors: string[],
    name: string
  ): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('Cannot find resource model: ' + name);
      }

      return this.cqx.getResourceModel(path, name);
    });
  }

  public createJavaApi(path: string, selectors: string[]): JavaApi {
    return this.javaApiFactory(path, selectors);
  }

  private getServiceProxy(args: IArguments, locator: Locator): ServiceProxy {
    return new CachedServiceProxy(this.cache, locator, this.createKey(args));
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
