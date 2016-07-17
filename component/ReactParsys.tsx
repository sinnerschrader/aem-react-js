import * as React from "react";
import ResourceUtils from "../ResourceUtils";
import {ResourceComponent, Resource, ResourceProps} from "./ResourceComponent";
import {ResourceInclude} from "../include";
import CqUtils from "../CqUtils";


export default class ReactParsys extends ResourceComponent<Resource, ResourceProps<Resource>, any> {

    public renderBody(): React.ReactElement<any> {
        let content: any = this.getResource();

        let children: any = ResourceUtils.getChildren(content);

        let childComponents: React.ReactElement<any>[] = [];


        Object.keys(children).forEach((nodeName: string, childIdx: number) => {
            let resource: Resource = children[nodeName];
            let resourceType: string = resource["sling:resourceType"];
            let componentType: typeof React.Component = this.getRegistry().getComponent(resourceType);
            let path: string = nodeName;
            if (componentType) {
                let props: any = {resource: resource, path: path, reactKey: path };
                childComponents.push(React.createElement(componentType, props));
            } else {
                childComponents.push(<ResourceInclude path={path} resourceType={resourceType}></ResourceInclude>);
            }
        }, this);

        if (this.isWcmEditable()) {
            let visible: boolean = !this.isCqHidden();
            CqUtils.setVisible(this.getPath() + "/*", visible, true);
        }


        let newZone: React.ReactElement<any> = null;
        if (this.isWcmEditable()) {
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
}
