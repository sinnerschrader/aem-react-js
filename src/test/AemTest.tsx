import * as enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import {AemContext} from '../AemContext';
import {ComponentRegistry} from '../ComponentRegistry';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {ResourceRef} from '../component/ResourceComponent';
import {RootComponent} from '../component/RootComponent';
import {Container} from '../di/Container';
import {Cache} from '../store/Cache';
import {MockSling} from './MockSling';

enzyme.configure({adapter: new Adapter()});

export class AemTest {
  public currentAemContext: AemContext;

  private registry: RootComponentRegistry = new RootComponentRegistry();

  public init(): void {
    this.registry.init();

    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    this.currentAemContext = {
      container,
      registry: this.registry
    };
  }

  public addRegistry(registry: ComponentRegistry): void {
    this.registry.add(registry);
  }

  public addResource(ref: ResourceRef, resource: any): void {
    const cache = this.currentAemContext.container.cache;

    cache.put(ref, resource);
  }

  public render(
    resource: any,
    ref: ResourceRef = {
      path: '/',
      selectors: [],
      type: ''
    }
  ): any {
    this.addResource(ref, resource);

    const component: any = this.registry.getComponent(
      resource.resourceType,
      ref.selectors
    );

    if (!component) {
      throw new Error(
        'cannot find component for ' + String(resource.resourceType)
      );
    }

    return enzyme.render(
      <RootComponent
        component={component}
        id="root"
        path={ref.path || '/'}
        wcmmode="disabled"
        aemContext={this.currentAemContext}
        selectors={ref.selectors}
      />
    );
  }
}
