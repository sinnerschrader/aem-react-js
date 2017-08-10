import {ServiceProxy} from '../di/ServiceProxy';

export interface ApiOptions {
  path?: string;
}

/**
 * a component instance specific java api
 */
export interface JavaApi {
  getOsgiService(name: string): ServiceProxy;

  getResourceModel(name: string): ServiceProxy;

  getRequestModel(name: string, options: ApiOptions): ServiceProxy;

  getPath(): string;
}
