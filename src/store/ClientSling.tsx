import {CqModel} from '@adobe/cq-react-editable-components';
import {ComponentData, ResourceRef} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {ComponentDataFetcher} from './ComponentDataFetcher';
import {
  AbstractSling,
  IncludeOptions,
  LoadComponentCallback,
  LoadComponentOptions
} from './Sling';

const transformChildren = (
  dataPath: string,
  items: {[key: string]: CqModel}
): {[key: string]: ComponentData} => {
  const datas: {[key: string]: ComponentData} = {};

  if (items) {
    Object.keys(items).forEach((key: string) => {
      const childModel = items[key];
      const data: ComponentData = {
        children: transformChildren(dataPath, childModel[':items']),
        childrenOrder: childModel[':itemsOrder'],
        dialog: {element: 'div'},
        id: {
          path: `${dataPath}/${key}`,
          type: childModel[':type'],
          selectors: []
        },
        transformData: childModel
      };

      datas[key] = data;
    });
  }

  return datas;
};

const transformModel = (dataPath: string, model: CqModel): ComponentData => {
  let items: {[key: string]: ComponentData} = {};

  if (model[':items']) {
    items = transformChildren(dataPath, model[':items']);
  }

  return {
    children: items,
    childrenOrder: model[':itemsOrder'],
    dialog: {element: 'div'},
    id: {
      path: dataPath,
      type: model[':type'],
      selectors: []
    },
    transformData: model
  };
};

/**
 * ClientSling gets all data from the cache.
 * If the data is not available then it will get the part of the cache which
 * corresponds to the given component from the server.
 */
export class ClientSling extends AbstractSling {
  private readonly cache: Cache;
  private readonly fetcher: ComponentDataFetcher;

  public constructor(cache: Cache, fetcher: ComponentDataFetcher) {
    super();
    this.cache = cache;
    this.fetcher = fetcher;
  }

  public loadComponent(
    ref: ResourceRef,
    callback: LoadComponentCallback,
    options?: LoadComponentOptions
  ): void {
    if (options && options.skipData) {
      callback({});

      return;
    }
    const componentData = this.cache.getComponentData(ref.path, ref.selectors);

    if (!componentData) {
      this.fetcher
        .fetch(ref)
        .then((json: CqModel): void => {
          const data = transformModel(ref.path, json);
          this.cache.putComponentData(data);
          callback(data);
        })
        .catch(e => {
          console.error(e);
        });

      return;
    }

    callback(componentData);
  }

  public includeResource(
    path: string,
    selectors: string[],
    resourceType: string,
    options: IncludeOptions
  ): string {
    // Currently cannot be loaded from server alone.
    return this.cache.getIncluded(path, selectors, options);
  }

  public getRequestPath(): string {
    return window.location.pathname;
  }
}
