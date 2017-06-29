import * as React from 'react';
import {Link, LinkProps, Router} from 'react-router';
import {AemContext} from '../AemContext';
import {History, LocationDescriptorObject} from 'history';

export class AemLink extends React.Component<LinkProps, {}> {
  public static contextTypes: any = {
    aemContext: React.PropTypes.any,
    history: React.PropTypes.any,
    router: React.PropTypes.any,
    wcmmode: React.PropTypes.string
  };

  public context: {
    wcmmode: string;
    history: any;
    router: any;
    aemContext: AemContext;
  };

  public isWcmEnabled(): boolean {
    return !this.context.wcmmode || this.context.wcmmode !== 'disabled';
  }

  protected isClickable(
    targetLocation: LocationDescriptorObject,
    router: Router
  ): boolean {
    return targetLocation.pathname !== window.location.pathname;
  }

  public handleClick(event: any): void {
    let router: any = this.context.router;
    let history = this.context.aemContext.container.get('history') as History;
    let targetLocation: LocationDescriptorObject = history.createLocation(
      this.props.to
    );

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
      <Link {...myProps} onClick={handleClick}>
        {this.props.children}
      </Link>
    );
  }
}
