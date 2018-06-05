/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import {ResourceRef} from '../../component/ResourceComponent';
import {Cache} from '../Cache';

describe('Cache', () => {
  let ref: ResourceRef;
  beforeEach(() => {
    ref = {
      path: '/content',
      selectors: [],
      type: 'testType'
    };
  });

  it('should create a cache key that resembles the method invocation', () => {
    const cache = new Cache();

    function test(x: string, y: string): string {
      return cache.generateServiceCacheKey('javaClass', 'make', [x, y]);
    }

    const key: string = test('do', 'it');

    expect(key).to.equals('javaClass.make(do,it)');
  });

  it('should create a cache key that resembles the method invocation', () => {
    const cache = new Cache();

    function test(x: string, y: string): string {
      return cache.generateServiceCacheKey('javaClass', 'make', [x, y]);
    }

    const key: string = test('do', 'it');

    expect(key).to.equals('javaClass.make(do,it)');
  });

  it('should merge caches', () => {
    const cache = new Cache();

    cache.putIncluded('new:', [], 'oldValue');
    cache.putIncluded('existing', [], 'existingValue');

    cache.mergeCache({included: {new: 'newValue'}});

    expect(cache.getIncluded('new', [])).to.equals('newValue');
    expect(cache.getIncluded('existing', [])).to.equals('existingValue');
  });

  it('should merge null caches', () => {
    const cache = new Cache();

    cache.mergeCache(null);
    // expect no error
  });

  it('should clear cache', () => {
    const cache = new Cache();
    ref = {
      path: '/content',
      selectors: [],
      type: 'testType'
    };

    cache.putIncluded('incl', [], 'value');

    expect(cache.getIncluded('incl', [])).to.equals('value');

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');

    cache.clear();

    expect(cache.getIncluded('incl', [])).to.be.undefined;
    expect(cache.getServiceCall('call')).to.be.undefined;
  });

  it('should write and read entries', () => {
    const cache = new Cache();

    cache.putIncluded('incl', [], 'value');

    expect(cache.getIncluded('incl', [])).to.equals('value');

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');
  });

  it('should wrap service call', () => {
    const cache = new Cache();
    const result = cache.wrapServiceCall('x', () => 'done');

    expect(result).to.equals('done');
  });
});
