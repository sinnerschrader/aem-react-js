export default class Cache {

    constructor() {
        this.resources = {};
        this.scripts = {};
        this.included = {};
    }

    private resources: {[path: string]: any};
    private scripts: {[path: string]: string};
    private included: {[path: string]: string};

    public mergeCache(cache: any): void {
        // TODO properly merge caches
        if (cache) {
            this.merge(this.resources, cache.resources);
            this.merge(this.included, cache.included);
            this.merge(this.scripts, cache.scripts);
        }
    }


    public put(path: string, resource: any): void {
        this.resources[path] = resource;
    }

    public get(path: string): void {
        return this.resources[path];
    }

    public putScript(path: string, script: string): void {
        this.scripts[path] = script;
    }

    public getScript(path: string): string {
        return this.scripts[path];
    }

    public putIncluded(path: string, included: string): void {
        this.included[path] = included;
    }

    public getIncluded(path: string): string {
        return this.included[path];
    }

    public getFullState(): any {
        return {
            resources: this.resources, scripts: this.scripts, included: this.included
        };
    }
    
    private merge(target: any, source: any): void {
        if (source) {
            Object.keys(source).forEach((key: string) => {
                target[key] = source[key];
            });
        }
    }
    
}
