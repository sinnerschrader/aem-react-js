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
    private cqx: Cq;

    constructor(cqx: Cq) {
        this.services = {};
        if (!cqx) {
            this.cqx = Cqx;
        } else {
            this.cqx = cqx;
        }
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
        return this.getServiceProxy(arguments, (): any => {
            return this.cqx.getOsgiService(name);
        });
    }

    /**
     * get a sling mdoel adapted from request
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    public getRequestModel(path: string, name: string): ServiceProxy {
        return this.getServiceProxy(arguments, (): any => {
            return this.cqx.getRequestModel(path, name);
        });
    }

    /**
     * get a sling mdoel adapted from current resource
     * @param name fully qualified java class name
     * @returns {ServiceProxy}
     */
    public getResourceModel(path: string, name: string): ServiceProxy {
        return this.getServiceProxy(arguments, (): any => {
            return this.cqx.getResourceModel(path, name);
        });
    }

    private getServiceProxy(args: IArguments, getter: () => any): ServiceProxy {
        return new ServiceProxy(this.get("cache"), getter, this.createKey(args));
    }

    private createKey(params: IArguments): string {
        let key: string = "";
        for (let i = 0; i < params.length; i++) {
            if (i > 0) {
                key += "_";
            }
            key += params[i];
        }
        return key;
    }


}

