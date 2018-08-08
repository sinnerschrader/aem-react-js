import {
  ComponentMapping,
  CqModel,
  ModelProvider,
  SpaComponentProps
} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {ModelContext} from './ModelContext';

export interface IncludeProps {
  path: string;
  resourceType: string;
}

export class Include extends React.Component<IncludeProps> {
  public render(): any {
    const IncludedComponent = ComponentMapping.get(this.props.resourceType);
    if (!IncludedComponent) {
      return null;
    }

    return (
      <ModelContext.Consumer>
        {(model: SpaComponentProps) => {
          let page_path = model.cq_model_page_path;
          const absolutePath =
            !model.cq_model_data_path || this.props.path.match(/^\//);

          let path = this.props.path;
          if (absolutePath && this.props.path.match(/jcr:content/)) {
            const pathMatch = this.props.path.match(
              /(.*)(\.[^\.]+)*jcr:content\/(.*)/
            );
            path = pathMatch[3];
            page_path = pathMatch[1];
          }
          const data_path = absolutePath
            ? path
            : `${model.cq_model_data_path}/${path}`;

          // TODO cqModel isn't valid if path is absolute and page is different from root page
          const cq_model: CqModel =
            (model.cq_model &&
              model.cq_model[':items'] &&
              model.cq_model[':items'][path]) ||
            null;

          return (
            <ModelProvider
              page_path={page_path}
              data_path={data_path}
              cq_model={cq_model}
            >
              <IncludedComponent />
            </ModelProvider>
          );
        }}
      </ModelContext.Consumer>
    );
  }
}
