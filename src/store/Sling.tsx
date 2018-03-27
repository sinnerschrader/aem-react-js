import {ResourceUtils} from '../ResourceUtils';
import {ComponentData, ResourceRef} from '../component/ResourceComponent';

export interface SlingResourceOptions {
  readonly depth?: number;
  readonly skipData?: boolean;
  readonly selectors: string[];
}

export interface LoadComponentOptions {
  readonly skipData?: boolean;
  errorCallback?(error: Error): void;
}

export type LoadComponentCallback = (data: ComponentData | {}) => void;

export interface EditDialogData {
  readonly element: string;
  readonly html?: string;
  readonly attributes?: {[name: string]: any};
  readonly child?: EditDialogData;
}

export interface IncludeOptions {
  readonly addSelectors?: string[];
  readonly selectors?: string[];
  readonly decorationTagName?: string;
}

const calculateSelectors = (
  selectors: string[],
  options?: IncludeOptions
): string[] => {
  if (options !== undefined) {
    if (options.addSelectors !== undefined) {
      return selectors.concat(options.addSelectors);
    }
    if (options.selectors !== undefined) {
      return options.selectors;
    }
  }

  return selectors || [];
};

export {calculateSelectors};

/**
 * interface that provides standard aem features for the resource components.
 */
export interface Sling {
  /**
   * Request a resource.
   * @param resourceRef resource reference
   * @param callback callback function
   * @param options options like level depth of resource tree
   */
  loadComponent(
    resourceRef: ResourceRef,
    callback: LoadComponentCallback,
    options?: LoadComponentOptions
  ): void;

  /**
   * Include a component's html.
   * @param path
   * @param resourceType
   * @param selectors
   * @param options
   */
  includeResource(
    path: string,
    selectors: string[],
    resourceType: string,
    options: IncludeOptions
  ): string;

  getRequestPath(): string;
  getContainingPagePath(): string;
}

export abstract class AbstractSling implements Sling {
  public abstract loadComponent(
    ref: ResourceRef,
    callback: LoadComponentCallback,
    options?: LoadComponentOptions
  ): void;

  public abstract includeResource(
    path: string,
    selectors: string[],
    resourceType: string,
    options: IncludeOptions
  ): string;

  public abstract getRequestPath(): string;

  public getContainingPagePath(): string {
    return ResourceUtils.getContainingPagePath(this.getRequestPath());
  }
}
