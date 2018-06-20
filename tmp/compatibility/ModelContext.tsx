import React, {Component} from 'react';
import {Container, MapTo} from "@adobe/cq-react-editable-components";


export const ModelContext = React.createContext();

export class ModelContextProvider extends Component {

  render() {

    const model = {
      model: this.props.cq_model,
      data_path: this.props.cq_model_data_path,
      page_path: this.props.cq_model_page_path,
    };

    return (<ModelContext.Provider value={model}>{this.props.children}</ModelContext.Provider>);
  }

}

export const MapVanillaTo = (resourceType, Component, config) => {
  const WrappedComponent = (props) => {
    return (<ModelContextProvider {...props}><Component {...props}></Component></ModelContextProvider>)
  }
  return MapTo(resourceType)(WrappedComponent, config);
}
