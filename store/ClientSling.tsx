import {SlingResourceOptions, AbstractSling} from "./Sling";
import Cache from "./Cache";
import {ResourceComponent} from "../component/ResourceComponent";
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}


export default class ClientSling extends AbstractSling {
    constructor(cache: Cache, origin: string) {
        super();
        this.cache = cache;
        this.origin = origin;
    }

    private cache: Cache;
    private origin: string;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void {
        let resource: any = this.cache.get(path);
        if (resource === null || typeof resource === "undefined") {
            let depthAsString: string;
            if (!options || typeof options.depth === "undefined" || options.depth === null) {
                depthAsString = "infinity";
            } else {
                depthAsString = options.depth + "";
            }
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
                listener.changedResource(path, this.cache.get(path));
            });
        } else {
            listener.changedResource(path, resource);
        }
    }

    public renderDialogScript(path: string, resourceType: string): string {
        return this.cache.getScript(path);
    }

    public includeResource(path: string, resourceType: string): string {
        return this.cache.getIncluded(path);
    }

    public getRequestPath(): string {
        return window.location.pathname;
    }
}
