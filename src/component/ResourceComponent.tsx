import * as React from "react";
import AemComponent from "./AemComponent";
import EditDialog from "./EditDialog";

export interface Resource {
    "sling:resourceType": string;
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
export  abstract class ResourceComponent<C extends Resource, P extends ResourceProps<any>, S> extends AemComponent<P, S> {


    public static childContextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        resource: React.PropTypes.any, //
        cqHidden: React.PropTypes.bool
    };


    public getChildContext(): any {
        let result:any = {
            resource: this.getResource(), wcmmode: this.getWcmmode(), path: this.getPath(), cqHidden: this.isCqHidden()
        };
        return result;
    }


    public getWcmmode(): string {
        return this.props.wcmmode || (this.context ? this.context.wcmmode : null);
    }

    public isCqHidden(): boolean {
        return this.props.cqHidden || (this.context ? this.context.cqHidden : false);
    }


    public getPath(): string {
        if (this.context && this.context.path && this.props.path) {
            return this.context.path + "/" + this.props.path;
        } else if (this.props.path) {
            return this.props.path;
        } else if (this.context) {
            return this.context.path;
        }

        return '';
    }

    public componentDidMount(): void {
        if( this.context && this.context.aemContext && this.context.aemContext.componentManager ) {
            this.context.aemContext.componentManager.addComponent(this);
        }
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
        let resource = this.props.resource;
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
        if( this.props.resource ) {
            return this.props.resource;
        } else {
            if( this.context && this.context.resource && this.props.path ) {
                return this.context.resource[this.props.path]
            }
        }

        return null
    }

    public getResourceType(): string {
        if( this.context && this.context.aemContext && this.context.aemContext.registry ) {
            return this.context.aemContext.registry.getResourceType(this);
        }
        return '';
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
