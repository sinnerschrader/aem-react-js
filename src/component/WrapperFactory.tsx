import * as React from 'react';
import {Props} from '../compatibility/Props';
import {JavaApi} from './JavaApi';
import {ReactParsysProps} from './ReactParsys';
import {
  ComponentData,
  ResourceComponent,
  ResourceProps
} from './ResourceComponent';

export type TransformFunc = (api: JavaApi) => any;

export type parsysFactory = (api: JavaApi, props: any) => JSX.Element[];

export interface ComponentConfig {
  readonly shortName?: string;
  readonly name?: string;
  readonly parsys?: ReactParsysProps;
  readonly parsysFactory?: parsysFactory;
  readonly component: React.ComponentClass<any>;
  readonly props?: {[name: string]: any};
  readonly transform?: TransformFunc;
  readonly loadingComponent?: React.ComponentClass<any>;
  readonly selector?: string;
}

export interface WrapperProps<E extends object> extends ResourceProps {
  readonly extraProps: E;
}

const transformChildren = (children: {[key: string]: ComponentData}) => {
  if (!children) {
    return undefined;
  }

  const items: {[key: string]: Props<{}>} = {};

  Object.keys(children).forEach((key: string) => {
    const data = children[key];
    items[key] = {
      resourceType: data.id.type,
      model: data,
      dataPath: data.id.path
    };
  });

  return items;
};

export class Wrapper<E extends object> extends ResourceComponent<
  WrapperProps<E>,
  any
> {
  protected readonly config: ComponentConfig;

  public constructor(config: ComponentConfig, props?: any, context?: any) {
    super(props, context);

    this.config = config;
  }

  public create(data: ComponentData): React.ReactElement<any> {
    const model: any = {
      ...this.config.props,
      ...data.transformData,
      ...this.props.extraProps as any
    };

    const finalProps: Props<{}> = {
      itemsOrder: data.childrenOrder,
      items: transformChildren(data.children),
      resourceType: data.id.type,
      dataPath: data.id.path,
      model
    };

    return React.createElement(this.config.component, finalProps);
  }

  public renderBody(data: ComponentData): React.ReactElement<any> {
    return this.create(data);
  }

  protected isSkipData(): boolean {
    return true;
  }

  protected renderLoading(): React.ReactElement<any> {
    const loadingComponent = this.config.loadingComponent;

    if (loadingComponent) {
      return React.createElement(loadingComponent, this.props);
    }

    return <span>Loading</span>;
  }
}

export class WrapperFactory {
  public static createWrapper<E extends object>(
    config: ComponentConfig,
    resourceType: string
  ): React.ComponentClass<any> {
    return class TheWrapper extends Wrapper<E> {
      public constructor(props?: any, context?: any) {
        super(config, props, context);
      }

      public getResourceType(): string {
        return resourceType;
      }
    };
  }
}
