
export default class Cache {

    constructor() {
        this.resources = {};
    }

    private resources: {[path: string]: any};

    public put(path: string, resource: any): void {
        this.resources[path] = resource;
    }

    public get(path: string): void {
        return this.resources[path];
    }

    public getFullState(): any {
        return this.resources;
    }
}
