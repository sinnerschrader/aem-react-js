// tslint:disable no-any

import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import * as React from 'react';
import {ComponentManager, ComponentTreeConfig} from '../ComponentManager';
import {ResourceComponent} from '../component/ResourceComponent';
import {Container} from '../di/Container';
import {Cache} from '../store/Cache';
import {SlingResourceOptions} from '../store/Sling';
import {MockSling} from '../test/MockSling';

describe('ComponentManager', () => {
  it('should not install components when wcmmode is not disabled', () => {
    const cache = new Cache();

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

    const container = new Container(cache, new MockSling(cache));
    const cm: ComponentManager = new ComponentManager(null, container, doc);
    const element: Element = doc.querySelector('div');

    cm.initReactComponent(element);
  });

  it('should instantiate react components', () => {
    class Test extends ResourceComponent<any, any, any> {
      public renderBody(): React.ReactElement<any> {
        return <span>test</span>;
      }
    }

    const cache = new Cache();

    const data: ComponentTreeConfig = {
      cache,
      path: '/test',
      resourceType: '/components/test',
      wcmmode: 'disabled'
    };

    const container = new Container(
      cache,
      {
        subscribe: (
          listener: ResourceComponent<any, any, any>,
          path: string,
          options?: SlingResourceOptions
        ) => {
          listener.changedResource(path, {});
        }
      } as any
    );

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
