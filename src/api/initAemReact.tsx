import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {ResourceInclude} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Props} from '../compatibility/Props';
import {Config} from './Registry';

export const rootRegistry = new RootComponentRegistry();

export const registerFn = (resourceType: string, config: Config<{}>) => {
  const registry = new ComponentRegistry((name: string) => resourceType);
  rootRegistry.add(registry);
};

export const defaultChildTransform = (
  nodeName: string,
  childModel: Props<{}>
) => {
  const type = childModel.resourceType;

  return <ResourceInclude key={nodeName} resourceType={type} path={nodeName} />;
};
