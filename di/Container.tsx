import {Cq} from "../references";
import ServiceProxy from "./ServiceProxy";
declare var Cqx: Cq;
/**
 * a container for sharing global services and other objects like the cache.
 * Also provides access to the Java API.
 *
 * TODO add cache as a separate field instead of another object in the container.
 */
export class Container {

    private services: any;

    constructor() {
        this.services = {};
    }

    /**
     * add an object to the container
     * @param name
     * @param service
     */
    public register(name: string, service: any): void {
        this.services[name] = service;
    }

    /**
     * retrieve object from container
     * @param name
     * @returns {any}
     */
    public get(name: string): any {
        return this.services[name];
    }

    /**
     *
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    public getOsgiService(name: string): ServiceProxy {
        return new ServiceProxy(this.get("cache"), (): any => {
            return Cqx.getOsgiService(name);
        }, name);
    }

    /**
     * get a sling mdoel adapted from request
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    public getRequestModel(path: string, name: string): ServiceProxy {
        return new ServiceProxy(this.get("cache"), (): any => {
            return Cqx.getRequestModel(name);
        }, path + "_" + name);
    }

    /**
     * get a sling mdoel adapted from current resource
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    public getResourceModel(path: string, name: string): ServiceProxy {
        return new ServiceProxy(this.get("cache"), (): any => {
            return Cqx.getResourceModel(name);
        }, path + "_" + name);
    }


}

