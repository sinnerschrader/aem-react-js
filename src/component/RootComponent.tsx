import * as React from 'react';
import {AemContext} from '../AemContext';

export interface RootComponentProps {
  readonly comp: React.ComponentClass<any>;
  readonly aemContext: AemContext;
  readonly path: string;
  readonly renderRootDialog?: boolean;
  readonly wcmmode?: string;
}

export class RootComponent extends React.Component<RootComponentProps, any> {
  public static readonly childContextTypes: any = {
    aemContext: React.PropTypes.any,
    path: React.PropTypes.any
  };

  public getChildContext(): any {
    return {
      aemContext: this.props.aemContext,
      path: this.props.path
    };
  }

  public render(): React.ReactElement<any> {
    const childProps: any = {
      path: this.props.path,
      root: true,
      skipRenderDialog: !this.props.renderRootDialog,
      wcmmode: this.props.wcmmode
    };

    return React.createElement(this.props.comp, childProps);
  }
}
