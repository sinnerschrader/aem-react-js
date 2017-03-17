import * as React from "react";
import ComponentRegistry from "./ComponentRegistry";

export class Mapping {
    public resourceType: string;
    public vanillaClass: typeof React.Component;
    public componentClass: typeof React.Component;

    constructor(resourceType: string, componentClass: typeof React.Component, vanillaClass: typeof React.Component) {
        this.resourceType = resourceType;
        this.componentClass = componentClass;
        this.vanillaClass = vanillaClass;
    }
}

export default class RootComponentRegistry {

    private registries: ComponentRegistry[];

    private resourceTypeToComponent: {[name: string]: typeof React.Component} = {};
    private componentToResourceType: {[componentClassName: string]: string} = {};
    private vanillaToWrapper: {[componentClassName: string]: typeof React.Component} = {};

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

    public register(mapping: Mapping): void {
        /* tslint:disable:no-string-literal */
        let componentClassName: string = (mapping.componentClass as any)["name"];
        /* tsslint:enable:no-string-literal */
        if (!mapping.vanillaClass) {
            // vanilla component's class all have the same name
            this.componentToResourceType[componentClassName] = mapping.resourceType;
        } else {
            let vanillaClassName: string = (mapping.vanillaClass as any)["name"];
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

    public getVanillaWrapper(component: typeof React.Component): typeof React.Component {
        let name: string = (component as any) ["name"];
        return this.vanillaToWrapper[name];
    }

}
