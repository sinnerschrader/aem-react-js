import * as React from "react";
import {Link, Router, LinkProps} from "react-router";
import * as PropTypes from "prop-types";
import {AemContext} from "../AemContext";
import {History, Location, LocationDescriptor} from 'history';

export default class AemLink extends React.Component<LinkProps> {

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

    protected isClickable(targetLocation: Location, router: Router): boolean {
        return targetLocation.pathname !== window.location.pathname;
    }

    public handleClick(event: any): void {
        let router: any = this.context.router;
        let history = this.context.aemContext.container.get("history") as History;
        let to = this.props.to as LocationDescriptor;
        let targetLocation: Location = history.createLocation(to);
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
