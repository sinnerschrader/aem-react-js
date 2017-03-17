import * as React from "react";
import AemComponent from "./AemComponent";

export interface VanillaProps {
    component: typeof React.Component;
    path: string;
}

export default class VanillaInclude extends AemComponent<VanillaProps, any> {

    public render(): React.ReactElement<any> {
        let componentClass: typeof React.Component = this.getRegistry().getVanillaWrapper(this.props.component);
        return React.createElement(componentClass, {path: this.props.path});
    }

}
