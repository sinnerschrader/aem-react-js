export default class Cache {

    constructor() {
        this.resources = {};
        this.scripts = {};
        this.included = {};
        this.serviceCalls = {};
    }

    private resources: {[path: string]: any};
    private scripts: {[path: string]: string};
    private included: {[path: string]: string};
    private serviceCalls: {[path: string]: any};

    public generateServiceCacheKey(service: string, method: string, args: IArguments): string {
        let cacheKey: string = service + "." + method + "(";
        for (let i = 0; i < args.length; i++) {
            cacheKey += args[i] + "";
            if (i < args.length - 1) {
                cacheKey += ",";
            }
        }
        return cacheKey;
    }

    public wrapServiceCall<T>(cacheKey: string, callback: () => T): T {
        let result: T = this.getServiceCall(cacheKey);
        if (typeof result === "undefined") {
            result = callback();
            console.log("new service call: " + result);
            this.putServiceCall(cacheKey, result);
        }
        return result;
    }

    public mergeCache(cache: any): void {
        // TODO properly merge caches
        if (cache) {
            this.merge(this.resources, cache.resources);
            this.merge(this.included, cache.included);
            this.merge(this.scripts, cache.scripts);
            this.merge(this.serviceCalls, cache.serviceCalls);
        }
    }


    public put(path: string, resource: any): void {
        this.resources[path] = resource;
    }

    public get(path: string): void {
        return this.resources[path];
    }

    public putServiceCall(key: string, serviceCall: any): void {
        this.serviceCalls[key] = serviceCall;
    }

    public getServiceCall(key: string): any {
        return this.serviceCalls[key];
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
            resources: this.resources, scripts: this.scripts, included: this.included, serviceCalls: this.serviceCalls
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
