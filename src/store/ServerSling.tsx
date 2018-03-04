import {ComponentData, ResourceComponent} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {
  AbstractSling,
  EditDialogData,
  IncludeOptions,
  SlingResourceOptions
} from './Sling';

export interface JavaSling {
  includeResource(
    path: string,
    resourceType: string,
    addSelectors: string,
    selectors: string,
    decorationTagName: string
  ): string;
  currentResource(depth: number): any;
  getResource(path: string, depth: number): any;
  renderDialogScript(path: string, resourceType: string): string;
  getPagePath(): string;
}

export class ServerSling extends AbstractSling {
  private readonly sling: JavaSling;
  private readonly cache: Cache;

  public constructor(cache: Cache, sling: JavaSling) {
    super();

    this.cache = cache;
    this.sling = sling;
  }

  public async loadComponent(
    listener: ResourceComponent<any, any>,
    path: string,
    options: SlingResourceOptions = {selectors: []}
  ): Promise<ComponentData> {
    const depth: number =
      typeof options.depth !== 'number' ? -1 : options.depth;

    const skipData = !!options.skipData;

    let resource: any = this.cache.get(path, depth);

    if (!resource) {
      resource = JSON.parse(this.sling.getResource(path, depth));

      if (!resource) {
        resource = {};
      }

      if (!skipData) {
        this.cache.put(path, resource, depth);
      }
    }
    listener.changedResource(path, resource);

    return {
      dialog: null,
      transform: {
        children: [],
        props: {}
      }
    };
  }

  public getDialog(path: string, resourceType: string): EditDialogData {
    const script: string = this.sling.renderDialogScript(path, resourceType);

    let dialog: EditDialogData = null;

    if (script) {
      dialog = JSON.parse(script);
    }

    this.cache.putScript(path, dialog);

    return dialog;
  }

  public includeResource(
    path: string,
    selectors: string[],
    resourceType: string,
    options: IncludeOptions
  ): string {
    // TODO we are not passing selectors modified within react tree
    const included: string = this.sling.includeResource(
      path,
      resourceType,
      options && !!options.addSelectors ? options.addSelectors.join(',') : null,
      options && !!options.selectors ? options.selectors.join(',') : null,
      options && typeof options.decorationTagName === 'string'
        ? options.decorationTagName
        : null
    );

    this.cache.putIncluded(path, selectors, included, options || {});

    return included;
  }

  public getRequestPath(): string {
    return this.sling.getPagePath();
  }
}
