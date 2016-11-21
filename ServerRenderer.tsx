import * as React from "react";
import RootComponent from "./component/RootComponent";
import RootComponentRegistry from "./RootComponentRegistry";
import {AemContext} from "./AemContext";
import Cache from "./store/Cache";
import * as ReactDom from  "react-dom/server";
import {Container} from "./di/Container";

export interface ServerResponse {
    html: string;
    state: string;
}

export default class ServerRenderer {

    private registry: RootComponentRegistry;

    private container: Container;

    constructor(registry: RootComponentRegistry, container: Container) {
        this.registry = registry;
        this.container = container;
    }

    /* render component as string.
     * @param component
     * @param props
     * @returns {string}
     */
    public renderReactComponent(path: string, resourceType: string, wcmmode: string): ServerResponse {

        console.log("render react on path " + path);
        console.log("render react component " + resourceType);


        let comp: typeof React.Component = this.registry.getComponent(resourceType);
        if (!comp) {
            throw new Error("cannot find component for resourceType " + resourceType);
        }

        let ctx: AemContext = {registry: this.registry, container: this.container};
        let html: string = ReactDom.renderToString(<RootComponent aemContext={ctx} comp={comp} path={path} wcmmode={wcmmode}/>);

        let cache: Cache = this.container.get("cache");
        return {html: html, state: JSON.stringify(cache.getFullState())};
    }

}
