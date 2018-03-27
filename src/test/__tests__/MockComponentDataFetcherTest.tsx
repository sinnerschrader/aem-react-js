import {expect} from 'chai';
import {MockComponentDataFetcher} from '../MockComponentDataFetcher';

describe('MockComponentDataFetcher', () => {
  it('should return given resource on fetch()', async () => {
    const resource = {text: 'Hello'};
    const fetcher = new MockComponentDataFetcher(resource);
    const result = await fetcher.fetch();
    expect(result).to.be.equal(resource);
  });
});
