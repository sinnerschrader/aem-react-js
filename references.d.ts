// globals
declare var i18n: any;

interface Window {
  React: any;
  ReactComponents: {
    [name: string]: any
  };
  initReactComponents(): void;
  AemGlobal: any;
}

declare module "invariant" {
  function invariant(): void;

  export = invariant;
}

declare module "warning" {
  function warning(): void;

  export = warning;
}

export interface ResourceResolver {
  getResource(path: string, depth: number): any;
}

export interface JavaSling {
  includeResource(path: string, resourceType: string): string;
  currentResource(depth: number): any;
  getResource(path: string, depth: number): any;

}

export interface Promise {
  then(success: (result: any) => void, error: (e: any) => void): Promise;
}

export interface Cq {
  objects: {
    currentResource: any;
    path: string;
  };
  sling: JavaSling;
}
declare var Cqx: Cq;
