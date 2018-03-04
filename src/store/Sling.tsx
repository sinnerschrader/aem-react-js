import {ResourceUtils} from '../ResourceUtils';
import {ComponentData, ResourceComponent} from '../component/ResourceComponent';

export interface SlingResourceOptions {
  readonly depth?: number;
  readonly skipData?: boolean;
  readonly selectors: string[];
}

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
   * @param listener the component that needs the resource
   * @param path resource path
   * @param options options like level depth of resource tree
   */
  loadComponent(
    listener: ResourceComponent<any, any>,
    path: string,
    options?: SlingResourceOptions
  ): Promise<ComponentData>;

  /**
   * get data to render aem component dialog
   * of the given resourceType at the given resource path.
   * @param path
   * @param resourceType
   */
  getDialog(path: string, resourceType: string): EditDialogData;

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
    listener: ResourceComponent<any, any>,
    path: string,
    options?: SlingResourceOptions
  ): Promise<ComponentData>;

  public abstract getDialog(path: string, resourceType: string): EditDialogData;

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
