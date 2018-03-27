// tslint:disable no-any

import {expect} from 'chai';
import {ComponentData, ResourceRef} from '../../component/ResourceComponent';
import {MockComponentDataFetcher} from '../../test/MockComponentDataFetcher';
import {Cache} from '../Cache';
import {ClientSling} from '../ClientSling';
import {LoadComponentCallback} from '../Sling';
import {PartialCache} from '../ComponentDataFetcher';

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

  xit('should include dialog', () => {
    // const dialog: EditDialogData = {element: 'el'};
    // const cache = new Cache();
    // const sling = new ClientSling(cache, null);
    //
    // cache.putScript('/test', dialog);
    //
    // // const actualDialog: EditDialogData = sling.getDialog(
    // //   '/test',
    // //   '/component/test'
    // // );
    //
    // expect(actualDialog).to.deep.equal(dialog);
  });

  it('should load cached component data', async () => {
    const resource = {};
    const cache = new Cache();
    const sling = new ClientSling(cache, null);
    const path = '/test';
    const ref: ResourceRef = {
      path,
      selectors: [],
      type: '/test'
    };
    cache.put(ref, resource);

    let actualResource: any;
    let actualPath: string;

    const callback: LoadComponentCallback = (_data: ComponentData) => {
      actualResource = _data.transformData.props;
      actualPath = path;
    };

    sling.loadComponent(ref, callback);
    expect(actualPath).to.equal(path);
    expect(actualResource).to.equal(resource);
  });

  it('should load component data and put them in cache', async () => {
    const resource: PartialCache = {};
    const cache = new Cache();
    const fetcher = new MockComponentDataFetcher(resource);
    const sling = new ClientSling(cache, fetcher);

    const path = '/test';

    let actualResource: any;

    const callback: LoadComponentCallback = (_data: ComponentData) => {
      actualResource = _data.transformData.props;
    };

    const ref: ResourceRef = {
      path,
      selectors: [],
      type: 'testType'
    };

    sling.loadComponent(ref, callback);
    expect(actualResource).to.deep.equal(resource);
  });
});
