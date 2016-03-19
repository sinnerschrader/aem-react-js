import * as React from "react";
import AemComponent from "./AemComponent";
import EditDialog from "./EditDialog";

export interface Resource {
    "sling:resourceType": string;
}

export interface ResourceState {
    absolutePath: string;
    resource: Resource;
}

export interface ResourceProps<C> {
    resource?: C;
    component?: string;
    path: string;
    root?: boolean;
    wcmmode?: string;
    cqHidden?: boolean;
}


/**
 * Provides base functionality for components that are
 */
export class ResourceComponent<C extends Resource, P extends ResourceProps<any>, S extends ResourceState> extends AemComponent<P, S> {


    public static ABSOLUTE_PATH_PATTERN: RegExp = /^\//;

    public static childContextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        resource: React.PropTypes.any, //
        cqHidden: React.PropTypes.bool
    };


    public getChildContext(): any {
        return {
            resource: this.getResource(), wcmmode: this.getWcmmode(), path: this.getPath(), cqHidden: this.isCqHidden()
        };

    }

    public componentWillMount(): void {
        this.initialize();
    }

    public componentDidUpdate(prevProps: ResourceProps<any>): void {
        if (this.props.path && this.props.path !== prevProps.path) {
            this.initialize();
        }
    }

    public initialize(): void {
        let absolutePath: string;
        let resource: Resource;
        if (this.props.path) {
            if (ResourceComponent.ABSOLUTE_PATH_PATTERN.test(this.props.path)) {
                absolutePath = this.props.path;
                this.loadResource(absolutePath);
            } else {
                absolutePath = this.context.path + "/" + this.props.path;
                resource = this.context.resource[this.props.path];
            }

        } else {
            absolutePath = this.context.path;
            resource = this.context.resource;
        }
        this.setState(({absolutePath: absolutePath, resource: resource} as S));
    }

    public loadResource(path: string): void {

    }

    public getWcmmode(): string {
        return this.props.wcmmode || this.context.wcmmode;
    }

    public isCqHidden(): boolean {
        return this.props.cqHidden || this.context.cqHidden;
    }


    public getPath(): string {
        return this.state.absolutePath;
    }

    public componentDidMount(): void {
        this.context.aemContext.componentManager.addComponent(this);
    }


    public render(): React.ReactElement<any> {
        if (this.isWcmEditable() && this.props.root !== true) {
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

    public createNewChildNodeNames(prefix: String, count: number): string[] {
        let newNodeNames: string[] = [];
        let existingNodeNames: string[] = Object.keys(this.getChildren());

        for (let idx: number = 0; idx < count; idx++) {
            let nodeName: string = null;
            let index: number = idx;
            while (nodeName === null || existingNodeNames.indexOf(nodeName) >= 0) {
                nodeName = prefix + "_" + (index++);
            }
            newNodeNames.push(nodeName);
            existingNodeNames.push(nodeName);
        }
        return newNodeNames;
    }

}
