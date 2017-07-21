/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {Container} from '../../di/Container';
import {ServiceProxy} from '../../di/ServiceProxy';
import {Cache} from '../../store/Cache';
import {MockSling} from '../../test/MockSling';

describe('Container', () => {
  const methodResult = 'methodResult';
  const paramValue = 'param';
  const methodName = 'test';

  const proxy = {
    invoke(method: string, param: any[]): any {
      expect(param[0]).to.equal(paramValue);
      expect(method).to.equal(methodName);

      return JSON.stringify(methodResult);
    }
  };

  it('should return resourceModel', () => {
    const cache = new Cache();

    const container = new Container(
      cache,
      new MockSling(cache),
      {
        getResourceModel: (path: string, resourceType: string) => {
          expect(path).to.equal('/test');
          expect(resourceType).to.equal('/components/test');

          return proxy;
        }
      } as any
    );

    const service: ServiceProxy = container.getResourceModel(
      '/test',
      '/components/test'
    );

    expect((service as any).name).to.equal('/test_/components/test');

    const result = service.invoke<string>(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return requestModel', () => {
    const cache = new Cache();

    const container = new Container(
      cache,
      new MockSling(cache),
      {
        getRequestModel: (path: string, resourceType: string) => {
          expect(path).to.equal('/test');
          expect(resourceType).to.equal('/components/test');

          return proxy;
        }
      } as any
    );

    const service: ServiceProxy = container.getRequestModel(
      '/test',
      '/components/test'
    );

    expect((service as any).name).to.equal('/test_/components/test');

    const result = service.invoke<string>(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return osgi service', () => {
    const cache = new Cache();

    const container = new Container(
      cache,
      new MockSling(cache),
      {
        getOsgiService: (className: string) => {
          expect(className).to.equal('java.pack.Service');

          return proxy;
        }
      } as any
    );

    const service: ServiceProxy = container.getOsgiService('java.pack.Service');

    expect((service as any).name).to.equal('java.pack.Service');

    const result = service.invoke<string>(methodName, paramValue);

    expect(result).to.equal(methodResult);
  });

  it('should return an existing service', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const service = {};

    container.setService('foo', service);

    expect(container.getService('foo')).to.equal(service);
  });

  it('should return undefined for an unknown service', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    expect(container.getService('foo')).to.equal(undefined);
  });
});
