import {expect} from 'chai';
import {ResourceRef} from '../../component/ResourceComponent';
import {MockComponentDataFetcher} from '../MockComponentDataFetcher';

describe('MockComponentDataFetcher', () => {
  it('should return given resource on fetch()', async () => {
    const transformData = {text: 'Hello'};
    const ref: ResourceRef = {
      path: '/test',
      selectors: [],
      type: 'test'
    };
    const fetcher = new MockComponentDataFetcher({
      dialog: {element: 'div'},
      id: ref,
      transformData
    });
    const result = await fetcher.fetch(ref);
    expect(result.transformData).to.be.equal(transformData);
  });
});
