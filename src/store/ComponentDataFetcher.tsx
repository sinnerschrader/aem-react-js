/// <reference path="../../typings/adobe.d.ts" />
import {CqModel} from '@adobe/cq-react-editable-components';
import {ResourceRef} from '../component/ResourceComponent';

export interface FetchWindow {
  fetch(url: string, options: any): Promise<any>;
}

export interface ComponentDataFetcher {
  fetch(ref: ResourceRef): Promise<CqModel>;
}

export abstract class AbstractComponentDataFetcher
  implements ComponentDataFetcher {
  protected readonly delayMs?: number;

  public constructor(delayMs?: number) {
    this.delayMs = delayMs;
  }

  public async fetch(ref: ResourceRef): Promise<CqModel> {
    if (this.delayMs) {
      return this.delay(this.exec.bind(this, ref), this.delayMs);
    }

    return this.exec(ref);
  }

  protected abstract async exec(ref: ResourceRef): Promise<CqModel>;

  private async delay(
    fun: () => Promise<any>,
    delay: number
  ): Promise<CqModel> {
    return new Promise<CqModel>((resolve, reject) => {
      window.setTimeout(() => {
        fun().then(resolve).catch(reject);
      }, delay);
    });
  }
}

export class BaseComponentDataFetcher extends AbstractComponentDataFetcher {
  private readonly fetchWindow: FetchWindow;
  private readonly origin: string;

  public constructor(
    origin: string,
    fetchWindow?: FetchWindow,
    delayMs?: number
  ) {
    super(delayMs);
    this.origin = origin;
    this.fetchWindow = !fetchWindow
      ? (window as any) as FetchWindow
      : fetchWindow;
  }

  protected async exec(ref: ResourceRef): Promise<CqModel> {
    const response = await this.fetchWindow.fetch(
      getUrl(this.origin, ref.path),
      {credentials: 'same-origin'}
    );
    if (!response || response.status === 404) {
      return {
        ':type': ref.type,
        ':items': {},
        ':itemsOrder': []
      };
    } else {
      /* istanbul ignore if  */
      return response.json();
    }
  }
}

const serverRenderingParam = 'serverRendering=disabled';

function getUrl(origin: string, path: string): string {
  // TODO what about depth as string??
  let url = `${origin}${path}.model.json`;
  // + depthAsString + ".json";
  if (isServerRendering()) {
    url += `?${serverRenderingParam}`;
  }

  return url;
}

function isServerRendering(): boolean {
  return window.location.search.indexOf(serverRenderingParam) >= 0;
}
