/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {Mapping} from '../RootComponentRegistry';
import {ResourceComponent} from '../component/ResourceComponent';

describe('ComponentRegistry', () => {
  class TestView extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          {this.getResource().text}
        </span>
      );
    }
  }

  it('should register component', () => {
    const registry: ComponentRegistry = new ComponentRegistry('/components');

    registry.register(TestView);

    const mapping: Mapping = registry.mappings[0];

    expect(mapping.componentClass).to.equal(TestView);
    expect(mapping.resourceType).to.equal('/components/test-view');
    expect(mapping.vanillaClass).to.be.null;
  });

  it('should register component with special mapping', () => {
    const registry: ComponentRegistry = new ComponentRegistry(
      (name: string) => '/x/' + name
    );

    registry.register(TestView);

    const mapping: Mapping = registry.mappings[0];

    expect(mapping.componentClass).to.equal(TestView);
    expect(mapping.resourceType).to.equal('/x/TestView');
    expect(mapping.vanillaClass).to.be.null;
  });

  it('should register vanilla component', () => {
    const registry: ComponentRegistry = new ComponentRegistry(
      '/components/vanilla'
    );

    registry.registerVanilla({component: TestView});

    const mapping: Mapping = registry.mappings[0];

    expect(mapping.componentClass).to.not.equal(TestView);
    expect(mapping.resourceType).to.equal('/components/vanilla/test-view');
    expect(mapping.vanillaClass).to.equal(TestView);
  });

  it('should register vanilla component with selector', () => {
    const registry: ComponentRegistry = new ComponentRegistry(
      '/components/vanilla'
    );

    registry.registerVanilla({component: TestView, selector: 'special'});

    const mapping: Mapping = registry.mappings[0];

    expect(mapping.componentClass).to.not.equal(TestView);
    expect(mapping.resourceType).to.equal('/components/vanilla/test-view');
    expect(mapping.vanillaClass).to.equal(TestView);
    expect(mapping.selector).to.equal('special');
  });

  it('should register component with selector', () => {
    const registry: ComponentRegistry = new ComponentRegistry('/components/x');

    registry.register(TestView, 'testview', 'special');

    const mapping = registry.mappings[0];

    expect(mapping.componentClass).to.equal(TestView);
    expect(mapping.resourceType).to.equal('/components/x/testview');
    expect(mapping.selector).to.equal('special');
  });
});
