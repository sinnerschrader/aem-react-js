import {ResourceComponent} from "../component/ResourceComponent";
import ResourceUtils from "../ResourceUtils";

export interface SlingResourceOptions {
    depth?: number;
}

export interface EditDialogData {
    element: string;
    script?: string;
    attributes?: {[name: string]: string};
}

/**
 * interface that provides standard aem featres for the resource components.
 */
export interface Sling {

    /**
     * Request a resource.
     * @param listener the component that needs the resource
     * @param path resource path
     * @param options options like level depth of resource tree
     */
    subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void;

    /**
     * get the aem wrapper element for the component of the given resourceType at the given resource path.
     * @param path
     * @param resourceType
     */
    renderDialogScript(path: string, resourceType: string): EditDialogData;

    /**
     * Include a component's html.
     * @param path
     * @param resourceType
     */
    includeResource(path: string, resourceType: string): string;

    getRequestPath(): string;
    getContainingPagePath(): string;
}



export abstract class AbstractSling implements Sling {

    public abstract subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void;

    public abstract renderDialogScript(path: string, resourceType: string): EditDialogData;

    public abstract includeResource(path: string, resourceType: string): string;

    public abstract getRequestPath(): string;

    public getContainingPagePath(): string {
        return ResourceUtils.getContainingPagePath(this.getRequestPath());
    }
}
