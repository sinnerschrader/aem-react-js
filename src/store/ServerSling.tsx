import {Cache} from "./Cache";
import {SlingResourceOptions, AbstractSling, EditDialogData} from "./Sling";
import {ResourceComponent} from "../component/ResourceComponent";

export interface JavaSling {
  includeResource(path: string, resourceType: string): string;
  currentResource(depth: number): any;
  getResource(path: string, depth: number): any;
  renderDialogScript(path: string, resourceType: string): string;
  getPagePath(): string;
}

export class ServerSling extends AbstractSling {
    private sling: JavaSling;
    private cache: Cache;

    constructor(cache: Cache, sling: JavaSling) {
        super();

        this.cache = cache;
        this.sling = sling;
    }

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions): void {
        let depth: number = !options || typeof options.depth !== "number" ? -1 : options.depth;
        let resource: any = this.cache.get(path, depth);

        if (!resource) {
            console.log(" ServerSling has no resource" + path);

            resource = JSON.parse(this.sling.getResource(path, depth));

            if (!resource) {
                resource = {};
            }

            this.cache.put(path, resource, depth);
        }

        listener.changedResource(path, resource);
    }

    public renderDialogScript(path: string, resourceType: string): EditDialogData {
        let script: string = this.sling.renderDialogScript(path, resourceType);
        let dialog: EditDialogData = null;

        if (script) {
            dialog = JSON.parse(script);
        }

        this.cache.putScript(path, dialog);

        return dialog;
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
