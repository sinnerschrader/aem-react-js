// globals
import {EditDialogData} from "./store/Sling";
declare var i18n: any;

interface Window {
  React: any;
  ReactComponents: {
    [name: string]: any
  };
  AemGlobal: any;
  initReactComponents(): void;
}


export interface ResourceResolver {
  getResource(path: string, depth: number): any;
}

export interface JavaSling {
  includeResource(path: string, resourceType: string): string;
  currentResource(depth: number): any;
  getResource(path: string, depth: number): any;
  renderDialogScript(path: string, resourceType: string): string;
  getPagePath(): string;
}

export interface Promise {
  then(success: (result: any) => void, error: (e: any) => void): Promise;
}

export interface JsProxy {
  invoke(name: string, args: any[]): string;
}

export interface Cq {
  sling: JavaSling;
  getOsgiService(name: string): JsProxy;
  getResourceModel(name: string): JsProxy;
  getRequestModel(name: string): JsProxy;
}
declare var Cqx: Cq;
