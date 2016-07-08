import Sling from "./Sling";


interface ResourceResolver {
    getResource(path: string): Resource;
}

export default class ServerSling implements Sling {
    private resourceResolver: ResourceResolver;

    public subscribe(listener: ResourceComponent, path: string, options?: any): void {
        let resource: Resource = this.resourceResolver.getResource(path);
        listener.changedResource(resource);
    }

}
