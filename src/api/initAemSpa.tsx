import {Constants, Utils} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {IncludeProps} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Include} from '../compatibility/Include';
import {MapVanillaTo} from '../compatibility/ModelContext';
import {Compatibility, Config} from './Compatibility';

export const rootRegistry = new RootComponentRegistry();

export const registerFn = (resourceType: string, config: Config<{}>) => {
  MapVanillaTo(resourceType, config.componentClass, config.editConfig);
};

export class AemSpaCompatibility implements Compatibility {
  public get include(): React.ComponentClass<IncludeProps> {
    return Include;
  }
  public get dndContainer():
    | React.ComponentClass<IncludeProps>
    | React.StatelessComponent<IncludeProps> {
    return (props: IncludeProps) =>
      <div
        key="__new"
        className={`${Constants.NEW_SECTION_CLASS_NAMES} ${props.className}`}
        data-cq-data-path={props.path}
      />;
  }
  public isInEditor(): boolean {
    return Utils.isInEditor();
  }
  public mapTo(resourceType: string, config: Config<{}>): void {
    MapVanillaTo(resourceType, config.componentClass, config.editConfig);
  }
}

export const initAemSpa = () => new AemSpaCompatibility();
