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

export type includeFn = (path: string, resourceType: string) => JSX.Element;

export type RenderChildrenFn = (
  nodeName: string,
  props: CqModel
) => JSX.Element[];

export interface RegistryConfig {
  // renderChildren: RenderChildrenFn;
  include: React.ComponentClass<IncludeProps>;
  register: RegisterFn;
  dndContainer: React.ComponentClass<IncludeProps>;
  isInEditor(): boolean;
}

export class Registry {
  private config: RegistryConfig;
  private inEditor: boolean = false;
  public get include(): React.ComponentClass<IncludeProps> {
    return this.config.include;
  }
  public get dndContainer(): React.ComponentClass<IncludeProps> {
    return this.config.dndContainer;
  }
  public init(config: RegistryConfig): void {
    this.config = config;
  }
  public isInEditor(): boolean {
    return this.config.isInEditor ? this.config.isInEditor() : this.inEditor;
  }
  public register(resourceType: string, config: Config<{}>): void {
    this.config.register(resourceType, config);
  }
  public setIsInEditor(isInEditor: boolean): void {
    this.inEditor = isInEditor;
  }
  // public renderChildren(nodeName: string, model: CqModel): JSX.Element[] {
  //   return this.config.renderChildren(nodeName, model);
  // }
}
