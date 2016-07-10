import * as React from "react";
import * as ReactDom from 'react-dom';
import CqUtils from "./CqUtils";
import AemComponent from "./component/AemComponent";
import RootComponentRegistry from "./RootComponentRegistry";
import RootComponent from "./component/RootComponent";
import {Resource} from "./component/ResourceComponent";
import {ClientAemContext} from "./AemContext";

declare var window: Window;

/**
 * An Instance wraps a root aem component and provides methods to rerender the component.
 */
export class Instance {
    public path: string;
    public component: AemComponent<any, any>;
    public node: any;
    public props: any;
    public componentClass: any;
    public aemContext: ClientAemContext;

    /**
     * rerender the component
     * @param extraProps extra props are merged into existing props
     */
    public rerender(extraProps: any): void {
        let newProps: any = {};
        Object.keys(this.props).forEach((key: string) => {
            newProps[key] = this.props[key];
        });
        Object.keys(extraProps).forEach((key: string) => {
            newProps[key] = extraProps[key];
        });

        ReactDom.render(<RootComponent aemContext={this.aemContext} comp={this.componentClass} {...newProps} />, this.node);
    }

    /**
     * reload the jcr:node from server and rerender component.
     */
    public reload(): void {
        let origin: string = window.location.origin;
        // TODO props.depth should be replaced by special suffix so loading of json can be customized in java class.
        let url: string = origin + this.props.path + "." + this.props.depth + ".json";
        (window as FetchWindow).fetch(url, {credentials: "same-origin"}).then((response: any) => {
            return response.json();
        }).then((resource: any) => {
            this.rerenderByResource(resource);
        });

    }

    /**
     * rerender this instance with the new resource
     * @param resource
     */
    public rerenderByResource(resource: Resource): void {
        this.rerender({resource: resource});
    }
}

// TODO: find proper typing and add polyfill
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}

class EditableState {
    public initialized: boolean;
    private editable: any;

    constructor(editable: any) {
        this.editable = editable;
        this.initialized = this.isVisible();
    }

    public isVisible(): boolean {
        return this.editable.element.dom.getBoundingClientRect().width > 0;
    }

    public initialize(): void {
        this.editable.show();
        this.initialized = true;
    }

    public refresh(): void {
        this.editable.refresh();
    }

    public tryToInitialize(): boolean {
        if (!this.initialized && this.isVisible()) {
            this.initialize();
            return true;
        } else {
            return false;
        }
    }


}

/**
 * The Component
 */
export default class ComponentManager {

    constructor(registry: RootComponentRegistry) {
        this.instances = {} as {[path: string]:  Instance};
        // TODO fix the dependencies
        CqUtils.on("wcmmodechange", this.onWcmModeChange, this);
        this.registry = registry;
    }

    private registry: RootComponentRegistry;

    private instances: {[path: string]: Instance};

    private editables: {[path: string]: EditableState};


    /**
     * initialize specific component located in dom.
     * TODO properly destroy instance that is replaced.
     * @param id
     */
    public updateComponent(id: string): void {
        let item: any = document.querySelectorAll("[data-react-id='" + id + "']");
        if (item && item.length > 0) {
            this.initReactComponent(item[0]);
        }
    }

    public onWcmModeChange(wcmmode: string): void {
        Object.keys(this.instances).forEach((path: string) => {
            this.instances[path].rerender({wcmmode: wcmmode});
        }, this);
    }

    /**
     * register a component and create an associated instance.
     * Called from Component's componentDidMount. Will be a noop if
     * the associated instance does not exist. Therefore component must provide path property.
     * // TODO this only makes sense for root Components?!
     * @param component
     */
    public addComponent(component: React.Component<any, any>): void {
        // TODO fix component type - should be ResourceComponent
        let instance: Instance = this.instances[component.props.path];
        if (instance) {
            instance.component = component as AemComponent<any, any>;

        }
    }


    /**
     * add instance for root component
     * @param path
     * @param componentClass
     * @param props
     * @param node
     */
    public addInstance(path: string, componentClass: any, props: any, node: any): void {
        let instance: Instance = new Instance();
        instance.props = props;
        instance.node = node;
        instance.componentClass = componentClass;
        instance.aemContext = {registry: this.registry, componentManager: this};
        this.instances[path] = instance;
    }

    /**
     * find instance for path.
     * @param path
     * @returns {Instance}
     */
    public getInstance(path: string): Instance {
        return this.instances[path];
    }

    /**
     * find nistances that are nested in the instance given by püath
     * @param path
     * @returns {any}
     */
    public getNestedInstances(path: string): [Instance] {
        let nested: [Instance] = [] as [Instance];
        Object.keys(this.instances).forEach((instancePath: string) => {
            let instance: Instance = this.instances[instancePath];
            let subPath: boolean = instancePath && instancePath.length > path.length && instancePath.substring(0, path.length) === path;
            if (instance.props.root && subPath) {
                nested.push(instance);
            }
        }, this);
        return nested;
    }


    /**
     * initialize react component in dom.
     * @param item
     */
    public initReactComponent(item: any): void {
        let textarea = document.getElementById(item.getAttribute("data-react-id")) as HTMLTextAreaElement;
        if (textarea) {
            let props = JSON.parse(textarea.value);
            props.root = true;
            let comp = this.registry.getComponent(props.resource["sling:resourceType"]);
            if (comp == null) {
                console.error("React component '" + props.component + "' does not exist in component list.");
            } else {
                console.log("Rendering react component '" + props.component + "'.");
                let ctx: ClientAemContext = {registry: this.registry, componentManager: this};
                ReactDom.render(<RootComponent aemContext={ctx} comp={comp} {...props} />, item);
                this.addInstance(props.path, comp, props, item);

            }
        } else {
            console.error("React config with id '" + item.getAttribute("data-react-id") + "' has no corresponding textarea element.");
        }
    }

    /**
     * reload the instance
     * @param path
     */
    public reloadComponent(path: string): void {
        let instance: Instance = this.instances[path];
        instance.reload();
    }

    /**
     * get instance wrapping this resource path
     * @param path
     * @returns {Instance}
     */
    public getParentInstance(path: string): Instance {
        let parts: string[] = path.split("/");
        let parent: Instance = this.instances[path];
        while (parts.length > 0 && parent == null) {
            parts.pop();
            path = parts.join("/");
            parent = this.instances[path];
        }
        return parent;
    }

    /**
     * relod the instance
     * @param path component inside the instance
     */
    public reloadRoot(path: string): void {
        this.getParentInstance(path).reload();
    }

    public getResourceType(component: React.Component<any, any>): string {
        return this.registry.getResourceType(component);
    }

    public getComponent(resourceType: string): typeof React.Component {
        return this.registry.getComponent(resourceType);
    }

    /**
     * reload the instance via CQ. Make sure that a new editable is created.
     * @param path
     */
    public reloadRootInCq(path: string): void {
        let parent: Instance = this.getParentInstance(path);
        let parentPath: string = parent.props.path;
        // TODO why this timeout
        setTimeout(() => {
            CqUtils.removeEditable(path);
        }, 0);

        let editable = this.editables[parentPath];
        this.editables = {};
        editable.refresh();
        // TODO needs to be done when the new editables are actually created (makeEditable)
    }


    /**
     * find all root elements and initialize the react components
     */
    public initReactComponents(): void {
        this.editables = {};
        CqUtils.on("editablesready", this.initializeEditablesState.bind(this), this);
        // currently we reinitialize all editables.
        CqUtils.on("editableready", this.updateEditables.bind(this), this);

        let items = [].slice.call(document.querySelectorAll("[data-react]"));
        console.log(items.length + " react configs found.");
        for (let item of items) {
            this.initReactComponent(item);
        }
    }

    /**
     * rerender nested instances of path with cqHidden set to !visible
     * @param path
     * @param visible
     */
    public setNestedInstancesVisible(path: string, visible: boolean): void {
        if (typeof window !== "undefined") {
            // timeout necessary to make sure that nested instances are ready. This may be called during rendering of react component.
            // TODO improve timing by removing setTimeout
            if (visible) {
                this.updateEditablesState();
            }
            setTimeout(function (): void {
                this.getNestedInstances(path).forEach((instance: Instance) => {
                    instance.rerender({cqHidden: !visible});
                });
            }.bind(this), 0);
        }
    }


    private updateEditables(): void {
        this.initializeEditablesState();
        this.updateEditablesState();
    }

    private updateEditablesState(): void {
        Object.keys(this.editables).forEach((path: string) => {
            this.editables[path].tryToInitialize();
        }, this);
    }

    private initializeEditablesState(): void {
        let editables: {[path: string]: any} = CqUtils.getEditables();
        Object.keys(editables).forEach((path: string) => {
            let editable: any = editables[path];
            if (editable) {
                this.editables[path] = new EditableState(editable);
            }
        }, this);
    }


}
