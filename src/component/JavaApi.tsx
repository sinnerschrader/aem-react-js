import {ServiceProxy} from '../di/ServiceProxy';

/**
 * a component instance specific java api
 */
export interface JavaApi {
  getOsgiService(name: string): ServiceProxy;

  getResourceModel(name: string): ServiceProxy;

  getRequestModel(name: string): ServiceProxy;
}
