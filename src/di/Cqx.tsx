import {JavaSling} from '../store/ServerSling';
import {JsProxy} from './JsProxy';

export interface Cqx {
  readonly sling: JavaSling;

  getOsgiService(name: string): JsProxy;
  getResourceModel(path: string, name: string): JsProxy;
  getRequestModel(path: string, name: string): JsProxy;
}
