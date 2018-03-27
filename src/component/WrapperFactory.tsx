import * as React from 'react';
import {JavaApi} from './JavaApi';
import {ReactParsysProps} from './ReactParsys';
import {ResourceComponent, ResourceProps} from './ResourceComponent';

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

export class Wrapper<E extends object> extends ResourceComponent<
  WrapperProps<E>,
  any
> {
  protected readonly config: ComponentConfig;

  public constructor(config: ComponentConfig, props?: any, context?: any) {
    super(props, context);

    this.config = config;
  }

  public create(): React.ReactElement<any> {
    let children: JSX.Element[];

    const props = this.getTransformData();

    if (this.config.props) {
      Object.keys(this.config.props).forEach(
        (key: string) => (props[key] = this.config.props[key])
      );
    }

    // todo should be transformed already ?
    const transformResult: any = this.transform(props);

    if (this.config.parsysFactory) {
      children = this.config.parsysFactory(this, transformResult.props);
    } else if (!!this.config.parsys) {
      children = this.renderChildren(
        this.config.parsys.path,
        this.config.parsys.childClassName,
        this.config.parsys.childElementName,
        this.config.parsys.includeOptions
      );
    }

    const finalProps: any = {
      ...transformResult.props,
      ...this.props.extraProps as any
    };

    return React.createElement(this.config.component, finalProps, children);
  }

  public renderBody(): React.ReactElement<any> {
    return this.create();
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

  private transform(props: any): any {
    const transformData = this.getContainer().cache.getTransformData(
      this.getPath(),
      this.getSelectors()
    );
    if (transformData) {
      return transformData;
    }
    const javaApi = this.getContainer().createJavaApi(
      this.getPath(),
      this.getSelectors()
    );
    const newProps = this.config.transform
      ? this.config.transform(javaApi)
      : props;
    this.getContainer().cache.putTransformData(
      this.getPath(),
      this.getSelectors(),
      newProps
    );

    // todo: what to do with children here?

    return {
      children: null,
      props: newProps
    };
  }
}

export class WrapperFactory {
  /**
   *
   * @param config
   * @param resourceType
   * @return {TheWrapper}
   */
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
