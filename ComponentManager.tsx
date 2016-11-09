import * as React from "react";
import * as ReactDom from "react-dom";
import RootComponentRegistry from "./RootComponentRegistry";
import RootComponent from "./component/RootComponent";
import {Container} from "./di/Container";
import Cache from "./store/Cache";

declare var window: Window;

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

    constructor(registry: RootComponentRegistry, container: Container) {
        this.container = container;
        this.registry = registry;
    }

    private container: Container;

    private registry: RootComponentRegistry;

    /**
     * initialize react component in dom.
     * @param item
     */
    public initReactComponent(item: any): void {
        let textarea = document.getElementById(item.getAttribute("data-react-id")) as HTMLTextAreaElement;
        if (textarea) {
            let props: ComponentTreeConfig = JSON.parse(textarea.value);
            if (props.wcmmode === "disabled") {
                let comp = this.registry.getComponent(props.resourceType);
                if (comp == null) {
                    console.error("React component '" + props.resourceType + "' does not exist in component list.");
                } else {
                    let cache: Cache = this.container.get("cache");
                    cache.mergeCache(props.cache);
                    let ctx: any = {registry: this.registry, componentManager: this, container: this.container};
                    ReactDom.render(<RootComponent aemContext={ctx} comp={comp} path={props.path} wcmmode={props.wcmmode}/>, item);

                }
            }
        } else {
            console.error("React config with id '" + item.getAttribute("data-react-id") + "' has no corresponding textarea element.");
        }
    }


    public getResourceType(component: React.Component<any, any>): string {
        return this.registry.getResourceType(component);
    }

    public getComponent(resourceType: string): typeof React.Component {
        return this.registry.getComponent(resourceType);
    }

    /**
     * find all root elements and initialize the react components
     */
    public initReactComponents(): void {
        let items = [].slice.call(document.querySelectorAll("[data-react]"));
        for (let item of items) {
            this.initReactComponent(item);
        }
    }

}
