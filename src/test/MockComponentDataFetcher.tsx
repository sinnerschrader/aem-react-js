import {CqModel} from '@adobe/cq-react-editable-components';
import {ResourceRef} from '../component/ResourceComponent';
import {ComponentDataFetcher} from '../store/ComponentDataFetcher';

export class MockComponentDataFetcher implements ComponentDataFetcher {
  private readonly json: CqModel;

  public constructor(model: CqModel) {
    this.json = model;
  }

  public async fetch(
    ref: ResourceRef = {path: '/', selectors: [], type: 'test'}
  ): Promise<CqModel> {
    if (ref.type === this.json[':type']) {
      return this.json;
    }

    return undefined;
  }
}
