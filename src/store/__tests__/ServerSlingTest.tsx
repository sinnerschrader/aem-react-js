/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {Cache} from '../Cache';
import {JavaSling, ServerSling} from '../ServerSling';
import {EditDialogData} from '../Sling';

describe('ServerSling', () => {
  it('should include resource', () => {
    const html = '<div></div>';
    const cache = new Cache();

    const javaSling = {
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

    const sling: ServerSling = new ServerSling(cache, javaSling as JavaSling);
    const actualHtml = sling.includeResource(
      '/test',
      null,
      '/component/test',
      {}
    );

    expect(actualHtml).to.equal(html);
    expect(cache.getIncluded('/test', null)).to.equal(html);
  });

  it('should subscribe to resource', () => {
    const resource = {text: 'hi'};
    const path = '/test';

    let actualResource: any;

    const cache = new Cache();

    const javaSling = {
      getResource(_path: string, depth?: number): string {
        if (_path === path && depth === 3) {
          return JSON.stringify(resource);
        } else {
          return null;
        }
      }
    };

    const sling: ServerSling = new ServerSling(cache, javaSling as JavaSling);

    const listener = (_resource: any) => {
      actualResource = _resource;
    };

    sling.load(listener, path, {
      depth: 3,
      selectors: []
    });

    expect(actualResource).to.deep.equal(resource);
  });

  it('should include dialog', () => {
    const dialog: EditDialogData = {element: 'el'};
    const cache = new Cache();

    const javaSling = {
      renderDialogScript(path: string, resourceType: string): string {
        return JSON.stringify(dialog);
      }
    };

    const sling: ServerSling = new ServerSling(cache, javaSling as JavaSling);

    const actualDialog: EditDialogData = sling.renderDialogScript(
      '/test',
      '/component/test'
    );

    expect(actualDialog).to.deep.equal(dialog);
    expect(cache.getScript('/test')).to.deep.equal(dialog);
  });

  it('should include null dialog', () => {
    const cache = new Cache();

    const javaSling = {
      renderDialogScript(path: string, resourceType: string): string {
        return null;
      }
    };

    const sling: ServerSling = new ServerSling(cache, javaSling as JavaSling);

    const actualDialog: EditDialogData = sling.renderDialogScript(
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

    const sling: ServerSling = new ServerSling(null, javaSling as JavaSling);
    const actualPath: string = sling.getRequestPath();

    expect(actualPath).to.equal(path);
  });
});
