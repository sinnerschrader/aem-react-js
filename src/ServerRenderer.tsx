import * as React from 'react';
import * as ReactDom from 'react-dom/server';
import {AemContext} from './AemContext';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {Container} from './di/Container';
import {Cache} from './store/Cache';

export interface ServerResponse {
  html: string;
  state: string;
}

export class ServerRenderer {
  private registry: RootComponentRegistry;
  private container: Container;

  public constructor(registry: RootComponentRegistry, container: Container) {
    this.registry = registry;
    this.container = container;
  }

  /* render component as string.
     * @param component
     * @param props
     * @returns {string}
     */
  public renderReactComponent(
    path: string,
    resourceType: string,
    wcmmode: string,
    renderRootDialog?: boolean
  ): ServerResponse {
    console.log('render react on path ' + path);
    console.log('render react component ' + resourceType);

    const comp = this.registry.getComponent(resourceType);

    if (!comp) {
      throw new Error('cannot find component for resourceType ' + resourceType);
    }

    const ctx: AemContext = {
      registry: this.registry,
      container: this.container
    };

    console.log('render root dialog ' + String(renderRootDialog));

    const html: string = ReactDom.renderToString(
      <RootComponent
        aemContext={ctx}
        comp={comp}
        path={path}
        wcmmode={wcmmode}
        renderRootDialog={!!renderRootDialog}
      />
    );

    const cache: Cache = this.container.get('cache');

    return {html, state: JSON.stringify(cache.getFullState())};
  }
}
