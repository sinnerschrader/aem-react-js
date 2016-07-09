import Cache from "./Cache";
import {Sling} from "./Sling";
import {ResourceComponent} from "../component/ResourceComponent";
import {JavaSling} from "../references";

export default class ServerSling implements Sling {
    constructor(cache: Cache, sling: JavaSling) {
        this.cache = cache;
        this.sling = sling;
    }

    private sling: JavaSling;
    private cache: Cache;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, depth?: number): void {
        let resource: any = this.cache.get(path);
        if (!resource) {
            console.log(" ServerSling has no resource" + path);
            resource = JSON.parse(this.sling.getResource(path, depth));
            if (!resource) {
                resource = {};
            }
            this.cache.put(path, resource);
        }
        console.log(" ServerSling resource is loaded " + path + "   " + resource);
        listener.changedResource(path, resource);
    }

}
