import * as React from 'react';
import {ComponentRegistry} from './ComponentRegistry';

export class Mapping {
  public resourceType: string;
  public vanillaClass: React.ComponentClass<any>;
  public componentClass: React.ComponentClass<any>;

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
  private registries: ComponentRegistry[];
  private resourceTypeToComponent: {
    [name: string]: React.ComponentClass<any>;
  } = {};
  private componentToResourceType: {[componentClassName: string]: string} = {};
  private vanillaToWrapper: {
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
