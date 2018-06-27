import {ComponentData, ResourceRef} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {ComponentDataFetcher} from './ComponentDataFetcher';
import {
  AbstractSling,
  IncludeOptions,
  LoadComponentCallback,
  LoadComponentOptions
} from './Sling';

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
        .then((json: ComponentData): void => {
          this.cache.putComponentData(json);
          callback(json);
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
