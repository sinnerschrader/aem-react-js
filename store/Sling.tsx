import {ResourceComponent} from "../component/ResourceComponent";

export default interface Sling {

    subscribe(listener: ResourceComponent, path: string, options?: any);
}
