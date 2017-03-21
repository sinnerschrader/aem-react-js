import * as React from "react";
import {Route} from "react-router";
import {RouteProps} from "react-router";
import {ResourceComponent} from "../component/ResourceComponent";

export interface AemRouteProps extends RouteProps {
    resourceComponent: ResourceComponent<any, any, any>;
}

export default class AemRoute extends React.Component<AemRouteProps, void> {

    public render(): React.ReactElement<Route> {
        let props: any = this.props;
        return (
            <Route {...props} > {this.props.children} </Route>
        );
    }
}
