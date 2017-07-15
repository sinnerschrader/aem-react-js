/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import {Cache} from '../Cache';

describe('Cache', () => {
  it('should return direct match', () => {
    const cache = new Cache();

    cache.put('/content', {test: 'Test'});

    const result = cache.get('/content');

    expect(result).to.exist;
  });

  it('should return sub match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}});

    const result = cache.get('/content/test');

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should return empty sub match', () => {
    const cache = new Cache();

    cache.put('/content', {test: null});

    const result = cache.get('/content/test');

    expect(result).to.exist;
    expect(result).to.deep.equal({});
  });

  it('should not return insufficiently deep match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 1);

    const result = cache.get('/content/test');

    expect(result).to.not.exist;
  });

  it('should return inifinity deep match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, -1);

    const result = cache.get('/content/test/text');

    expect(result).to.exist;
  });

  it('should return sufficiently deep match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}});

    const result = cache.get('/content', 2);

    expect(result).to.exist;
  });

  it('should return sufficiently deep sub match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 2);

    const result = cache.get('/content/test', 1);

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should return null if no match', () => {
    const cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 1);

    const result = cache.get('/something', 1);

    expect(result).to.not.exist;
  });

  it('should return match of depth 1', () => {
    const cache = new Cache();

    cache.put('/content', {level1: {level2: 'Hallo'}}, 1);

    const result = cache.get('/content/level1/level2', 0);

    expect(result).to.equals('Hallo');
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

    cache.putIncluded('new', 'oldValue');
    cache.putIncluded('existing', 'existingValue');

    cache.mergeCache({included: {new: 'newValue'}});

    expect(cache.getIncluded('new')).to.equals('newValue');
    expect(cache.getIncluded('existing')).to.equals('existingValue');
  });

  it('should merge null caches', () => {
    const cache = new Cache();

    cache.mergeCache(null);
    // expect no error
  });

  it('should clear cache', () => {
    const cache = new Cache();

    cache.put('incl', {x: 1});

    expect(cache.get('incl').x).to.equals(1);

    cache.putIncluded('incl', 'value');

    expect(cache.getIncluded('incl')).to.equals('value');

    cache.putScript('script', {element: 'test'});

    expect(cache.getScript('script')).to.deep.equal({element: 'test'});

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');

    cache.clear();

    expect(cache.get('incl')).to.be.null;
    expect(cache.getIncluded('incl')).to.be.undefined;
    expect(cache.getScript('script')).to.be.undefined;
    expect(cache.getServiceCall('call')).to.be.undefined;
  });

  it('should write and read entries', () => {
    const cache = new Cache();

    cache.putIncluded('incl', 'value');

    expect(cache.getIncluded('incl')).to.equals('value');

    cache.putScript('script', {element: 'test'});

    expect(cache.getScript('script')).to.deep.equal({element: 'test'});

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');
  });

  it('should wrap service call', () => {
    const cache = new Cache();
    const result = cache.wrapServiceCall('x', () => 'done');

    expect(result).to.equals('done');
  });
});
