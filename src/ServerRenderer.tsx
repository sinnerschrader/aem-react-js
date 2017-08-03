import * as React from 'react';
import * as ReactDom from 'react-dom/server';
import {AemContext} from './AemContext';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {Container} from './di/Container';

export interface ServerResponse {
  readonly html: string;
  readonly state: string;
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
    renderRootDialog?: boolean
  ): ServerResponse {
    console.log('Render react on path: ' + path);
    console.log('Render react component: ' + resourceType);

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

    console.log('Render root dialog ' + String(renderRootDialog));

    const root: JSX.Element = this.registry.rootDecorator(
      <RootComponent
        aemContext={ctx}
        component={component}
        path={path}
        wcmmode={wcmmode}
        renderRootDialog={!!renderRootDialog}
      />
    );

    const html: string = ReactDom.renderToString(root);

    return {html, state: JSON.stringify(this.container.cache.getFullState())};
  }
}
