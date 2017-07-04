/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import {ServiceProxy} from '../../di/ServiceProxy';
import {Cache} from '../../store/Cache';

describe('ServiceProxy', () => {
  it('should invoke target and cache result', () => {
    const target: any = {
      invoke(method: string, args: any[]): string {
        if (method === 'add' && args.length === 2) {
          const arg1: number = args[0];
          const arg2: number = args[1];

          return JSON.stringify(arg1 + arg2);
        }

        throw new Error('unknown method');
      }
    };

    const cache: Cache = new Cache();

    const proxy: ServiceProxy = new ServiceProxy(
      cache,
      () => target,
      'javaClass'
    );

    const result: number = proxy.invoke('add', 1, 3);

    expect(result).to.equal(4);
    expect(cache.getServiceCall('javaClass.add(1,3)')).to.equal(4);
  });

  it('should invoke target and not cache result when error is thrown', () => {
    const target: any = {
      invoke(method: string, args: any[]): string {
        throw new Error('unknown method');
      }
    };

    const cache: Cache = new Cache();

    const proxy: ServiceProxy = new ServiceProxy(
      cache,
      () => target,
      'javaClass'
    );

    try {
      proxy.invoke('add', 1, 3);

      expect.fail('expected error');
    } catch (e) {
      // expected
      expect(cache.getServiceCall('javaClass.add(1,3)')).to.be.undefined;
    }
  });

  it('should invoke target and return null', () => {
    const target: any = {
      invoke(method: string, args: any[]): string {
        return null;
      }
    };

    const cache: Cache = new Cache();

    const proxy: ServiceProxy = new ServiceProxy(
      cache,
      () => target,
      'javaClass'
    );

    const result: any = proxy.invoke('add', 1, 3);

    expect(result).to.be.null;
  });
});
