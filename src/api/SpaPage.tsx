import {SpaComponentProps} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {Include} from '../compatibility/Include';
import {ModelContextProvider} from '../compatibility/ModelContext';

export class SpaPage extends React.Component<SpaComponentProps> {
  public render(): JSX.Element {
    return (
      <div className="root">
        <ModelContextProvider {...this.props}>
          {this.children}
        </ModelContextProvider>
      </div>
    );
  }

  private get children(): JSX.Element[] {
    if (!this.props.cq_model || !this.props.cq_model[':itemsOrder']) {
      return [];
    }

    return this.props.cq_model[':itemsOrder'].map((nodeName: string) => {
      const item = this.props.cq_model[':items'][nodeName];

      return (
        <Include key={nodeName} resourceType={item[':type']} path={nodeName} />
      );
    });
  }
}
