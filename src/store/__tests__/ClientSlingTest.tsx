// tslint:disable no-any

import {expect} from 'chai';
import {ResourceComponent} from '../../component/ResourceComponent';
import {Cache} from '../Cache';
import {ClientSling} from '../ClientSling';
import {EditDialogData} from '../Sling';

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

  it('should include dialog', () => {
    const dialog: EditDialogData = {element: 'el'};
    const cache = new Cache();
    const sling = new ClientSling(cache, null);

    cache.putScript('/test', dialog);

    const actualDialog: EditDialogData = sling.renderDialogScript(
      '/test',
      '/component/test'
    );

    expect(actualDialog).to.deep.equal(dialog);
  });

  it('should subscribe to cached resource', () => {
    const resource = {};
    const cache = new Cache();
    const sling = new ClientSling(cache, null);
    const path = '/test';

    cache.put(path, resource);

    let actualResource: any;
    let actualPath: string;

    const listener: ResourceComponent<
      any,
      any,
      any
    > = new class MockResourceComponent extends ResourceComponent<
      any,
      any,
      any
    > {
      public changedResource(_path: string, _resource: any): void {
        actualResource = _resource;
        actualPath = _path;
      }

      public renderBody(): any {
        /* */
      }
    }();

    sling.subscribe(listener, path, {depth: 1, selectors: []});

    expect(actualPath).to.equal(path);
    expect(actualResource).to.equal(resource);
  });

  it('should subscribe to resource', () => {
    let actualUrl: string;
    const resource = {data: {text: 'hi'}, depth: 1};
    const resources = {resources: {'/test': resource}};
    const cache = new Cache();

    const sling = new ClientSling(cache, '/url', {
      fetch(url: string, options: any): any {
        actualUrl = url;

        return {
          then(cb: (value: any) => any): any {
            return cb({
              json(): any {
                return {
                  then(cb2: (value: any) => void): void {
                    cb2(resources);
                  }
                };
              }
            });
          }
        };
      }
    });

    const path = '/test';

    let actualResource: any;
    let actualPath: string;

    const listener = {
      changedResource(_path: string, _resource: any): void {
        actualResource = _resource;
        actualPath = _path;
      }
    };

    sling.subscribe(listener as ResourceComponent<any, any, any>, path, {
      depth: 1,
      selectors: []
    });

    expect(actualPath).to.equal(path);
    expect(actualUrl).to.equal('/url/test.json.html');
    expect(actualResource).to.deep.equal(resource.data);
  });
});
