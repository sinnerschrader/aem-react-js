import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {IncludeProps, ResourceInclude} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Config, Registry} from './Registry';

export const initAemReact = (rootRegistry: RootComponentRegistry) => {
  const registerFn = (type: string, options: Config<{}>) => {
    const registry = new ComponentRegistry((name: string) => name);
    registry.registerVanilla({
      component: options.componentClass,
      shortName: type
    });
    rootRegistry.add(registry);
  };

  // const renderChildrenFn = (nodeName: string, model: {}) => JSX.Element[];

  class DndContainer extends React.Component<IncludeProps> {
    public render(): JSX.Element {
      return (
        <ResourceInclude
          path={this.props.path}
          resourceType={this.props.resourceType}
        />
      );
    }
  }

  const r = new Registry();
  r.init({
    include: ResourceInclude,
    register: registerFn,
    dndContainer: DndContainer,
    isInEditor: null
  });

  return r;
};
