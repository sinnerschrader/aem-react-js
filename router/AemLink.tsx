import * as React from "react";
import {Link} from "react-router";
import * as PropTypes from "prop-types";
import Router = ReactRouter.Router;
import LinkProps = ReactRouter.LinkProps;
import {AemContext} from "../AemContext";
import LocationDescriptorObject = HistoryModule.LocationDescriptorObject;

export default class AemLink extends React.Component<LinkProps, void> {

    public static contextTypes: any = {
        aemContext: PropTypes.any,
        history: PropTypes.any,
        router: PropTypes.any,
        wcmmode: PropTypes.string,
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

    protected isClickable(targetLocation: LocationDescriptorObject, router: Router): boolean {
        return targetLocation.pathname !== window.location.pathname;
    }

    public handleClick(event: any): void {
        let router: any = this.context.router;
        let history = this.context.aemContext.container.get("history") as ReactRouter.History;
        let targetLocation: LocationDescriptorObject = history.createLocation(this.props.to);
        if (router && !this.isClickable(targetLocation, router)) {
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
        };
        return (
            <Link {...myProps} onClick={handleClick}>{this.props.children}</Link>
        );

    }

}
