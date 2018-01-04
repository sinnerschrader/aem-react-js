/* tslint:disable no-any no-unused-expression */

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

    let component = rootRegistry.getComponent(actualResourceType, []);

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

    const component = rootRegistry.getComponent(actualResourceType, []);

    expect(component).to.not.be.null;

    const resourceType = rootRegistry.getResourceType(TestView);

    expect(resourceType).to.be.undefined;
  });

  it('should register vanilla component with selector', () => {
    const rootRegistry: RootComponentRegistry = new RootComponentRegistry();
    const registry: ComponentRegistry = new ComponentRegistry('/components');

    registry.registerVanilla({component: TestView, selector: 'special'});

    rootRegistry.add(registry);
    rootRegistry.init();

    const component = rootRegistry.getComponent(actualResourceType, ['x']);

    expect(component).to.be.undefined;

    const specialComponent = rootRegistry.getComponent(actualResourceType, [
      'special'
    ]);

    expect(specialComponent).to.not.be.undefined;

    const resourceType = rootRegistry.getResourceType(TestView);

    expect(resourceType).to.be.undefined;
  });
});
