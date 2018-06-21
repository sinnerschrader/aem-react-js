import {
  EditConfig,
  SpaComponentProps
} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {MapVanillaTo} from './ModelContext';
import {Props} from './Props';
import {renderChildren} from './renderChildren';

const ContainerEditConfig: EditConfig<SpaComponentProps> = {
  dragDropName: 'container',

  emptyLabel: 'Container',

  isEmpty(props: SpaComponentProps): boolean {
    return !props || !props.cq_model[':items'];
  }
};

class EasyContainer extends React.Component<Props<{}>> {
  public render(): any {
    return (
      <div>
        <h1>children</h1>
        {this.children}
      </div>
    );
  }

  private get children(): JSX.Element[] {
    return renderChildren(this.props);
  }
}

MapVanillaTo(
  'we-retail-journal/global/components/container',
  EasyContainer,
  ContainerEditConfig
);
