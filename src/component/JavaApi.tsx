import {ServiceProxy} from '../di/ServiceProxy';
import {XssApi} from '../xss/XssApi';

export interface ApiOptions {
  path?: string;
}

/**
 * a component instance specific java api
 */
export interface JavaApi {
  getOsgiService(name: string): ServiceProxy;

  getResourceModel(name: string, options?: ApiOptions): ServiceProxy;

  getRequestModel(name: string, options?: ApiOptions): ServiceProxy;

  getPath(): string;

  getXssApi(): XssApi;
}
