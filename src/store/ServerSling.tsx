import {ResourceComponent} from '../component/ResourceComponent';
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

  public subscribe(
    listener: ResourceComponent<any, any, any>,
    path: string,
    options?: SlingResourceOptions
  ): void {
    const depth: number =
      !options || typeof options.depth !== 'number' ? -1 : options.depth;

    let resource: any = this.cache.get(path, depth);

    if (!resource) {
      console.log(' ServerSling has no resource' + path);

      resource = JSON.parse(this.sling.getResource(path, depth));

      if (!resource) {
        resource = {};
      }

      this.cache.put(path, resource, depth);
    }

    listener.changedResource(path, resource);
  }

  public renderDialogScript(
    path: string,
    resourceType: string
  ): EditDialogData {
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
    resourceType: string,
    options: IncludeOptions
  ): string {
    const included: string = this.sling.includeResource(
      path,
      resourceType,
      options && !!options.addSelectors ? options.addSelectors.join(',') : null,
      options && !!options.selectors ? options.selectors.join(',') : null,
      options && typeof options.decorationTagName === 'string'
        ? options.decorationTagName
        : null
    );

    this.cache.putIncluded(path, included, options || {});

    return included;
  }

  public getRequestPath(): string {
    return this.sling.getPagePath();
  }
}
