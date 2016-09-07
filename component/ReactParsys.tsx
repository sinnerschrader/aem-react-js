import * as React from "react";
import ResourceUtils from "../ResourceUtils";
import {ResourceComponent, Resource, ResourceProps} from "./ResourceComponent";
import {ResourceInclude} from "../include";

export interface ReactParsysProps extends ResourceProps {
    className?: string;
}


export default class ReactParsys extends ResourceComponent<Resource, ReactParsysProps, any> {

    public renderBody(): React.ReactElement<any> {
        let content: any = this.getResource();

        let children: any = ResourceUtils.getChildren(content);

        let childComponents: React.ReactElement<any>[] = [];


        let className = this.props.className;
        Object.keys(children).forEach((nodeName: string, childIdx: number) => {
            let resource: Resource = children[nodeName];
            let resourceType: string = resource["sling:resourceType"];
            let componentType: typeof React.Component = this.getRegistry().getComponent(resourceType);
            let path: string = nodeName;
            if (componentType) {
                let props: any = {resource: resource, path: path, reactKey: path };
                childComponents.push(<div key={nodeName} className={className}>{React.createElement(componentType, props)}</div>);
            } else {
                childComponents.push(<div key={nodeName} className={className}><ResourceInclude path={path} resourceType={resourceType}></ResourceInclude></div>);
            }
        }, this);
        
        let newZone: React.ReactElement<any> = null;
        if (this.isWcmEnabled()) {
            let resourceType = this.getResourceType() + "/new";
            newZone = <ResourceInclude element="div" path={ this.getPath() + "/*" }
                                       resourceType={ resourceType }></ResourceInclude>;
        }
        return (
            <div>
                { childComponents }
                { newZone }
            </div>);
    }

    protected getDepth(): number {
        return 1;
    }

}
