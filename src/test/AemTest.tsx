import * as enzyme from 'enzyme';
import * as React from 'react';
import {AemContext} from '../AemContext';
import {ComponentRegistry} from '../ComponentRegistry';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {RootComponent} from '../component/RootComponent';
import {Container} from '../di/Container';
import {Cache} from '../store/Cache';
import {MockSling} from './MockSling';

export class AemTest {
  public currentAemContext: AemContext;

  private registry: RootComponentRegistry = new RootComponentRegistry();

  public init(): void {
    this.registry.init();

    const container: Container = new Container({} as any);
    const cache: Cache = new Cache();

    container.register('cache', cache);
    container.register('sling', new MockSling(cache));

    this.currentAemContext = {
      container,
      registry: this.registry
    };
  }

  public addRegistry(registry: ComponentRegistry): void {
    this.registry.add(registry);
  }

  public addResource(path: string, resource: any, depth?: number): void {
    const cache: Cache = this.currentAemContext.container.get('cache') as Cache;

    cache.put(path, resource, depth);
  }

  public render(resource: any, path?: string): any {
    this.addResource(path || '/', resource);

    const component: any = this.registry.getComponent(resource.resourceType);

    if (!component) {
      throw new Error(
        'cannot find component for ' + String(resource.resourceType)
      );
    }

    return enzyme.render(
      <RootComponent
        comp={component}
        path={path || '/'}
        wcmmode="disabled"
        aemContext={this.currentAemContext}
      />
    );
  }
}
