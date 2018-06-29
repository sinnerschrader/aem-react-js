import {
  ComponentMapping,
  Constants,
  MapTo,
  SpaComponentProps,
  Utils
} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {IncludeProps} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Include} from '../compatibility/Include';
import {MapVanillaTo} from '../compatibility/ModelContext';
import {Compatibility, Config} from './Compatibility';
import {mapping} from './Mapping';

export const rootRegistry = new RootComponentRegistry();

export const registerFn = (resourceType: string, config: Config<{}>) => {
  MapVanillaTo(resourceType, config.componentClass, config.editConfig);
};

export class AemSpaCompatibility implements Compatibility {
  public get include(): React.ComponentClass<IncludeProps> {
    return Include;
  }

  public start(
    pagePath: string,
    dataPath: string,
    type: string,
    el: HTMLElement
  ): void {
    const Com = ComponentMapping.get(type);
    const props: SpaComponentProps = {
      cq_model_data_path: dataPath,
      cq_model_page_path: pagePath,
      cq_model: null
    };
    ReactDom.render(<Com {...props} />, el);
  }

  public map(c: React.ComponentClass): React.ComponentClass {
    return MapTo('bullshit')(c, null);
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
}

export const initAemSpa = (): AemSpaCompatibility => {
  Object.keys(mapping).forEach((type: string) => {
    const config = mapping[type];
    MapVanillaTo(type, config.componentClass, config.editConfig);
  });

  return new AemSpaCompatibility();
};
