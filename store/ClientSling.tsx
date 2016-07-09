import {Sling} from "./Sling";
import Cache from "./Cache";
import {ResourceComponent} from "../component/ResourceComponent";
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}


export default class ClientSling implements Sling {
    constructor(cache: Cache, origin: string) {
        this.cache = cache;
        this.origin = origin;
    }

    private cache: Cache;
    private origin: string;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: any): void {
        let resource: any = this.cache.get(path);
        if (resource === null || typeof resource === "undefined") {
            let depthAsString: string;
            if (!options || typeof options.depth === "undefined" || options.depth === null) {
                depthAsString = "infinity";
            } else {
                depthAsString = (options.depth as string);
            }
            let url: string = this.origin + path + "." + depthAsString + ".json";
            return (window as FetchWindow).fetch(url, {credentials: "same-origin"}).then((response: any) => {
                if (response.status === 404) {
                    listener.changedResource(path, {});
                } else {
                    return response.json();
                }
            }).then((json: any) => {
                this.cache.put(path, json);
                listener.changedResource(path, json);
            });
        } else {
            listener.changedResource(path, resource);
        }
    }


}
