import {Cq} from "../references";
declare var Cqx: Cq;

export class Container {

    private services: any;

    constructor() {
        this.services = {};
    }

    public register(name: string, service: any): void {
        this.services[name] = service;
    }

    public get(name: string): any {
        return this.services[name];
    }

    public getOsgiService(name: string): any {
        return Cqx.getOsgiService(name);
    }

}

let containerInstance: Container = new Container();
export default containerInstance;


