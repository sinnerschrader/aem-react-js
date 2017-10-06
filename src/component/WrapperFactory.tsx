import * as React from 'react';
import {JavaApi} from './JavaApi';
import {ReactParsysProps} from './ReactParsys';
import {ResourceComponent} from './ResourceComponent';

export type Transform<R, C = object> = (content: C, api: JavaApi) => R;

export type parsysFactory = (api: JavaApi) => JSX.Element[];

export interface ComponentConfig<R, C = object> {
  readonly depth?: number;
  readonly shortName?: string;
  readonly name?: string;
  readonly parsys?: ReactParsysProps;
  readonly parsysFactory?: parsysFactory;
  readonly component: React.ComponentClass<any>;
  readonly props?: {[name: string]: any};
  readonly transform?: Transform<C, R>;
  readonly loadingComponent?: React.ComponentClass<any>;
}

export class Wrapper<R, C = object> extends ResourceComponent<any, any, any> {
  protected readonly config: ComponentConfig<R, C>;

  public constructor(
    config: ComponentConfig<R, C>,
    props?: any,
    context?: any
  ) {
    super(props, context);

    this.config = config;
  }

  public create(): React.ReactElement<any> {
    let children: JSX.Element[];

    if (this.config.parsysFactory) {
      children = this.config.parsysFactory(this);
    } else if (!!this.config.parsys) {
      children = this.renderChildren(
        this.config.parsys.path,
        this.config.parsys.childClassName,
        this.config.parsys.childElementName,
        this.config.parsys.includeOptions
      );
    }

    const props = this.getResource();

    if (this.config.props) {
      Object.keys(this.config.props).forEach(
        (key: string) => (props[key] = this.config.props[key])
      );
    }

    let newProps: any = this.getContainer().cache.getTransform(this.getPath());
    if (!newProps) {
      const javaApi: JavaApi = this.getContainer().createJavaApi(
        this.getPath()
      );
      newProps = this.config.transform
        ? this.config.transform(props, javaApi)
        : props;
      this.getContainer().cache.putTransform(this.getPath(), newProps);
    }

    return React.createElement(this.config.component, newProps, children);
  }

  public renderBody(): React.ReactElement<any> {
    return this.create();
  }

  protected getDepth(): number {
    return this.config.depth || 0;
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
  /**
   *
   * @param config
   * @param resourceType
   * @return {TheWrapper}
   */
  public static createWrapper<C, R>(
    config: ComponentConfig<C, R>,
    resourceType: string
  ): React.ComponentClass<any> {
    return class TheWrapper extends Wrapper<C, R> {
      public constructor(props?: any, context?: any) {
        super(config, props, context);
      }

      public getResourceType(): string {
        return resourceType;
      }
    };
  }
}
