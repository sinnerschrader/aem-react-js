import * as React from "react";
import {ResourceComponent, Resource, ResourceProps} from "./ResourceComponent";

export interface ReactParsysProps extends ResourceProps {
    className?: string;
    elementName?: string;
    childClassName?: string;
    childElementName?: string;
}

export class ReactParsys extends ResourceComponent<Resource, ReactParsysProps, any> {
    public renderBody(): React.ReactElement<any> {
        let children:  React.ReactElement<any>[] = this.renderChildren(null, this.props.childClassName, this.props.childElementName);

        return React.createElement(this.props.elementName || "div" as any, {className: this.props.className}, children);
    }

    protected getDepth(): number {
        return 1;
    }
}
