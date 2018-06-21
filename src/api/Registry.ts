import {CqModel, EditConfig} from '@adobe/cq-react-editable-components';
import * as React from 'react';

export interface Config<P> {
  componentClass: React.ComponentClass<P>;
  EditConfig: EditConfig<P>;
}

export interface IncludeProps {
  path: string;
  resourceType: string;
}
export interface Include extends React.Component<IncludeProps> {}

export type RegisterFn = (resourceType: string, config: Config<{}>) => void;

export type RenderChildrenFn = (
  nodeName: string,
  props: CqModel
) => JSX.Element[];

export interface RegistryConfig {
  renderChildren: RenderChildrenFn;
  include: React.ComponentClass<Include>;
  register: RegisterFn;
}

export class Registry {
  public static Include: Include;
  public static init(config: RegistryConfig): void {
    Registry.config = config;
  }
  public static register(resourceType: string, config: Config<{}>): void {
    Registry.config.register(resourceType, config);
  }
  public static renderChildren(
    nodeName: string,
    model: CqModel
  ): JSX.Element[] {
    return Registry.config.renderChildren(nodeName, model);
  }
  private static config: RegistryConfig;
}
