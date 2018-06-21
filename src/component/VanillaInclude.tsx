import * as React from 'react';
import {Props} from '../compatibility/Props';
import {AemComponent} from './AemComponent';

export interface VanillaProps<P> {
  readonly component: React.ComponentClass<Props<P>>;
  readonly path: string;
  readonly extraProps?: Partial<P>;
}

export class VanillaInclude<P> extends AemComponent<VanillaProps<P>, any> {
  public render(): React.ReactElement<any> {
    const componentClass = this.getRegistry().getVanillaWrapper(
      this.props.component
    );

    return React.createElement(componentClass, {
      extraProps: this.props.extraProps,
      path: this.props.path
    });
  }
}
