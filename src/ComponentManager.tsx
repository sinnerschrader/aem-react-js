import * as React from 'react';
import * as ReactDom from 'react-dom';
import {AemContext} from './AemContext';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {reviveFactory} from './component/text/TextUtils';
import {Container} from './di/Container';
import {Cache} from './store/Cache';

export interface ComponentTreeConfig {
  readonly wcmmode: string;
  readonly path: string;
  readonly resourceType: string;
  readonly cache: Cache;
}

export type ShouldStartReact = (props: ComponentTreeConfig) => boolean;

export interface ReactOptions {
  shouldStartReact?: ShouldStartReact;
}

/**
 * The Component
 */
export class ComponentManager {
  private readonly container: Container;
  private readonly document: Document;
  private readonly registry: RootComponentRegistry;
  private readonly reviver: (key: string, value: any) => any;

  public constructor(
    registry: RootComponentRegistry,
    container: Container,
    aDocument?: Document
  ) {
    this.container = container;
    this.registry = registry;
    this.document = aDocument || document;
    this.reviver = reviveFactory(this.document);
  }

  /**
   * Initialize react component in dom.
   * @param item
   */
  public initReactComponent(item: Element, options: ReactOptions = {}): void {
    const textarea = this.document.getElementById(
      item.getAttribute('data-react-id')
    ) as HTMLTextAreaElement;

    if (textarea) {
      const props: ComponentTreeConfig = JSON.parse(
        textarea.value,
        this.reviver
      );

      this.container.cache.mergeCache(props.cache);

      if (
        (options.shouldStartReact && options.shouldStartReact(props)) ||
        props.wcmmode === 'disabled'
      ) {
        const component = this.registry.getComponent(props.resourceType);

        if (!component) {
          console.error(
            `React component '${props.resourceType}' ` +
              'does not exist in component list.'
          );
        } else {
          const ctx: AemContext = {
            container: this.container,
            registry: this.registry
          };

          const root: JSX.Element = this.registry.rootDecorator(
            <RootComponent
              aemContext={ctx}
              component={component}
              path={props.path}
              wcmmode={props.wcmmode}
            />
          );
          ReactDom.render(root, item);
        }
      }
    } else {
      console.error(
        `React config with id '${item.getAttribute('data-react-id')}' ` +
          'has no corresponding textarea element.'
      );
    }
  }

  public getResourceType(component: React.ComponentClass<any>): string {
    return this.registry.getResourceType(component);
  }

  public getComponent(resourceType: string): React.ComponentClass<any> {
    return this.registry.getComponent(resourceType);
  }

  /**
   * find all root elements and initialize the react components
   */
  public initReactComponents(options?: ReactOptions): number {
    const items: Element[] = [].slice.call(
      this.document.querySelectorAll('[data-react]')
    );

    for (const item of items) {
      this.initReactComponent(item, options);
    }

    return items.length;
  }
}
