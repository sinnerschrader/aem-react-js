import * as React from "react";
import * as ReactDomServer from "react-dom/server";
import RootComponent from "./component/RootComponent";
import RootComponentRegistry from "./RootComponentRegistry";
import {AemContext} from "./AemContext";
import {ResourceProps, Resource} from "./component/ResourceComponent";

export default class ServerRenderer {

    constructor(registry: RootComponentRegistry) {
        this.registry = registry;
    }

    private registry: RootComponentRegistry;


    /* render component as string.
     * @param component
     * @param props
     * @returns {string}
     */
    public renderReactComponent(resourceType: string, props: ResourceProps<Resource>): string {
        let rt: string = props.resource["sling:resourceType"];

        let comp: typeof React.Component = this.registry.getComponent(rt);
        if (!comp) {
            throw new Error("cannot find component for resourceType " + rt);
        }
        console.log("rendering " + rt );
        let ctx: AemContext = {registry: this.registry};
        return ReactDomServer.renderToString(<RootComponent aemContext={ctx} comp={comp} {...props} />);
    }

}
