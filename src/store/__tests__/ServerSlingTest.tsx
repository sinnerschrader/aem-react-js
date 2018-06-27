/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {ComponentData, ResourceRef} from '../../component/ResourceComponent';
import {Cache} from '../Cache';
import {JavaSling, ServerSling} from '../ServerSling';
import {EditDialogData, LoadComponentCallback} from '../Sling';

describe('ServerSling', () => {
  it('should include resource', () => {
    const html = '<div></div>';
    const cache = new Cache();

    const javaSling: Partial<JavaSling> = {
      includeResource(
        path: string,
        resourceType: string,
        addSelectors: string,
        selectors: string,
        decorationTagName: string
      ): string {
        return html;
      }
    };

    const sling: ServerSling = new ServerSling({
      cache,
      javaSling: javaSling as JavaSling
    });
    const actualHtml = sling.includeResource(
      '/test',
      null,
      '/component/test',
      {}
    );

    expect(actualHtml).to.equal(html);
    expect(cache.getIncluded('/test', null)).to.equal(html);
  });

  it('should load model without children', async () => {
    const model = {text: 'hi'};
    const path = '/test';

    let actualResource: any;
    let actualPath: string;

    const cache = new Cache();
    const javaSling: Partial<JavaSling> = {
      getModel(_path: string): any {
        if (_path === path) {
          return JSON.stringify(model);
        } else {
          return null;
        }
      },
      renderDialogScript(): any {
        return '{}';
      }
    };

    const sling: ServerSling = new ServerSling({
      cache,
      javaSling: javaSling as JavaSling
    });

    const callback: LoadComponentCallback = (data: ComponentData): void => {
      actualResource = data.transformData;
      actualPath = path;
    };

    const ref: ResourceRef = {
      path,
      selectors: [],
      type: 'testType'
    };

    sling.loadComponent(ref, callback);

    expect(actualPath).to.equal(path);
    expect(actualResource).to.deep.equal(model);
  });

  it('should load model with children', async () => {
    const model = {
      exportedItems: {x: {text: 'ho'}},
      exportedItemsOrder: ['x'],
      text: 'hi'
    };
    const path = '/test';

    let actualResource: ComponentData;

    const cache = new Cache();
    const javaSling: Partial<JavaSling> = {
      getModel(_path: string): any {
        if (_path === path) {
          return JSON.stringify(model);
        } else {
          return null;
        }
      },
      renderDialogScript(): any {
        return '{}';
      }
    };

    const sling: ServerSling = new ServerSling({
      cache,
      javaSling: javaSling as JavaSling
    });

    const callback: LoadComponentCallback = (data: ComponentData): void => {
      actualResource = data.children[data.childrenOrder[0]];
    };

    const ref: ResourceRef = {
      path,
      selectors: [],
      type: 'testType'
    };

    sling.loadComponent(ref, callback);

    expect(actualResource.id.path).to.equal('/test/x');
    expect(actualResource.transformData.text).to.equal('ho');

    sling.loadComponent(
      {path: '/test/x', type: 'testType', selectors: []},
      (data: ComponentData): void => {
        actualResource = data;
      }
    );

    expect(actualResource.id.path).to.equal('/test/x');
    expect(actualResource.transformData.text).to.equal('ho');
  });

  /*  it('should include dialog', () => {
    const dialog: EditDialogData = {element: 'el'};
    const cache = new Cache();

    const javaSling = {
      renderDialogScript(path: string, resourceType: string): string {
        return JSON.stringify(dialog);
      }
    };

    const apiFactory = {};
    const registry = {};

    const sling: ServerSling = new ServerSling({
      apiFactory: apiFactory as JavaApiFactory,
      cache,
      javaSling: javaSling as JavaSling,
      registry: registry as RootComponentRegistry
    });

    const actualDialog: EditDialogData = sling.getDialog(
      '/test',
      '/component/test'
    );

    expect(actualDialog).to.deep.equal(dialog);
    expect(cache.getDialogData('/test')).to.deep.equal(dialog);
  });*/

  it('should include null dialog', () => {
    const cache = new Cache();

    const javaSling = {
      renderDialogScript(path: string, resourceType: string): string {
        return null;
      }
    };

    const sling: ServerSling = new ServerSling({
      cache,
      javaSling: javaSling as JavaSling
    });

    const actualDialog: EditDialogData = sling.getDialog(
      '/test',
      '/component/test'
    );

    expect(actualDialog).to.be.null;
  });

  it('should get path', () => {
    const path = '/test';

    const javaSling: any = {
      getPagePath(): string {
        return path;
      }
    };

    const cache = {};

    const sling: ServerSling = new ServerSling({
      cache: cache as Cache,
      javaSling: javaSling as JavaSling
    });
    const actualPath: string = sling.getRequestPath();

    expect(actualPath).to.equal(path);
  });
});
