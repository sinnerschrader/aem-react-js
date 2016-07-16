import * as React from "react";
import RootComponent from "./component/RootComponent";
import RootComponentRegistry from "./RootComponentRegistry";
import {AemContext} from "./AemContext";
import {ResourceProps, Resource} from "./component/ResourceComponent";
import ServerSling from "./store/ServerSling";
import container from "./di/Container";
import Cache from "./store/Cache";
import * as ReactDom from  "react-dom/server";
import {Container} from "./di/Container";

interface ServerResponse {
    html: string;
    state: string;
}

export default class ServerRenderer {

    constructor(registry: RootComponentRegistry, container: Container) {
        this.registry = registry;
        this.container = container;
        console.log("constructor " + this.container.get("javaSling"));
    }

    private registry: RootComponentRegistry;

    private container: Container;


    /* render component as string.
     * @param component
     * @param props
     * @returns {string}
     */
    public renderReactComponent(path: string, resourceType: string, props: ResourceProps<Resource>): ServerResponse {

        console.log("render react on path " + path);
        let rt: string = props.resourceType;
        console.log("render react component " + rt);


        let comp: typeof React.Component = this.registry.getComponent(rt);
        if (!comp) {
            throw new Error("cannot find component for resourceType " + rt);
        }
        console.log("rendering " + rt);

        let cache: Cache = this.container.get("cache");
        cache.put(path, props.resource);
        let serverSling = new ServerSling(cache, this.container.get("javaSling"));
        this.container.register("sling", serverSling);
        let ctx: AemContext = {registry: this.registry, container: this.container};
        let html: string = ReactDom.renderToString(<RootComponent aemContext={ctx} comp={comp} {...props} />);

        return {html: html, state: JSON.stringify(cache.getFullState())};
    }

}
