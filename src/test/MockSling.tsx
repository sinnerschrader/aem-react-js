import {ResourceComponent} from '../component/ResourceComponent';
import {Cache} from '../store/Cache';
import {EditDialogData, SlingResourceOptions} from '../store/Sling';

export class MockSling {
  private cache: Cache;
  private data: EditDialogData;

  public constructor(cache?: Cache, data?: EditDialogData) {
    this.cache = cache || new Cache();
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

  public includeResource(path: string, resourceType: string): string {
    return `<include resourcetype='${resourceType}' path='${path}'></include>`;
  }
}
