import * as React from 'react';
import {ReactParsysProps} from './ReactParsys';
import {ResourceComponent} from './ResourceComponent';

export type Transform<C, R> = (
  content: C,
  r: ResourceComponent<any, any, any>
) => R;

export interface ComponentConfig<C, R> {
  readonly depth?: number;
  readonly name?: string;
  readonly parsys?: ReactParsysProps;
  readonly component: React.ComponentClass<any>;
  readonly props?: {[name: string]: any};
  readonly transform?: Transform<C, R>;
  readonly loadingComponent?: React.ComponentClass<any>;
}

export class Wrapper<C, R> extends ResourceComponent<any, any, any> {
  protected readonly config: ComponentConfig<C, R>;

  public constructor(
    config: ComponentConfig<C, R>,
    props?: any,
    context?: any
  ) {
    super(props, context);

    this.config = config;
  }

  public create(): React.ReactElement<any> {
    let children: React.ReactElement<any>[];

    if (!!this.config.parsys) {
      children = this.renderChildren(
        this.config.parsys.path,
        this.config.parsys.childClassName,
        this.config.parsys.childElementName
      );
    }

    const props = this.getResource();

    if (this.config.props) {
      Object.keys(this.config.props).forEach(
        (key: string) => (props[key] = this.config.props[key])
      );
    }

    const newProps = this.config.transform
      ? this.config.transform(props, this)
      : props;

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
