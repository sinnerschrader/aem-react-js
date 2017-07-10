import * as React from 'react';
import {ResourceUtils} from './ResourceUtils';
import {AemComponent} from './component/AemComponent';
import {Sling} from './store/Sling';

export interface IncludeProps {
  path: string;
  resourceType: string;
  element?: string;
  hidden?: boolean;
}

export class ResourceInclude extends AemComponent<IncludeProps, any> {
  public render(): React.ReactElement<any> {
    const componentClass = this.getRegistry().getComponent(
      this.props.resourceType
    );

    if (!!componentClass) {
      return React.createElement(componentClass, {path: this.props.path});
    } else {
      let innerHTML: string;

      const path: string = ResourceUtils.isAbsolutePath(this.props.path)
        ? this.props.path
        : `${this.getPath()}/` + this.props.path;

      const sling: Sling = this.context.aemContext.container.get(
        'sling'
      ) as Sling;

      innerHTML = sling.includeResource(path, this.props.resourceType);

      return React.createElement(this.props.element || ('div' as any), {
        dangerouslySetInnerHTML: {__html: innerHTML},
        hidden: !!this.props.hidden
      });
    }
  }
}
