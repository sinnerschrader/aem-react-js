/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import * as React from 'react';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {ServerRenderer, ServerResponse} from '../ServerRenderer';
import {ResourceComponent} from '../component/ResourceComponent';
import {Container} from '../di/Container';
import {Cache} from '../store/Cache';

describe('ServerRenderer', () => {
  it('should render component', () => {
    class Test extends ResourceComponent<any, any, any> {
      public renderBody(): React.ReactElement<any> {
        return (
          <span>
            {this.getResource().text}
          </span>
        );
      }
    }

    const sling: any = {
      subscribe(
        component: ResourceComponent<any, any, any>,
        path: string
      ): void {
        component.changedResource(path, {text: 'hi'});
      }
    };

    const container: Container = new Container({} as any);

    container.register('sling', sling);
    container.register('cache', new Cache());

    const registry: RootComponentRegistry = {
      getComponent(resourceType: string): any {
        return Test;
      }
    } as any;

    const renderer: ServerRenderer = new ServerRenderer(registry, container);

    const response: ServerResponse = renderer.renderReactComponent(
      '/test',
      '/components/test',
      'disabled'
    );

    expect(response.html).to.equal(
      '<span data-reactroot="" data-reactid="1" ' +
        'data-react-checksum="-1096281847">hi</span>'
    );
  });

  it('should throw error if component is not found', () => {
    const registry: RootComponentRegistry = {
      getComponent(resourceType: string): any {
        return null;
      }
    } as any;

    const renderer: ServerRenderer = new ServerRenderer(registry, null);

    let error = false;

    try {
      renderer.renderReactComponent('/test', '/components/test', 'disabled');
    } catch (e) {
      error = true;
    }

    expect(error).to.be.true;
  });
});
