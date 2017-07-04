import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import * as React from 'react';
import {ComponentManager, ComponentTreeConfig} from '../ComponentManager';
import {ResourceComponent} from '../component/ResourceComponent';
import {Container, Cq} from '../di/Container';
import {Cache} from '../store/Cache';
import {SlingResourceOptions} from '../store/Sling';

describe('ComponentManager', () => {
  it('should not install components when wcmmode is not disabled', () => {
    const cache: Cache = new Cache();

    const data: ComponentTreeConfig = {
      cache,
      path: '/test',
      resourceType: '/components/test',
      wcmmode: 'edit'
    };

    const doc: Document = new JSDOM(
      "<html><div data-react-id='1'></div><textarea id='1'>" +
        `${JSON.stringify(data)}</textarea></html>`
    ).window.document;

    const cm: ComponentManager = new ComponentManager(null, null, doc);
    const element: Element = doc.querySelector('div');

    cm.initReactComponent(element);
  });

  it('should instantiate react components', () => {
    class Test extends ResourceComponent<any, any, any> {
      public renderBody(): React.ReactElement<any> {
        return <span>test</span>;
      }
    }

    const cache: Cache = new Cache();

    const data: ComponentTreeConfig = {
      cache,
      path: '/test',
      resourceType: '/components/test',
      wcmmode: 'disabled'
    };

    const cqx: any = {};
    const container: Container = new Container(cqx as Cq);

    container.register('cache', cache);

    const sling: any = {
      subscribe: (
        listener: ResourceComponent<any, any, any>,
        path: string,
        options?: SlingResourceOptions
      ) => {
        listener.changedResource(path, {});
      }
    };

    container.register('sling', sling);

    const registry: any = {
      getComponent: (resourceType: string) => Test
    };

    const doc: Document = new JSDOM(
      "<html><div data-react data-react-id='1'></div><textarea id='1'>" +
        `${JSON.stringify(data)}</textarea></html>`
    ).window.document;

    const cm: ComponentManager = new ComponentManager(registry, container, doc);
    const element: Element = doc.querySelector('div');

    cm.initReactComponent(element);

    const count: number = cm.initReactComponents();

    expect(count).to.equal(1);
  });
});
