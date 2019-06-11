import * as React from "react";
import * as ReactDom from "react-dom";
import RootComponentRegistry from "./RootComponentRegistry";
import RootComponent from "./component/RootComponent";
import {Container} from "./di/Container";
import Cache from "./store/Cache";

declare var window: Window;
declare var document: Document;

export interface ComponentTreeConfig {
    wcmmode: string;
    path: string;
    resourceType: string;
    cache: Cache;
}


/**
 * The Component
 */
export default class ComponentManager {

    private container: Container;

    private document: Document;

    private registry: RootComponentRegistry;

    constructor(registry: RootComponentRegistry, container: Container, aDocument?: Document) {
        this.container = container;
        this.registry = registry;
        this.document = aDocument || document;
    }

    /**
     * initialize react component in dom.
     * @param item
     */
        public initReactComponent(item: any, forceHydrate: boolean = false): void {
        let dataElement = this.document.getElementById(item.getAttribute("data-react-id"));
        if (dataElement) {
            let props: ComponentTreeConfig = JSON.parse(dataElement.innerHTML);
            if (forceHydrate || props.wcmmode === "disabled") {
                let comp = this.registry.getComponent(props.resourceType);
                if (comp === null) {
                    console.error("React component '" + props.resourceType + "' does not exist in component list.");
                } else {
                    let cache: Cache = this.container.get("cache");
                    cache.mergeCache(props.cache);
                    let ctx: any = {registry: this.registry, componentManager: this, container: this.container};
                    ReactDom.render(<RootComponent aemContext={ctx} comp={comp} path={props.path} wcmmode={props.wcmmode}/>, item);

                }
            }
        } else {
            console.error("React config with id '" + item.getAttribute("data-react-id") + "' has no corresponding data script element.");
        }
    }


    public getResourceType(component: any): string {
        return this.registry.getResourceType(component);
    }

    public getComponent(resourceType: string): typeof React.Component {
        return this.registry.getComponent(resourceType);
    }

    /**
     * find all root elements and initialize the react components
     */
    public initReactComponents(forceHydrate: boolean = false): number {
        let items = [].slice.call(this.document.querySelectorAll("[data-react]"));
        for (let item of items) {
            this.initReactComponent(item, forceHydrate);
        }
        return items.length;
    }

}
