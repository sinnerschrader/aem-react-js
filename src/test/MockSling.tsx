import {ResourceRef} from '../component/ResourceComponent';
import {Cache} from '../store/Cache';
import {
  AbstractSling,
  LoadComponentCallback,
  LoadComponentOptions
} from '../store/Sling';

export class MockSling extends AbstractSling {
  private cache: Cache;

  public constructor(cache: Cache) {
    super();

    this.cache = cache;
  }

  public loadComponent(
    ref: ResourceRef,
    callback: LoadComponentCallback,
    options?: LoadComponentOptions
  ): void {
    callback(this.cache.getComponentData(ref.path, ref.selectors));
  }

  public includeResource(
    path: string,
    selectors: string[],
    resourceType: string
  ): string {
    return `<include resourcetype='${resourceType}' selectors='${selectors.join(
      '.'
    )}'path='${path}'></include>`;
  }

  public getRequestPath(): string {
    return 'mockRequestPath';
  }
}
