import * as React from "react";
import {Mapping} from "./RootComponentRegistry";
import WrapperFactory from "./component/WrapperFactory";
import {ComponentConfig} from "./component/WrapperFactory";

export default class ComponentRegistry {


    public mappings: Mapping[];

    private mapping: any;

    constructor(mapping?: (componentClassName: string) => string);

    constructor(mapping?: string);

    constructor(mapping?: any) {
        this.mappings = [];
        this.mapping = mapping;
    }

    public register(componentClass: typeof React.Component): void {
        /* tslint:disable:no-string-literal */
        let componentClassName: string = (componentClass as any)["name"];
        /* tsslint:enable:no-string-literal */
        let resourceType: string = this.mapToResourceType(componentClassName);
        this.mappings.push(new Mapping(resourceType, componentClass));
    }

    public registerVanilla(config: ComponentConfig): void {
        /* tslint:disable:no-string-literal */
        let componentClassName: string = (config.component as any)["name"];
        /* tsslint:enable:no-string-literal */
        WrapperFactory.createWrapper(config);
        let resourceType: string = this.mapToResourceType(componentClassName);
        this.mappings.push(new Mapping(resourceType, config.component));
    }

    private mapToResourceType(componentClassName: string): string {
        let resourceType: string = null;
        if (typeof this.mapping === "function") {
            resourceType = this.mapping(componentClassName);
        } else if (typeof this.mapping === "string") {
            resourceType = this.mapping + "/" + this.mapClassToResourceType(componentClassName);
        } else {
            resourceType = this.mapClassToResourceType(componentClassName);
        }
        return resourceType;
    }

    private mapClassToResourceType(componentClassName: string): string {
        let parts: string[] = componentClassName.match(/([A-Z][a-z]*)/);
        if (parts) {
            let resourceType: string = parts[0].toLocaleLowerCase();
            let rest: string = componentClassName.substring(parts[0].length);
            if (rest.length > 0) {
                resourceType += "-" + this.mapClassToResourceType(rest);
            }
            return resourceType;
        }
    }
}
