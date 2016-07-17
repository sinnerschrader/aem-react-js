import * as React from "react";
import AemComponent from "./AemComponent";
import EditDialog from "./EditDialog";
import {Sling} from "../store/Sling";
import ComponentRegistry from "../ComponentRegistry";
import RootComponentRegistry from "../RootComponentRegistry";

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

export interface ResourceProps<C> {
    resource?: C;
    component?: string;
    path: string;
    root?: boolean;
    wcmmode?: string;
    cqHidden?: boolean;
    resourceType?: string;
}


/**
 * Provides base functionality for components that are
 */
export abstract class ResourceComponent<C extends Resource, P extends ResourceProps<any>, S extends ResourceState> extends AemComponent<P, S> {


    public static ABSOLUTE_PATH_PATTERN: RegExp = /^\//;

    public static childContextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        cqHidden: React.PropTypes.bool
    };


    public getChildContext(): any {
        return {
            wcmmode: this.getWcmmode(), path: this.getPath(), cqHidden: this.isCqHidden()
        };

    }

    public componentWillMount(): void {
        this.initialize();
    }

    public componentDidUpdate(prevProps: ResourceProps<any>): void {
        //if (this.props.path && this.props.path !== prevProps.path) {
        this.initialize();
        //}
    }

    public initialize(): void {
        let absolutePath: string;
        if (ResourceComponent.ABSOLUTE_PATH_PATTERN.test(this.props.path)) {
            absolutePath = this.props.path;
        } else {
            absolutePath = this.context.path + "/" + this.props.path;
        }
        if (absolutePath !== this.getPath()) {
            this.setState(({absolutePath: absolutePath, state: STATE.LOADING} as S));
            (this.getAemContext().container.get("sling") as Sling).subscribe(this, absolutePath, {depth: null});
        }

    }

    public getWcmmode(): string {
        return this.props.wcmmode || this.context.wcmmode;
    }

    public isCqHidden(): boolean {
        return this.props.cqHidden || this.context.cqHidden;
    }


    public getPath(): string {
        if (typeof this.state !== "undefined" && this.state !== null) {
            return this.state.absolutePath;
        } else {
            return null;
        }
    }

    public componentDidMount(): void {
        this.context.aemContext.componentManager.addComponent(this);
    }


    public render(): React.ReactElement<any> {
        if (this.state.state === STATE.LOADING) {
            return (<span>Loading</span>);
        } else if (this.isWcmEditable() && this.props.root !== true) {
            let editDialog: React.ReactElement<any> = this.props.root ? null : (
                <EditDialog path={this.getPath()} resourceType={this.getResourceType()}/>);
            return (
                <div>
                    {this.renderBody()}
                    {editDialog}
                </div>
            );
        } else {
            return this.renderBody();
        }
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
        console.log(" changed Resource" + resource);

        this.setState(({state: STATE.LOADED, resource: resource, absolutePath: path}) as any);
    }

}
