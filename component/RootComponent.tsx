import * as React from "react";
import {AemContext} from "../AemContext";

export interface RootComponentProps {
    comp: typeof React.Component;
    aemContext: AemContext;
    path: string;
    renderRootDialog?: boolean;
    wcmmode?: string;
}

export default class RootComponent extends React.Component<RootComponentProps, any> {
    public static childContextTypes: any = {
        aemContext: React.PropTypes.any, path: React.PropTypes.any,
    };

    public getChildContext(): any {
        return {
            aemContext: this.props.aemContext, path: this.props.path,
        };
    }

    public render(): React.ReactElement<any> {
        console.log("ROOTCOMponet render root dialog " + this.props.renderRootDialog);
        let childProps: any = {path: this.props.path, root: true, wcmmode: this.props.wcmmode, skipRenderDialog: !this.props.renderRootDialog};
        return React.createElement(this.props.comp, childProps);
    }

}
