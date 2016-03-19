import * as React from "react";
import {ResourceComponent} from "./ResourceComponent";


export abstract class VanillaWrapper extends ResourceComponent<any, any, any> {

    public renderBody(): React.ReactElement<any> {
        let componentClass: typeof React.Component = this.props.component;
        return React.createElement(componentClass, this.getResource());
    }

    protected getDepth(): number {
        return this.props.depth;
    }

}
