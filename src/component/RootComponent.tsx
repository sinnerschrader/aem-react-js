import * as React from "react";
import {AemContext} from "../AemContext";

export interface RootComponentProps {
    comp: typeof React.Component;
    component: string;
    aemContext: AemContext;
}

export default class  RootComponent extends React.Component<RootComponentProps, any> {
    public static childContextTypes: any = {
        aemContext: React.PropTypes.any
    };

    public getChildContext(): any {
        return {
            aemContext: this.props.aemContext
        };
    }

    public render(): React.ReactElement<any> {
        return React.createElement(this.props.comp, this.props);
    }
}
