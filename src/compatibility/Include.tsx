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
          const page_path = model.cq_model_page_path;
          const root = !model.cq_model_data_path;
          const data_path = root
            ? this.props.path
            : `${model.cq_model_data_path}/${this.props.path}`;
          const cq_model: CqModel =
            (model.cq_model &&
              model.cq_model[':items'] &&
              model.cq_model[':items'][this.props.path]) ||
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
