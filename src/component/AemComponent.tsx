import * as React from 'react';
import {AemContext} from '../AemContext';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Container} from '../di/Container';
import {ServiceProxy} from '../di/ServiceProxy';

export interface AemComponentContext {
  readonly aemContext: AemContext;
  readonly path: string;
  readonly wcmmode?: string;
}

export class AemComponent<P = {}, S = {}> extends React.PureComponent<P, S> {
  public static readonly contextTypes: object = {
    aemContext: React.PropTypes.object.isRequired,
    path: React.PropTypes.string.isRequired,
    wcmmode: React.PropTypes.string
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
  public getResourceModel(name: string): ServiceProxy {
    return this.getContainer().getResourceModel(this.getPath(), name);
  }

  /* istanbul ignore next */
  public getRequestModel(name: string): ServiceProxy {
    return this.getContainer().getRequestModel(this.getPath(), name);
  }

  protected getAemContext(): AemContext {
    return this.context.aemContext;
  }

  protected getContainer(): Container {
    return this.context.aemContext.container;
  }
}
