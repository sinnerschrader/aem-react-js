import {
  Constants,
  EditConfig as AdobeEditConfig,
  MapTo,
  SpaComponentProps,
  Utils
} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import {IncludeProps} from '../ResourceInclude';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {EditConfig} from '../compatibility/EditConfig';
import {Include} from '../compatibility/Include';
import {MapVanillaTo, transform} from '../compatibility/ModelContext';
import {Compatibility, Config} from './Compatibility';
import {mapping} from './Mapping';
import {SpaPage} from './SpaPage';

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
    const props: SpaComponentProps = {
      cq_model_data_path: dataPath,
      cq_model_page_path: pagePath,
      cq_model: undefined
    };

    ReactDom.render(<SpaPage {...props} />, el);
  }

  public startComponent<P>(
    Component: React.ComponentClass<P>,
    el: HTMLElement
  ): void {
    const C = MapTo('anonymuous root')(SpaPage, null);

    ReactDom.render(<C />, el);
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

const fixEditConfig = (editConfig: EditConfig<{}>): AdobeEditConfig => {
  const adobeEditConfig: AdobeEditConfig = {...editConfig};
  /*tslint:disable-next-line*/
  adobeEditConfig.isEmpty = function(): boolean {
    /*tslint:disable-next-line*/
    const that = this;

    return editConfig.isEmpty(transform(that.props));
  };

  return adobeEditConfig;
};

export const initAemSpa = (): AemSpaCompatibility => {
  Object.keys(mapping).forEach((type: string) => {
    const config = mapping[type];
    MapVanillaTo(type, config.componentClass, fixEditConfig(config.editConfig));
  });

  return new AemSpaCompatibility();
};
