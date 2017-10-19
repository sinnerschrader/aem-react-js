import * as React from 'react';
import {ComponentRegistry} from './ComponentRegistry';
import {identity, rootDecorator} from './rootDecorator';

export class Mapping {
  public readonly resourceType: string;
  public readonly vanillaClass: React.ComponentClass<any>;
  public readonly componentClass: React.ComponentClass<any>;

  public constructor(
    resourceType: string,
    componentClass: React.ComponentClass<any>,
    vanillaClass: React.ComponentClass<any>
  ) {
    this.resourceType = resourceType;
    this.componentClass = componentClass;
    this.vanillaClass = vanillaClass;
  }
}

export class RootComponentRegistry {
  public rootDecorator: rootDecorator = identity;

  private readonly registries: ComponentRegistry[];

  private readonly resourceTypeToComponent: {
    [name: string]: React.ComponentClass<any>;
  } = {};

  private readonly componentToResourceType: {
    [componentClassName: string]: string;
  } = {};

  private readonly vanillaToWrapper: {
    [componentClassName: string]: React.ComponentClass<any>;
  } = {};

  public constructor() {
    this.registries = [];
  }

  public add(registry: ComponentRegistry): void {
    this.registries.push(registry);
  }

  public getResourceType(
    component: React.ComponentClass<any> | React.Component<any, any>
  ): string {
    if (component instanceof React.Component) {
      const componentClassName: string = Object.getPrototypeOf(component)
        .constructor.name;

      return this.componentToResourceType[componentClassName];
    } else {
      const componentClassName: string = (component as any).name;

      return this.componentToResourceType[componentClassName];
    }
  }

  public getComponent(resourceType: string): React.ComponentClass<any> {
    if (resourceType && resourceType.match(/^\/apps\//)) {
      resourceType = resourceType.substring('/apps/'.length);
    }
    if (resourceType && resourceType.match(/\/$/)) {
      resourceType = resourceType.substring(0, resourceType.length - 1);
    }

    return this.resourceTypeToComponent[resourceType];
  }

  public register(mapping: Mapping): void {
    const componentClassName = mapping.componentClass.name;

    if (!mapping.vanillaClass) {
      // vanilla component's class all have the same name
      this.componentToResourceType[componentClassName] = mapping.resourceType;
    } else {
      const vanillaClassName: string = (mapping.vanillaClass as any)['name'];

      this.vanillaToWrapper[vanillaClassName] = mapping.componentClass;
    }

    this.resourceTypeToComponent[mapping.resourceType] = mapping.componentClass;
  }

  public init(): void {
    this.registries.forEach((registry: ComponentRegistry) => {
      registry.mappings.forEach((mapping: Mapping) => {
        this.register(mapping);
      }, this);
    }, this);
  }

  public getVanillaWrapper(
    component: React.ComponentClass<any>
  ): React.ComponentClass<any> {
    return this.vanillaToWrapper[component.name];
  }
}
