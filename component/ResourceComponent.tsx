import * as React from "react";
import AemComponent from "./AemComponent";
import EditDialog from "./EditDialog";
import {Sling} from "../store/Sling";
import RootComponentRegistry from "../RootComponentRegistry";
import ResourceUtils from "../ResourceUtils";
import {ResourceInclude} from "../include";

export interface Resource {
    "sling:resourceType": string;
}

export enum STATE {
    LOADING, LOADED, FAILED
}

export interface ResourceState {
    absolutePath: string;
    resource?: any;
    state: STATE;
}

export interface ResourceProps {
    path: string;
    root?: boolean;
    wcmmode?: string;
    className?: string;
}


/**
 * Provides base functionality for components that are
 */
export abstract class ResourceComponent<C extends Resource, P extends ResourceProps, S extends ResourceState> extends AemComponent<P, S> {

    public static childContextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
    };

    public getChildContext(): any {
        return {
            wcmmode: this.getWcmmode(), path: this.getPath()
        };

    }

    public componentWillMount(): void {
        this.initialize();
    }

    public componentDidUpdate(prevProps: ResourceProps): void {
        this.initialize();
    }

    public initialize(): void {
        let absolutePath: string;
        if (ResourceUtils.isAbsolutePath(this.props.path)) {
            absolutePath = this.props.path;
        } else {
            absolutePath = this.context.path + "/" + this.props.path;
        }
        if (absolutePath !== this.getPath()) {
            this.setState(({absolutePath: absolutePath, state: STATE.LOADING} as S));
            (this.getAemContext().container.get("sling") as Sling).subscribe(this, absolutePath, {depth: this.getDepth()});
        }

    }

    public getWcmmode(): string {
        return this.props.wcmmode || this.context.wcmmode;
    }

    public getPath(): string {
        if (typeof this.state !== "undefined" && this.state !== null) {
            return this.state.absolutePath;
        } else {
            return null;
        }
    }

    protected renderLoading(): React.ReactElement<any> {
        return (<span>Loading</span>);
    }

    public render(): React.ReactElement<any> {
        let child: React.ReactElement<any>;
        if (this.state.state === STATE.LOADING) {
            child = this.renderLoading();
        } else if (!!this.props.root) {
            return this.renderBody();
        } else {
            child = this.renderBody();
        }
        return (
            <EditDialog path={this.getPath()} resourceType={this.getResourceType()} className={this.props.className}>
                {child}
            </EditDialog>
        );
    }

    public getRegistry(): RootComponentRegistry {
        return this.context.aemContext.registry;
    }

    public abstract renderBody(): React.ReactElement<any>;

    public getChildren(): any {
        let resource: any = this.state.resource;
        let children: any = {};
        Object.keys(resource).forEach((propertyName: string): void => {
            let child = resource[propertyName];
            if (child["jcr:primaryType"]) {
                children[propertyName] = child;
            }
        });
        return children;
    }

    public getResource(): C {
        return (this.state.resource as C);
    }

    public getResourceType(): string {
        return this.context.aemContext.registry.getResourceType(this);
    }

    public changedResource(path: string, resource: C): void {
        this.setState(({state: STATE.LOADED, resource: resource, absolutePath: path}) as any);
    }

    protected getDepth(): number {
        return 0;
    }

    protected renderChildren(content: Resource, path: string, childClassName?: string, childElementName?: string): React.ReactElement<any>[] {

        let children: any = ResourceUtils.getChildren(content);

        let childComponents: React.ReactElement<any>[] = [];

        // TODO alternatively create a div for each child and set className/elementName there

        Object.keys(children).forEach((nodeName: string, childIdx: number) => {
            let resource: Resource = children[nodeName];
            let resourceType: string = resource["sling:resourceType"];
            let componentType: typeof React.Component = this.getRegistry().getComponent(resourceType);
            if (childElementName) {
                if (componentType) {
                    let props: any = {resource: resource, path: nodeName, reactKey: path, key: nodeName};
                    childComponents.push(React.createElement(childElementName, {
                        key: nodeName, className: childClassName
                    }, React.createElement(componentType, props)));
                } else {
                    childComponents.push(React.createElement(childElementName, {
                        key: nodeName, className: childClassName
                    }, React.createElement(ResourceInclude, {path: nodeName, key: nodeName, resourceType: resourceType})));
                }
            } else {
                if (componentType) {
                    let props: any = {resource: resource, path: nodeName, reactKey: path, key: nodeName, className: childClassName};
                    childComponents.push(React.createElement(componentType, props));
                } else {
                    childComponents.push(<ResourceInclude path={nodeName} key={nodeName} resourceType={resourceType}></ResourceInclude>);
                }
            }
        }, this);

        let newZone: React.ReactElement<any> = null;
        if (this.isWcmEnabled()) {
            let resourceType = "foundation/components/parsys/new";
            newZone = <ResourceInclude key="newZone" element="div" path="*"
                                       resourceType={ resourceType }></ResourceInclude>;
            childComponents.push(newZone);
        }
        return childComponents;
    }
}
