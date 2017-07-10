import {Cache} from '../store/Cache';
import {JavaSling} from '../store/ServerSling';
import {JsProxy, ServiceProxy} from './ServiceProxy';

export interface Cq {
  sling: JavaSling;
  getOsgiService(name: string): JsProxy;
  getResourceModel(path: string, name: string): JsProxy;
  getRequestModel(path: string, name: string): JsProxy;
}

declare var Cqx: Cq;

/**
 * a container for sharing global services and other objects like the cache.
 * Also provides access to the Java API.
 *
 * TODO add cache as a separate field instead of another object in the
 * container.
 */
export class Container {
  private services: {[name: string]: object};
  private cqx: Cq;

  public constructor(cqx: Cq) {
    this.services = {};

    this.cqx = !cqx ? Cqx : cqx;
  }

  /**
   * add an object to the container
   * @param name
   * @param service
   */
  public register(name: string, service: object): void {
    this.services[name] = service;
  }

  /**
   * retrieve object from container
   * @param name
   * @returns {any}
   */
  public get(name: string): object {
    return this.services[name];
  }

  /**
   *
   * @param name fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getOsgiService(name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('cannot find osgi service ' + name);
      }

      return this.cqx.getOsgiService(name);
    });
  }

  /**
   * get a sling mdoel adapted from request
   * @param name fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getRequestModel(path: string, name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('cannot find request model ' + name);
      }

      return this.cqx.getRequestModel(path, name);
    });
  }

  /**
   * get a sling mdoel adapted from current resource
   * @param name fully qualified java class name
   * @returns {ServiceProxy}
   */
  public getResourceModel(path: string, name: string): ServiceProxy {
    return this.getServiceProxy(arguments, () => {
      if (!this.cqx) {
        throw new Error('cannot find resource model ' + name);
      }

      return this.cqx.getResourceModel(path, name);
    });
  }

  private getServiceProxy(
    args: IArguments,
    getter: () => JsProxy
  ): ServiceProxy {
    return new ServiceProxy(
      this.get('cache') as Cache,
      getter,
      this.createKey(args)
    );
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
