declare module '@adobe/cq-react-editable-components' {
  export class Utils {
    public static isInEditor(): boolean;
  }

  type MapToFn = (component: any, config: any) => any;

  export function MapTo(resourceType: string): MapToFn;

  export class ComponentMapping {
    public static get(resourceType: string): any;
  }

  export interface SpaComponentProps {
    cq_model: CqModel;
    cq_model_data_path: string;
    cq_model_page_path: string;
  }

  export interface CqModel {
    ':type': string;
    ':dataPath'?: string;
    ':items': {[nodeName: string]: CqModel};
    ':itemsOrder': string[];
  }

  export interface ModelProviderProps {
    page_path: string;
    data_path: string;
    cq_model: CqModel;
  }

  export class ModelProvider extends React.Component<ModelProviderProps> {}

  export class Constants {
    public static NEW_SECTION_CLASS_NAMES: string;
  }

  export interface EditConfig {
    dragDropName: string;

    emptyLabel: string;

    isEmpty(cmp: {}): boolean;
  }
}
