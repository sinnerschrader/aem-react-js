// tslint:disable no-any

import {expect} from 'chai';
import {ComponentData, ResourceRef} from '../../component/ResourceComponent';
// import {MockComponentDataFetcher} from '../../test/MockComponentDataFetcher';
import {Cache} from '../Cache';
import {ClientSling} from '../ClientSling';
import {LoadComponentCallback} from '../Sling';

describe('ClientSling', () => {
  it('should include resource', () => {
    const html = '<div></div>';
    const cache = new Cache();
    const sling = new ClientSling(cache, null);

    cache.putIncluded('/test', null, html);

    const actualHtml: string = sling.includeResource(
      '/test',
      null,
      '/component/test',
      {}
    );

    expect(actualHtml).to.equal(html);
  });

  it('should load cached component data', async () => {
    const transformData = {x: 1};
    const cache = new Cache();
    const sling = new ClientSling(cache, null);
    const path = '/test';
    const ref: ResourceRef = {
      path,
      selectors: [],
      type: '/test'
    };
    cache.putComponentData({
      dialog: {element: 'div'},
      id: ref,
      transformData
    });

    let actualResource: any;
    let actualPath: string;

    const callback: LoadComponentCallback = (_data: ComponentData) => {
      actualResource = _data.transformData;
      actualPath = path;
    };

    sling.loadComponent(ref, callback);
    expect(actualPath).to.equal(path);
    expect(actualResource).to.equal(transformData);
  });

  /*
  it('should load component data and put them in cache', async () => {
    const transformData = {x: 2};
    const cache = new Cache();

    const path = '/test';
    const ref: ResourceRef = {
      path,
      selectors: [],
      type: 'testType'
    };

    const fetcher = new MockComponentDataFetcher({
      dialog: {element: 'div'},
      id: ref,
      transformData
    });
    const sling = new ClientSling(cache, fetcher);

    let actualResource: any;

    const callback: LoadComponentCallback = (_data: ComponentData) => {
      actualResource = _data.transformData;
    };

    sling.loadComponent(ref, callback);
    expect(actualResource).to.deep.equal(transformData);
  });
  */
});
