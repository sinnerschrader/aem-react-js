import {expect} from 'chai';
import {ResourceRef} from '../../component/ResourceComponent';
import {BaseComponentDataFetcher, FetchWindow} from '../ComponentDataFetcher';

describe('BaseComponentDataFetcher', () => {
  it('should expand url correctly', async () => {
    let actualUrl: string = null;
    const ref: ResourceRef = {
      path: '/test',
      selectors: [],
      type: ''
    };
    const fetchWindow: FetchWindow = {
      fetch: (url: string, options: any): any => {
        actualUrl = url;
      }
    };
    const fetcher: BaseComponentDataFetcher = new BaseComponentDataFetcher(
      '/url',
      fetchWindow
    );
    await fetcher.fetch(ref);
    expect(actualUrl).to.equal('/url/test.json.html');
  });
});
