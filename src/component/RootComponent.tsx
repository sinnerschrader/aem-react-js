import * as React from 'react';
import {AemContext} from '../AemContext';

export interface ChildContext {
  readonly aemContext: AemContext;
  readonly path: string;
  readonly wcmmode?: string;
}

export interface ComponentProps {
  readonly path: string;
  readonly root: boolean;
  readonly skipRenderDialog: boolean;
  readonly wcmmode?: string;
}

export interface RootComponentProps {
  readonly component: React.ComponentClass<ComponentProps>;
  readonly aemContext: AemContext;
  readonly path: string;
  readonly renderRootDialog?: boolean;
  readonly wcmmode?: string;
}

export class RootComponent extends React.Component<RootComponentProps> {
  public static readonly childContextTypes: object = {
    aemContext: React.PropTypes.object.isRequired,
    path: React.PropTypes.string.isRequired,
    wcmmode: React.PropTypes.string
  };

  public getChildContext(): ChildContext {
    return {
      aemContext: this.props.aemContext,
      path: this.props.path,
      wcmmode: this.props.wcmmode
    };
  }

  public render(): JSX.Element {
    return React.createElement(this.props.component, {
      path: this.props.path,
      root: true,
      skipRenderDialog: !this.props.renderRootDialog,
      wcmmode: this.props.wcmmode
    });
  }
}
