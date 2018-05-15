import * as React from 'react';
import * as ReactDom from 'react-dom';
import {AemContext} from './AemContext';
import {RootComponentRegistry} from './RootComponentRegistry';
import {RootComponent} from './component/RootComponent';
import {reviveFactory, reviver} from './component/text/TextUtils';
import {Container} from './di/Container';
import {Cache} from './store/Cache';

export interface ComponentTreeConfig {
  readonly wcmmode: string;
  readonly path: string;
  readonly resourceType: string;
  readonly cache: Cache;
  readonly selectors: string[];
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
  private readonly registry: RootComponentRegistry;

  public constructor(registry: RootComponentRegistry, container: Container) {
    this.container = container;
    this.registry = registry;
  }

  /**
   * Initialize react component in dom.
   * @param item
   */
  public initReactComponent(
    item: Element,
    options: ReactOptions = {},
    reviverFn: reviver,
    id: string
  ): void {
    let nextItem = item.nextSibling;
    while (nextItem && nextItem.nodeName.toLocaleLowerCase() !== 'textarea') {
      nextItem = nextItem.nextSibling;
    }
    if (!nextItem) {
      throw new Error('cannot find textarea for component');
    }
    const textarea = nextItem as HTMLTextAreaElement;

    if (textarea) {
      const props: ComponentTreeConfig = JSON.parse(textarea.value, reviverFn);

      this.container.cache.mergeCache(props.cache);

      if (
        (options.shouldStartReact && options.shouldStartReact(props)) ||
        props.wcmmode === 'disabled'
      ) {
        const component = this.registry.getComponent(
          props.resourceType,
          props.selectors
        );

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
              selectors={props.selectors}
              id={id}
              path={props.path}
              wcmmode={props.wcmmode}
            />
          );
          ReactDom.hydrate(root, item);
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

  public getComponent(
    resourceType: string,
    selectors?: string[]
  ): React.ComponentClass<any> {
    return this.registry.getComponent(resourceType, selectors || []);
  }

  /**
   * find all root elements and initialize the react components
   */
  public initReactComponents(el: Element, options?: ReactOptions): number {
    const reviverFn = reviveFactory(el);
    const items: Element[] = [].slice.call(el.querySelectorAll('[data-react]'));

    items.forEach((item: Element, index: number) => {
      this.initReactComponent(item, options, reviverFn, String(index));
    });

    return items.length;
  }
}
