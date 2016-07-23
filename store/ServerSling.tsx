import Cache from "./Cache";
import {SlingResourceOptions, AbstractSling} from "./Sling";
import {ResourceComponent} from "../component/ResourceComponent";
import {JavaSling} from "../references";

export default class ServerSling extends AbstractSling {

    constructor(cache: Cache, sling: JavaSling) {
        super();
        this.cache = cache;
        this.sling = sling;
    }

    private sling: JavaSling;
    private cache: Cache;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void {
        let resource: any = this.cache.get(path);
        let depth: number = options ? options.depth || null : null;
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

    public renderDialogScript(path: string, resourceType: string): string {
        let script: string = this.sling.renderDialogScript(path, resourceType);
        this.cache.putScript(path, script);
        return script;
    }


    public includeResource(path: string, resourceType: string): string {
        let included: string = this.sling.includeResource(path, resourceType);
        this.cache.putIncluded(path, included);
        return included;
    }

    public getRequestPath(): string {
        return this.sling.getPagePath();
    }

}
