import {SlingResourceOptions, AbstractSling, EditDialogData} from "./Sling";
import Cache from "./Cache";
import {ResourceComponent} from "../component/ResourceComponent";
import EditDialog from "../component/EditDialog";
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}

/**
 * ClientSling gets all data from the cache. If the data is not available then it will get
 * the part of the cache which corresponds to the given component from the server.
 */
export default class ClientSling extends AbstractSling {
    constructor(cache: Cache, origin: string) {
        super();
        this.cache = cache;
        this.origin = origin;
    }

    private cache: Cache;
    private origin: string;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void {
        //
        let depth: number;
        if (!options || typeof options.depth === "undefined" || options.depth === null) {
            depth = 0;
        } else {
            depth = options.depth;
        }
        let resource: any = this.cache.get(path, depth);
        if (resource === null || typeof resource === "undefined") {
            let depthAsString: string;
            if (depth < 0) {
                depthAsString = "infinity";
            } else {
                depthAsString = options.depth + "";
            }
            // TODO what about depth as string??
            let url: string = this.origin + path + ".json.html"; // + depthAsString + ".json";
            const serverRenderingParam: string = "serverRendering=disabled";
            let serverRendering: boolean = window.location.search.indexOf(serverRenderingParam) >= 0;
            if (serverRendering) {
                url += "?" + serverRenderingParam;
            }
            return (window as FetchWindow).fetch(url, {credentials: "same-origin"}).then((response: any) => {
                if (response.status === 404) {
                    return {};
                } else {
                    return response.json();
                }
            }).then((json: any) => {
                this.cache.mergeCache(json);
                listener.changedResource(path, this.cache.get(path, depth));
            });
        } else {
            listener.changedResource(path, resource);
        }
    }

    public renderDialogScript(path: string, resourceType: string): EditDialogData {
        // TODO Can we get the scrit from the server too?. This will probably not work as the returned script is
        // not executed as in the initial server rendering case. For react router we need to do a reload anyways.
        return this.cache.getScript(path);
    }

    public includeResource(path: string, resourceType: string): string {
        // Currently cannot be loaded from server alone.
        return this.cache.getIncluded(path);
    }

    public getRequestPath(): string {
        return window.location.pathname;
    }

}
