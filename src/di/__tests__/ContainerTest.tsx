/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import {Container, Cq} from '../../di/Container';
import {ServiceProxy} from '../../di/ServiceProxy';
import {Cache} from '../../store/Cache';

describe('Container', () => {
  const methodResult = 'methodResult';
  const paramValue = 'param';
  const methodName = 'test';

  const proxy: any = {
    invoke(method: string, param: any[]): any {
      expect(param[0]).to.equal(paramValue);
      expect(method).to.equal(methodName);

      return JSON.stringify(methodResult);
    }
  };

  it('should return resourceModel', () => {
    const container: Container = new Container(
      ({
        getResourceModel: (path: string, resourceType: string) => {
          expect(path).to.equal('/test');
          expect(resourceType).to.equal('/components/test');

          return proxy;
        }
      } as any) as Cq
    );

    container.register('cache', new Cache());

    const service: ServiceProxy = container.getResourceModel(
      '/test',
      '/components/test'
    );

    expect((service as any).name).to.equal('/test_/components/test');

    const result: any = service.invoke(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return requestModel', () => {
    const container: Container = new Container(
      ({
        getRequestModel: (path: string, resourceType: string) => {
          expect(path).to.equal('/test');
          expect(resourceType).to.equal('/components/test');

          return proxy;
        }
      } as any) as Cq
    );

    container.register('cache', new Cache());

    const service: ServiceProxy = container.getRequestModel(
      '/test',
      '/components/test'
    );

    expect((service as any).name).to.equal('/test_/components/test');

    const result: any = service.invoke(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return osgi service', () => {
    const container: Container = new Container(
      ({
        getOsgiService: (className: string) => {
          expect(className).to.equal('java.pack.Service');

          return proxy;
        }
      } as any) as Cq
    );

    container.register('cache', new Cache());

    const service: ServiceProxy = container.getOsgiService('java.pack.Service');

    expect((service as any).name).to.equal('java.pack.Service');

    const result: any = service.invoke(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return sub match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}});

    const result: any = cache.get('/content/test');

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should not return insufficiently deep match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 1);

    const result: any = cache.get('/content/test');

    expect(result).to.not.exist;
  });

  it('should return inifinity deep match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, -1);

    const result: any = cache.get('/content/test/text');

    expect(result).to.exist;
  });

  it('should return sufficiently deep match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}});

    const result: any = cache.get('/content', 2);

    expect(result).to.exist;
  });

  it('should return sufficiently deep sub match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 2);

    const result: any = cache.get('/content/test', 1);

    expect(result).to.exist;
    expect(result.text).to.equal('Hallo');
  });

  it('should return null if no match', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {test: {text: 'Hallo'}}, 1);

    const result: any = cache.get('/something', 1);

    expect(result).to.not.exist;
  });

  it('should return match of depth 1', () => {
    const cache: Cache = new Cache();

    cache.put('/content', {level1: {level2: 'Hallo'}}, 1);

    const result: any = cache.get('/content/level1/level2', 0);

    expect(result).to.equals('Hallo');
  });

  it('should create a cache key that resembles the method invocation', () => {
    const cache: Cache = new Cache();

    function test(x: string, y: string): string {
      return cache.generateServiceCacheKey('javaClass', 'make', [x, y]);
    }

    const key: string = test('do', 'it');

    expect(key).to.equals('javaClass.make(do,it)');
  });

  it('should create a cache key that resembles the method invocation', () => {
    const cache: Cache = new Cache();

    function test(x: string, y: string): string {
      return cache.generateServiceCacheKey('javaClass', 'make', [x, y]);
    }

    const key: string = test('do', 'it');

    expect(key).to.equals('javaClass.make(do,it)');
  });

  it('should merge caches', () => {
    const cache: Cache = new Cache();

    cache.putIncluded('new', 'oldValue');
    cache.putIncluded('existing', 'existingValue');

    cache.mergeCache({included: {new: 'newValue'}});

    expect(cache.getIncluded('new')).to.equals('newValue');
    expect(cache.getIncluded('existing')).to.equals('existingValue');
  });

  it('should write and read entries', () => {
    const cache: Cache = new Cache();

    cache.putIncluded('incl', 'value');

    expect(cache.getIncluded('incl')).to.equals('value');

    cache.putScript('script', {element: 'test'});

    expect(cache.getScript('script')).to.deep.equal({element: 'test'});

    cache.putServiceCall('call', 'result');

    expect(cache.getServiceCall('call')).to.equal('result');
  });
});
