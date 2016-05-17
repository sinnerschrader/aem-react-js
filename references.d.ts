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

export interface Promise {
  then(success: (result: any) => void, error: (e: any) => void): Promise;
}

export interface Sling {
  includeResource(path: string, resourceType: string): string;
  currentResource(depth: number): any;
}

export interface Cq {
  objects: {
    currentResource: any;
  };
  sling: Sling;
}
declare var Cqx: Cq;