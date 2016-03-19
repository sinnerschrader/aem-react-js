import * as React from "react";
import ComponentRegistry from "./ComponentRegistry";

export class Mapping {
    public resourceType: string;
    public componentClass: typeof React.Component;

    constructor(resourceType: string, componentClass: typeof React.Component) {
        this.resourceType = resourceType;
        this.componentClass = componentClass;
    }
}

export default class RootComponentRegistry {

    private registries: ComponentRegistry[];

    private resourceTypeToComponent: { [name: string]: typeof React.Component } = {};
    private componentToResourceType: {[componentClassName: string]: string} = {};

    constructor() {
        this.registries = [];
    }

    public add(registry: ComponentRegistry): void {
        this.registries.push(registry);
    }

    public getResourceType(component: typeof React.Component): string;
    public getResourceType(component: React.Component<any, any>): string;
    public getResourceType(component: any): string {
        if (component instanceof React.Component) {
            let componentClassName: string = Object.getPrototypeOf(component).constructor.name;
            return this.componentToResourceType[componentClassName];
        } else {
            let componentClassName: string = (component as any).name;
            return this.componentToResourceType[componentClassName];
        }
    }

    public getComponent(resourceType: string): typeof React.Component {
        return this.resourceTypeToComponent[resourceType];
    }

    public register(resourceType: string, componentClass: typeof React.Component): void {
        /* tslint:disable:no-string-literal */
        let componentClassName: string = (componentClass as any)["name"];
        /* tsslint:enable:no-string-literal */
        this.componentToResourceType[componentClassName] = resourceType;
        this.resourceTypeToComponent[resourceType] = componentClass;
    }

    public init(): void {
        this.registries.forEach((registry: ComponentRegistry) => {
            registry.mappings.forEach((mapping: Mapping) => {
                this.register(mapping.resourceType, mapping.componentClass);
            }, this);
        }, this);
    }

}
