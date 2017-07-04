import * as React from 'react';
import {AemContext} from '../AemContext';

export interface RootComponentProps {
  comp: React.ComponentClass<any>;
  aemContext: AemContext;
  path: string;
  renderRootDialog?: boolean;
  wcmmode?: string;
}

export class RootComponent extends React.Component<RootComponentProps, any> {
  public static childContextTypes: any = {
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
