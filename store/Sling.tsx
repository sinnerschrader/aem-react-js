import {ResourceComponent} from "../component/ResourceComponent";
import ResourceUtils from "../ResourceUtils";

export interface SlingResourceOptions {
    depth?: number;
}

export interface Sling {

    subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void;
    renderDialogScript(path: string, resourceType: string): string;
    includeResource(path: string, resourceType: string): string;
    getRequestPath(): string;
    getContainingPagePath(): string;
}

export abstract class AbstractSling implements Sling {

    public abstract subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void;

    public abstract renderDialogScript(path: string, resourceType: string): string;

    public abstract includeResource(path: string, resourceType: string): string;

    public abstract getRequestPath(): string;

    public getContainingPagePath(): string {
        return ResourceUtils.getContainingPagePath(this.getRequestPath());
    }
}
