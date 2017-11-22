import * as React from 'react';
import {ResourceUtils} from './ResourceUtils';
import {AemComponent} from './component/AemComponent';
import {IncludeOptions} from './store/Sling';

export interface IncludeProps {
  readonly path: string;
  readonly resourceType: string;
  readonly element?: string;
  readonly className?: string;
  readonly hidden?: boolean;
  readonly options?: IncludeOptions;
  readonly attrs?: any;
  readonly extraProps?: any;
}

export class ResourceInclude extends AemComponent<IncludeProps, any> {
  public render(): React.ReactElement<any> {
    const componentClass = this.getRegistry().getComponent(
      this.props.resourceType
    );

    if (!!componentClass) {
      const finalProps = {
        extraProps: this.props.extraProps,
        path: this.props.path
      };

      return React.createElement(componentClass, finalProps);
    } else {
      let innerHTML: string;

      const path: string = ResourceUtils.isAbsolutePath(this.props.path)
        ? this.props.path
        : `${this.getPath()}/` + this.props.path;

      const sling = this.context.aemContext.container.sling;

      innerHTML = sling.includeResource(
        path,
        this.props.resourceType,
        this.props.options || {}
      );

      const id: string = this.getContainer().textPool.put(
        innerHTML,
        this.context.root
      );

      return React.createElement(this.props.element || 'div', {
        ...this.props.attrs,
        className: this.props.className,
        dangerouslySetInnerHTML: {__html: innerHTML},
        hidden: !!this.props.hidden,
        id
      });
    }
  }
}
