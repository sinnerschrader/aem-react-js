import * as React from 'react';
import {ModelProvider, ComponentMapping} from "@adobe/cq-react-editable-components";
import {ModelContext} from './ModelContext';

export class EasyInclude extends React.Component {

  public render(): any {

    const IncludedComponent = ComponentMapping.get(this.props.resourceType);


    return (<ModelContext.Consumer>{(model) => {
      const page_path = model.page_path;
      const data_path = model.data_path + "/" + this.props.path;
      const cq_model = model.model && model.model.items && model.model.items[this.props.path] || {};

      return (<ModelProvider page_path={page_path} data_path={data_path} cq_model={cq_model}>
        <IncludedComponent></IncludedComponent>
      </ModelProvider>)
    }}</ModelContext.Consumer>);
  }

}

