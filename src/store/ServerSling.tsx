import {RootComponentRegistry} from '../RootComponentRegistry';
import {ComponentData, ResourceRef} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {
  AbstractSling,
  EditDialogData,
  IncludeOptions,
  LoadComponentCallback,
  LoadComponentOptions
} from './Sling';
import {JavaApiFactory} from './javaApiFactory';

export interface ContainerExporter {
  exportedItems?: {[key: string]: ContainerExporter};
  exportedItemsOrder?: string[];
  exportedType: string;
}

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
  getModel(resourceType: string, selectors: string): any;
  renderDialogScript(path: string, resourceType: string): string;
  getPagePath(): string;
}

export class ServerSling extends AbstractSling {
  private readonly sling: JavaSling;
  private readonly cache: Cache;
  private readonly registry: RootComponentRegistry;
  private readonly apiFactory: JavaApiFactory;

  public constructor(options: {
    cache: Cache;
    javaSling: JavaSling;
    registry: RootComponentRegistry;
    apiFactory: JavaApiFactory;
  }) {
    super();

    this.cache = options.cache;
    this.sling = options.javaSling;
    this.registry = options.registry;
    this.apiFactory = options.apiFactory;
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
    options: LoadComponentOptions = {}
  ): ComponentData {
    const data = this.getTransform(ref, !!options.skipData);

    if (!data) {
      return null;
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

  private getTransform(ref: ResourceRef, cache: boolean): ComponentData {
    const dialog = this.getDialog(ref.path, ref.type);
    const transform = this.registry.getTransform(ref.type, ref.selectors);
    if (transform) {
      const transformData = transform(this.apiFactory(ref.path, ref.selectors));

      const cdata = {
        dialog,
        id: ref,
        transformData
      };
      if (cache) {
        this.cache.putComponentData(cdata);
      }

      return cdata;
    }
    const data: ContainerExporter = JSON.parse(
      // todo remove join
      // may or may not return children
      this.sling.getModel(ref.path, ref.selectors.join('.'))
    );
    if (!data) {
      return null;
    }

    const children = this.tranformsModelToComponentData(
      data,
      ref.path,
      ref.selectors,
      cache
    );
    const child = {
      children,
      childrenOrder: data.exportedItemsOrder,
      dialog,
      id: ref,
      transformData: data
    };
    if (cache) {
      this.cache.putComponentData(child);
    }

    return child;
  }

  private tranformsModelToComponentData(
    exporter: ContainerExporter,
    path: string,
    selectors: string[],
    cache: boolean
  ): {[key: string]: ComponentData} {
    const children: {[key: string]: ComponentData} = {};
    if (exporter.exportedItems) {
      exporter.exportedItemsOrder.forEach((key: string) => {
        const subPath = `${path}/${key}`;
        const childDialog = this.getDialog(path, selectors.join('.'));
        const item = exporter.exportedItems[key];

        const child = {
          children: this.tranformsModelToComponentData(
            item,
            subPath,
            selectors,
            cache
          ),
          dialog: childDialog,
          id: {
            path: subPath,
            selectors: [] as string[],
            type: item.exportedType
          },
          transformData: item
        };
        this.cache.putComponentData(child);

        children[key] = child;
      });
    }

    return children;
  }
}
