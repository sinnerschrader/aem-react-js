import {JsProxy} from './JsProxy';
import {ServiceProxy} from './ServiceProxy';

export class ServiceProxyImpl implements ServiceProxy {
  private readonly jsProxy: JsProxy;

  public constructor(jsProxy: JsProxy) {
    this.jsProxy = jsProxy;
  }

  public invoke<T>(method: string, ...args: any[]): T {
    return JSON.parse(this.jsProxy.invoke(method, args));
  }

  public get<T>(name: string): T {
    return JSON.parse(this.jsProxy.get(name));
  }

  public getObject<T extends object>(): T {
    return JSON.parse(this.jsProxy.getObject());
  }
}
