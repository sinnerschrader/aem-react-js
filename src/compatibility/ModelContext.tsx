import {
  CqModel,
  MapTo,
  SpaComponentProps
} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {Props} from './Props';

export const ModelContext = React.createContext({});

export class ModelContextProvider extends React.Component<SpaComponentProps> {
  public render(): JSX.Element {
    return (
      <ModelContext.Provider value={this.props}>
        {this.props.children}
      </ModelContext.Provider>
    );
  }
}

const transformMap = (map: {[key: string]: CqModel}) => {
  if (!map) {
    return undefined;
  }
  const newMap: {[key: string]: Props<{}>} = {};
  Object.keys(map).forEach((key: string) => {
    const model = map[key];
    newMap[key] = {
      dataPath: model[':dataPath'],
      itemsOrder: model[':itemsOrder'],
      items: transformMap(model[':items']),
      resourceType: model[':type'],
      model
    };
  });

  return newMap;
};

const transform = (props: SpaComponentProps) => {
  const items = transformMap(props.cq_model[':items']);

  return {
    model: props.cq_model,
    items,
    itemsOrder: props.cq_model[':itemsOrder'],
    resourceType: props.cq_model[':type'],
    dataPath: props.cq_model_data_path,
    pagePath: props.cq_model_page_path
  };
};

export const MapVanillaTo = (
  resourceType: string,
  Component: any,
  config: any
) => {
  const WrappedComponent = (props: SpaComponentProps) => {
    const newProps: Props<object> = transform(props);

    return (
      <ModelContextProvider {...props}>
        <Component {...newProps} />
      </ModelContextProvider>
    );
  };

  return MapTo(resourceType)(WrappedComponent, config);
};
