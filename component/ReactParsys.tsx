import * as React from "react";
import ResourceUtils from "../ResourceUtils";
import {ResourceComponent, Resource, ResourceProps} from "./ResourceComponent";
import {ResourceInclude} from "../include";

export interface ReactParsysProps extends ResourceProps {
    className?: string;
    elementName?: string;
    childClassName?: string;
    childElementName?: string;
}


export default class ReactParsys extends ResourceComponent<Resource, ReactParsysProps, any> {

    public renderBody(): React.ReactElement<any> {

        let children: React.ReactElement<any>[] = this.renderChildren(this.getResource(), this.getPath(), this.props.childClassName, this.props.childElementName);
        return React.createElement(this.props.elementName || "div", {className: this.props.className}, children);
    }

    protected getDepth(): number {
        return 1;
    }

}
