import {ResourceComponent} from "../component/ResourceComponent";

export interface Sling {

    subscribe(listener: ResourceComponent, path: string, options?: any);
}
