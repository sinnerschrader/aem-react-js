import {ResourceComponent} from '../component/ResourceComponent';
import {Cache} from '../store/Cache';
import {
  AbstractSling,
  EditDialogData,
  SlingResourceOptions
} from '../store/Sling';

export class MockSling extends AbstractSling {
  private cache: Cache;
  private data: EditDialogData;

  public constructor(cache: Cache, data?: EditDialogData) {
    super();

    this.cache = cache;
    this.data = data;
  }

  public subscribe(
    listener: ResourceComponent<any, any, any>,
    path: string,
    options?: SlingResourceOptions
  ): void {
    const resource: any = this.cache.get(path, options ? options.depth : null);

    if (resource) {
      listener.changedResource(path, resource);
    }
  }

  public renderDialogScript(): EditDialogData {
    if (this.data) {
      return this.data;
    }

    return {element: 'div', attributes: {className: 'dialog'}};
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
