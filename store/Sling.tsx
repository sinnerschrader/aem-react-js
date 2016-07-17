import {ResourceComponent} from "../component/ResourceComponent";

export interface SlingResourceOptions {
    depth?: number;
}

export interface Sling {

    subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void;
    renderDialogScript(path: string, resourceType: string): string;
    includeResource(path: string, resourceType: string): string;
    getRequestPath(): string;
}
