import * as React from 'react';
import {JavaApi} from './JavaApi';
import {ReactParsysProps} from './ReactParsys';
import {ResourceComponent, ResourceProps} from './ResourceComponent';

export type Transform<R> = (api: JavaApi) => R;

export type parsysFactory<P> = (api: JavaApi, props: P) => JSX.Element[];

export interface ComponentConfig<R> {
  readonly shortName?: string;
  readonly name?: string;
  readonly parsys?: ReactParsysProps;
  readonly parsysFactory?: parsysFactory<R>;
  readonly component: React.ComponentClass<any>;
  readonly props?: {[name: string]: any};
  readonly transform?: Transform<R>;
  readonly loadingComponent?: React.ComponentClass<any>;
}

export interface WrapperProps<E extends object> extends ResourceProps {
  readonly extraProps: E;
}

export class Wrapper<E extends object, R> extends ResourceComponent<
  any,
  WrapperProps<E>,
  any
> {
  protected readonly config: ComponentConfig<R>;

  public constructor(config: ComponentConfig<R>, props?: any, context?: any) {
    super(props, context);

    this.config = config;
  }

  public create(): React.ReactElement<any> {
    let children: JSX.Element[];

    const props = this.getResource();

    if (this.config.props) {
      Object.keys(this.config.props).forEach(
        (key: string) => (props[key] = this.config.props[key])
      );
    }

    const newProps: any = this.transform(props);

    if (this.config.parsysFactory) {
      children = this.config.parsysFactory(this, newProps);
    } else if (!!this.config.parsys) {
      children = this.renderChildren(
        this.config.parsys.path,
        this.config.parsys.childClassName,
        this.config.parsys.childElementName,
        this.config.parsys.includeOptions
      );
    }

    const finalProps: any = {...newProps, ...this.props.extraProps as any};

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
    const existingProps: any = this.getContainer().cache.getTransform(
      this.getPath()
    );
    if (existingProps) {
      return existingProps;
    }
    const javaApi = this.getContainer().createJavaApi(this.getPath());
    const newProps = this.config.transform
      ? this.config.transform(javaApi)
      : props;
    this.getContainer().cache.putTransform(this.getPath(), newProps);

    return newProps;
  }
}

export class WrapperFactory {
  /**
   *
   * @param config
   * @param resourceType
   * @return {TheWrapper}
   */
  public static createWrapper<E extends object, R>(
    config: ComponentConfig<R>,
    resourceType: string
  ): React.ComponentClass<any> {
    return class TheWrapper extends Wrapper<E, R> {
      public constructor(props?: any, context?: any) {
        super(config, props, context);
      }

      public getResourceType(): string {
        return resourceType;
      }
    };
  }
}
