import {ComponentData, ResourceRef} from '../component/ResourceComponent';
import {ComponentDataFetcher} from '../store/ComponentDataFetcher';

export class MockComponentDataFetcher implements ComponentDataFetcher {
  private json: ComponentData;

  public constructor(componentData: ComponentData) {
    this.json = componentData;
  }

  public async fetch(
    ref: ResourceRef = {path: '/', selectors: [], type: 'test'}
  ): Promise<ComponentData> {
    return this.json;
  }
}
