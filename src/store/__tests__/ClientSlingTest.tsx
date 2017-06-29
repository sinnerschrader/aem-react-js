import {expect} from 'chai';
import {Cache} from '../Cache';
import {EditDialogData} from '../Sling';
import {ClientSling} from '../ClientSling';
import {ResourceComponent} from '../../component/ResourceComponent';

describe('ClientSling', () => {
  it('should include resource', () => {
    let html: string = '<div></div>';
    let cache: Cache = new Cache();
    let sling: ClientSling = new ClientSling(cache, null);

    cache.putIncluded('/test', html);

    let actualHtml: string = sling.includeResource('/test', '/component/test');

    expect(actualHtml).to.equal(html);
  });

  it('should include dialog', () => {
    let dialog: EditDialogData = {element: 'el'};
    let cache: Cache = new Cache();
    let sling: ClientSling = new ClientSling(cache, null);

    cache.putScript('/test', dialog);

    let actualDialog: EditDialogData = sling.renderDialogScript(
      '/test',
      '/component/test'
    );

    expect(actualDialog).to.deep.equal(dialog);
  });

  it('should subscribe to cached resource', () => {
    let resource: any = {};
    let cache: Cache = new Cache();
    let sling: ClientSling = new ClientSling(cache, null);
    let path: string = '/test';

    cache.put(path, resource);

    let actualResource: any;
    let actualPath: string;

    let listener: ResourceComponent<
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

    sling.subscribe(listener, path, {depth: 1});

    expect(actualPath).to.equal(path);
    expect(actualResource).to.equal(resource);
  });

  it('should subscribe to resource', () => {
    let actualUrl: string;
    let resource: any = {data: {text: 'hi'}, depth: 1};
    let resources: any = {resources: {'/test': resource}};
    let cache: Cache = new Cache();

    let sling: ClientSling = new ClientSling(cache, '/url', {
      fetch: function(url: string, options: any): any {
        actualUrl = url;

        return {
          then: function(cb: (value: any) => any): any {
            return cb({
              json: function(): any {
                return {
                  then: function(cb2: (value: any) => void): void {
                    cb2(resources);
                  }
                };
              }
            });
          }
        };
      }
    });

    let path: string = '/test';
    let actualResource: any;
    let actualPath: string;

    let listener: any = {
      changedResource: function(_path: string, _resource: any): void {
        actualResource = _resource;
        actualPath = _path;
      }
    };

    sling.subscribe(listener as ResourceComponent<any, any, any>, path, {
      depth: 1
    });

    expect(actualPath).to.equal(path);
    expect(actualUrl).to.equal('/url/test.json.html');
    expect(actualResource).to.deep.equal(resource.data);
  });
});
