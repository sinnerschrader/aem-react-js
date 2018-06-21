import * as React from 'react';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Include} from '../compatibility/Include';
import {MapVanillaTo} from '../compatibility/ModelContext';
import {Props} from '../compatibility/Props';
import {Config} from './Registry';

export const rootRegistry = new RootComponentRegistry();

export const registerFn = (resourceType: string, config: Config<{}>) => {
  MapVanillaTo(resourceType, config.componentClass, config.EditConfig);
};

export const defaultChildTransform = (
  nodeName: string,
  childModel: Props<{}>
) => {
  const type = childModel.resourceType;

  return <Include key={nodeName} resourceType={type} path={nodeName} />;
};
