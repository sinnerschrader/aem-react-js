import {CqModel} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {EditConfig} from '../compatibility/EditConfig';

export interface Config<P> {
  componentClass: React.ComponentClass<P>;
  editConfig?: EditConfig<P>;
}

export interface IncludeProps {
  path: string;
  resourceType: string;
  className?: string;
}
export interface Include extends React.Component<IncludeProps> {}

export type includeFn = (path: string, resourceType: string) => JSX.Element;

export type RenderChildrenFn = (
  nodeName: string,
  props: CqModel
) => JSX.Element[];

export interface Compatibility {
  include:
    | React.ComponentClass<IncludeProps>
    | React.StatelessComponent<IncludeProps>;
  dndContainer:
    | React.ComponentClass<IncludeProps>
    | React.StatelessComponent<IncludeProps>;
  isInEditor(): boolean;
}
