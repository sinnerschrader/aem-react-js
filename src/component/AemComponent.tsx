import * as PropTypes from 'prop-types';
import * as React from 'react';
import {AemContext} from '../AemContext';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Container} from '../di/Container';
import {ServiceProxy} from '../di/ServiceProxy';
import {XssApi} from '../xss/XssApi';
import {ApiOptions, JavaApi} from './JavaApi';

export interface AemComponentContext {
  readonly aemContext: AemContext;
  readonly path: string;
  readonly root: string;
  readonly wcmmode?: string;
}

export class AemComponent<P = {}, S = {}> extends React.Component<P, S>
  implements JavaApi {
  public static readonly contextTypes: object = {
    aemContext: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    root: PropTypes.string,
    wcmmode: PropTypes.string
  };

  public readonly context: AemComponentContext;

  /* istanbul ignore next */
  public getWcmmode(): string | undefined {
    return this.context.wcmmode;
  }

  public getPath(): string {
    return this.context.path;
  }

  public isWcmEnabled(): boolean {
    return !this.getWcmmode() || this.getWcmmode() !== 'disabled';
  }

  /* istanbul ignore next */
  public getRegistry(): RootComponentRegistry {
    return this.context.aemContext.registry;
  }

  /* istanbul ignore next */
  public getOsgiService(name: string): ServiceProxy {
    return this.getContainer().getOsgiService(name);
  }

  /* istanbul ignore next */
  public getResourceModel(
    name: string,
    options: ApiOptions = {}
  ): ServiceProxy {
    return this.getContainer().getResourceModel(
      this.getExtendedPath(options),
      name
    );
  }

  /* istanbul ignore next */
  public getRequestModel(name: string, options: ApiOptions = {}): ServiceProxy {
    return this.getContainer().getRequestModel(
      this.getExtendedPath(options),
      name
    );
  }

  public getXssApi(): XssApi {
    return this.getContainer().cqx.getXssApi();
  }

  protected getAemContext(): AemContext {
    return this.context.aemContext;
  }

  protected getContainer(): Container {
    return this.context.aemContext.container;
  }

  private getExtendedPath(options: ApiOptions): string {
    return (
      this.getPath() +
      (options.path && options.path.length > 0 ? '/' + options.path : '')
    );
  }
}
