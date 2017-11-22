import * as React from 'react';
import * as ReactDom from 'react-dom/server';
import {AemContext} from './AemContext';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {TextPool} from './component/text/TextPool';
import {replaceFactory} from './component/text/TextUtils';
import {Container} from './di/Container';

export interface ServerResponse {
  readonly html: string;
  readonly state: string;
  readonly reactContext: any;
}

export interface ReactContext {
  textPool: TextPool;
  rootNo: number;
}

export class ServerRenderer {
  private readonly container: Container;
  private readonly registry: RootComponentRegistry;

  public constructor(registry: RootComponentRegistry, container: Container) {
    this.registry = registry;
    this.container = container;
  }

  public renderReactComponent(
    path: string,
    resourceType: string,
    wcmmode: string,
    renderAsJson: boolean = false,
    reactContext: ReactContext = {rootNo: 1, textPool: new TextPool()}
  ): ServerResponse {
    const component = this.registry.getComponent(resourceType);

    if (!component) {
      throw new Error(
        'Cannot find component for resourceType: ' + resourceType
      );
    }

    const ctx: AemContext = {
      container: this.container,
      registry: this.registry
    };

    // TODO we must safe this value in reactContext and increment it everytime
    const id = String(reactContext.rootNo);

    const root: JSX.Element = this.registry.rootDecorator(
      <RootComponent
        aemContext={ctx}
        component={component}
        id={id}
        path={path}
        wcmmode={wcmmode}
        renderRootDialog={!!renderAsJson}
      />
    );

    const html: string = ReactDom.renderToString(root);
    const state = renderAsJson
      ? JSON.stringify(this.container.cache.getFullState())
      : JSON.stringify(
          this.container.cache.getFullState(),
          replaceFactory(this.container.textPool)
        );

    return {html, state, reactContext};
  }
}
