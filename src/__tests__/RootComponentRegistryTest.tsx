/* tslint:disable no-unused-expression */

import {expect} from 'chai';
import * as React from 'react';
import {ComponentManager} from '../ComponentManager';
import {ComponentRegistry} from '../ComponentRegistry';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {ResourceComponent} from '../component/ResourceComponent';

describe('RootComponentRegistry', () => {
  class TestView extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          {this.getResource().text}
        </span>
      );
    }
  }

  const actualResourceType = '/components/test-view';

  it('should register component', () => {
    const rootRegistry: RootComponentRegistry = new RootComponentRegistry();
    const registry: ComponentRegistry = new ComponentRegistry('/components');

    registry.register(TestView);

    rootRegistry.add(registry);
    rootRegistry.init();

    let component: any = rootRegistry.getComponent(actualResourceType);

    expect(component).to.equal(TestView);

    component = new ComponentManager(rootRegistry, null).getComponent(
      actualResourceType
    );

    expect(component).to.equal(TestView);

    let resourceType: string = rootRegistry.getResourceType(TestView);

    expect(resourceType).to.equal(actualResourceType);

    resourceType = new ComponentManager(rootRegistry, null).getResourceType(
      TestView
    );

    expect(resourceType).to.equal(actualResourceType);
  });

  it('should register vanilla component', () => {
    const rootRegistry: RootComponentRegistry = new RootComponentRegistry();
    const registry: ComponentRegistry = new ComponentRegistry('/components');

    registry.registerVanilla({component: TestView});

    rootRegistry.add(registry);
    rootRegistry.init();

    const component: any = rootRegistry.getComponent(actualResourceType);

    expect(component).to.not.be.null;

    const resourceType = rootRegistry.getResourceType(TestView);

    expect(resourceType).to.be.undefined;
  });
});
