import {ComponentData, ResourceRef} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {
  AbstractSling,
  EditDialogData,
  IncludeOptions,
  LoadComponentCallback,
  LoadComponentOptions
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

  public loadComponent(
    ref: ResourceRef,
    callback: LoadComponentCallback,
    options?: LoadComponentOptions
  ): void {
    const componentData = this.cache.getComponentData(ref.path, ref.selectors);

    if (!componentData) {
      callback(this.getComponentData(ref, options));

      return;
    }

    callback(componentData);
  }

  public getComponentData(
    ref: ResourceRef,
    options?: LoadComponentOptions
  ): ComponentData {
    const {path, type} = ref;
    const data: ComponentData = {
      children: [],
      dialog: this.getDialog(path, type),
      id: ref,
      transformData: this.getTransform(path)
    };

    const skipData = !!options.skipData;
    if (!skipData) {
      this.cache.putComponentData(data);
    }

    return data;
  }

  public getDialog(path: string, resourceType: string): EditDialogData {
    const script: string = this.sling.renderDialogScript(path, resourceType);

    let dialog: EditDialogData = null;

    if (script) {
      dialog = JSON.parse(script);
    }

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

  private getTransform(path: string): any {
    const transform = JSON.parse(this.sling.getResource(path, 0));
    if (!transform) {
      return {};
    }

    return transform;
  }
}
