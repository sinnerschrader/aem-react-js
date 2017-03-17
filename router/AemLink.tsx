import * as React from "react";
import {Link} from "react-router";
import Router = ReactRouter.Router;
import LinkProps = ReactRouter.LinkProps;
import LocationDescriptor = HistoryModule.LocationDescriptor;
import {AemContext} from "../AemContext";

export default class AemLink extends React.Component<LinkProps, void> {

    public static contextTypes: any = {
        history: React.PropTypes.any,
        router: React.PropTypes.any,
        wcmmode: React.PropTypes.string,
    };

    public context: {
        wcmmode: string;
        history: any;
        router: any;
        aemContext: AemContext;
    };

    public isWcmEnabled(): boolean {
        return !this.context.wcmmode || this.context.wcmmode !== "disabled";
    }

    public handleClick(event: any): void {
        console.log("clicked");
        let router: any = this.context.router;
        let history = this.context.aemContext.container.get("history") as ReactRouter.History;
        let linkLocation: LocationDescriptor = history.createLocation(this.props.to);
        if (router && linkLocation.toString() === location.href) {//router.isActive(this.props.to, this.props.onlyActiveOnIndex)) {
            console.log("is active");
            event.preventDefault();
        }
        if (this.isWcmEnabled()) {
            event.preventDefault();
        }

    }

    public render(): React.ReactElement<Link> {
        let myProps: any = this.props;
        let handleClick = (event: any) => {
            this.handleClick(event);
        }
        return (
            <Link {...myProps} onClick={handleClick}>{this.props.children}</Link>
        );

    }

}


