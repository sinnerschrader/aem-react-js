import * as React from 'react';
import {Resource, ResourceComponent, ResourceProps} from './ResourceComponent';

export interface ReactParsysProps extends ResourceProps {
  className?: string;
  elementName?: string;
  childClassName?: string;
  childElementName?: string;
}

export class ReactParsys extends ResourceComponent<
  Resource,
  ReactParsysProps,
  any
> {
  public renderBody(): React.ReactElement<any> {
    const children: React.ReactElement<any>[] = this.renderChildren(
      null,
      this.props.childClassName,
      this.props.childElementName
    );

    return React.createElement(
      this.props.elementName || ('div' as any),
      {className: this.props.className},
      children
    );
  }

  protected getDepth(): number {
    return 1;
  }
}
