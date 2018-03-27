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

  it('should return direct match', () => {
    const cache = new Cache();

    cache.put(ref, {test: 'Test'});

    const result = cache.get('/content');

    expect(result).to.exist;
  });

  it('should return sub match', () => {
    const cache = new Cache();
    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/content/test');

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should return empty sub match', () => {
    const cache = new Cache();
    cache.put(ref, {test: null});

    const result = cache.get('/content/test');

    expect(result).to.exist;
    expect(result).to.deep.equal({});
  });

  xit('should not return insufficiently deep match', () => {
    const cache = new Cache();

    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/content/test');

    expect(result).to.not.exist;
  });

  xit('should return inifinity deep match', () => {
    const cache = new Cache();

    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/content/test/text');

    expect(result).to.exist;
  });

  it('should return sufficiently deep match', () => {
    const cache = new Cache();

    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/content', 2);

    expect(result).to.exist;
  });

  it('should return sufficiently deep sub match', () => {
    const cache = new Cache();

    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/content/test', 1);

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should return null if no match', () => {
    const cache = new Cache();

    cache.put(ref, {test: {text: 'Hallo'}});

    const result = cache.get('/something', 1);

    expect(result).to.not.exist;
  });

  it('should return match of depth 1', () => {
    const cache = new Cache();

    cache.put(ref, {level1: {level2: 'Hallo'}});

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

    cache.put(ref, {x: 1});

    expect(cache.get('incl').x).to.equals(1);

    cache.putIncluded('incl', [], 'value');

    expect(cache.getIncluded('incl', [])).to.equals('value');

    cache.putDialogData('script', {element: 'test'});

    expect(cache.getDialogData('script')).to.deep.equal({element: 'test'});

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');

    cache.clear();

    expect(cache.get('incl')).to.be.null;
    expect(cache.getIncluded('incl', [])).to.be.undefined;
    expect(cache.getDialogData('script')).to.be.undefined;
    expect(cache.getServiceCall('call')).to.be.undefined;
  });

  it('should write and read entries', () => {
    const cache = new Cache();

    cache.putIncluded('incl', [], 'value');

    expect(cache.getIncluded('incl', [])).to.equals('value');

    cache.putDialogData('script', {element: 'test'});

    expect(cache.getDialogData('script')).to.deep.equal({element: 'test'});

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');
  });

  it('should wrap service call', () => {
    const cache = new Cache();
    const result = cache.wrapServiceCall('x', () => 'done');

    expect(result).to.equals('done');
  });
});
