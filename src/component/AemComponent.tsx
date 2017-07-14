import * as React from 'react';
import {AemContext} from '../AemContext';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {Container} from '../di/Container';

/**
 * Provides base functionality for components that are
 */
export class AemComponent<P, S> extends React.Component<P, S> {
  public static contextTypes: any = {
    aemContext: React.PropTypes.any,
    path: React.PropTypes.string, //
    rootPath: React.PropTypes.string, //
    wcmmode: React.PropTypes.string //
  };

  public context: {
    wcmmode: string;
    path: string;
    aemContext: AemContext;
  };

  /* istanbul ignore next */
  public getWcmmode(): string {
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
  public getComponent(name: string): any {
    return this.getContainer().get(name);
  }

  /* istanbul ignore next */
  public getOsgiService(name: string): any {
    return this.getContainer().getOsgiService(name);
  }

  /* istanbul ignore next */
  public getResourceModel(name: string): any {
    return this.getContainer().getResourceModel(this.getPath(), name);
  }

  /* istanbul ignore next */
  public getRequestModel(name: string): any {
    return this.getContainer().getRequestModel(this.getPath(), name);
  }

  protected getAemContext(): AemContext {
    return this.context.aemContext;
  }

  protected getContainer(): Container {
    return this.context.aemContext.container;
  }
}
