import {ApiOptions, JavaApi} from '../component/JavaApi';
import {Container} from '../di/Container';
import {JsProxy} from '../di/JsProxy';
import {ServiceProxy} from '../di/ServiceProxy';
import {ServiceProxyImpl} from '../di/ServiceProxyImpl';
import {XssApi} from '../xss/XssApi';

export class JavaApiImpl implements JavaApi {
  private readonly container: Container;
  private readonly path: string;

  public constructor(path: string, container: Container) {
    this.path = path;
    this.container = container;
  }

  public getOsgiService(name: string): ServiceProxy {
    return this.getServiceProxy(this.container.cqx.getOsgiService(name));
  }

  public getResourceModel(
    name: string,
    options: ApiOptions = {}
  ): ServiceProxy {
    return this.getServiceProxy(
      this.container.cqx.getResourceModel(options.path || this.path, name)
    );
  }

  public getRequestModel(name: string, options: ApiOptions = {}): ServiceProxy {
    return this.getServiceProxy(
      this.container.cqx.getRequestModel(options.path || this.path, name)
    );
  }

  public getPath(): string {
    return this.path;
  }

  public getXssApi(): XssApi {
    return this.container.cqx.getXssApi();
  }

  private getServiceProxy(jsProxy: JsProxy): ServiceProxy {
    return new ServiceProxyImpl(jsProxy);
  }
}

type JavaApiFactory = (path: string) => JavaApi;

const javaApiFactoryFactory = (container: Container) => (path: string) =>
  new JavaApiImpl(path, container);

export {javaApiFactoryFactory, JavaApiFactory};