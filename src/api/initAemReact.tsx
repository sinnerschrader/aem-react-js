import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {IncludeProps, ResourceInclude} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Compatibility, Config} from './Compatibility';
import {mapping} from './Mapping';

export interface CompatibilityConfig {
  // renderChildren: RenderChildrenFn;
  include: React.ComponentClass<IncludeProps>;
  dndContainer: React.ComponentClass<IncludeProps>;
  isInEditor(): boolean;
}

export class AemReactCompatibility implements Compatibility {
  private config: CompatibilityConfig;

  public get include(): React.ComponentClass<IncludeProps> {
    return this.config.include;
  }
  public get dndContainer(): React.ComponentClass<IncludeProps> {
    return this.config.dndContainer;
  }
  public init(config: CompatibilityConfig): void {
    this.config = config;
  }
  public isInEditor(): boolean {
    return this.config.isInEditor();
  }
}

export const initAemReact = (
  rootRegistry: RootComponentRegistry,
  inEditor: boolean
): AemReactCompatibility => {
  const registerFn = (type: string, options: Config<{}>) => {
    const registry = new ComponentRegistry((name: string) => name);
    registry.registerVanilla({
      component: options.componentClass,
      shortName: type,
      editConfig: options.editConfig
    });
    rootRegistry.add(registry);
  };

  Object.keys(mapping).forEach((key: string) => {
    registerFn(key, mapping[key]);
  });

  rootRegistry.init();

  // const renderChildrenFn = (nodeName: string, model: {}) => JSX.Element[];

  class DndContainer extends React.Component<IncludeProps> {
    public render(): JSX.Element {
      return (
        <ResourceInclude
          path={this.props.path}
          resourceType={this.props.resourceType}
          className={this.props.className}
        />
      );
    }
  }

  const r = new AemReactCompatibility();
  r.init({
    include: ResourceInclude,
    dndContainer: DndContainer,
    isInEditor: () => inEditor
  });

  return r;
};
