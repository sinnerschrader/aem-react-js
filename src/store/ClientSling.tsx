import {ComponentData, ResourceComponent} from '../component/ResourceComponent';
import {Cache} from './Cache';
import {
  AbstractSling,
  EditDialogData,
  IncludeOptions,
  SlingResourceOptions
} from './Sling';

export interface FetchWindow {
  fetch(url: string, options: any): any;
}

/**
 * ClientSling gets all data from the cache.
 * If the data is not available then it will get the part of the cache which
 * corresponds to the given component from the server.
 */
export class ClientSling extends AbstractSling {
  private readonly cache: Cache;
  private readonly origin: string;
  private readonly fetchWindow: FetchWindow;
  private readonly delayInMillis: number;

  public constructor(
    cache: Cache,
    origin: string,
    fetchWindow?: FetchWindow,
    delayInMillis?: number
  ) {
    super();

    this.cache = cache;
    this.origin = origin;

    this.fetchWindow = !fetchWindow
      ? (window as any) as FetchWindow
      : fetchWindow;
  }

  public async loadComponent(
    listener: ResourceComponent<any, any>,
    path: string,
    options: SlingResourceOptions = {selectors: []}
  ): Promise<ComponentData> {
    if (options.skipData) {
      // todo throw away handle in wrapper
      listener.changedResource(path, {});

      return;
    }
    const depth =
      !options || typeof options.depth === 'undefined' || options.depth === null
        ? 0
        : options.depth;

    const resource: any = this.cache.get(path, depth);

    if (resource === null || typeof resource === 'undefined') {
      // const depthAsString = depth < 0 ? 'infinity' : options.depth + '';
      return this.fetchWindow
        .fetch(getUrl(this.origin, path), {credentials: 'same-origin'})
        .then((response: any) => {
          if (response.status === 404) {
            return {};
          } else {
            /* istanbul ignore if  */
            if (this.delayInMillis) {
              return new Promise<ComponentData>(resolve => {
                window.setTimeout(() => {
                  resolve(response.json());
                }, this.delayInMillis);
              });
            }

            // todo validate response?
            return response.json();
          }
        })
        .then((json: any): ComponentData => {
          this.cache.mergeCache(json);
          // todo throw away
          listener.changedResource(path, this.cache.get(path, depth));

          return {
            dialog: null,
            transform: {
              children: [],
              props: this.cache.get(path, depth)
            }
          };
        });
    }

    // todo throw away
    listener.changedResource(path, resource);

    return {
      dialog: null,
      transform: {
        children: [],
        props: resource
      }
    };
  }

  public getDialog(path: string, resourceType: string): EditDialogData {
    // TODO Can we get the script from the server too?.
    // This will probably not work as the returned script is
    // not executed as in the initial server rendering case.
    // For react router we need to do a reload anyways.
    return this.cache.getScript(path);
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

const serverRenderingParam = 'serverRendering=disabled';

function getUrl(origin: string, path: string): string {
  // TODO what about depth as string??
  let url = `${origin}${path}.json.html`;
  // + depthAsString + ".json";
  if (isServerRendering()) {
    url += `?${serverRenderingParam}`;
  }

  return url;
}

function isServerRendering(): boolean {
  return window.location.search.indexOf(serverRenderingParam) >= 0;
}
