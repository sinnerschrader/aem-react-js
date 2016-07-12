import * as React from "react";
import AemComponent from "./AemComponent";

export interface ScriptProps {
    js: string;
}

export class Script extends AemComponent<ScriptProps, any> {
    public render(): React.ReactElement<any> {
        return React.createElement("script", {dangerouslySetInnerHTML: {__html: this.props.js}});
    }
}