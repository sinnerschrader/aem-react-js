import * as PropTypes from 'prop-types';
import * as React from 'react';
import {ResourceInclude} from '../ResourceInclude';
import {ResourceUtils} from '../ResourceUtils';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {
  EditDialogData,
  IncludeOptions,
  calculateSelectors
} from '../store/Sling';
import {shallowEqual} from '../utils/compare';
import {AemComponent, AemComponentContext} from './AemComponent';
import {EditDialog} from './EditDialog';

export enum STATE {
  LOADING,
  LOADED,
  FAILED
}

export interface ResourceState {
  readonly absolutePath: string;
  readonly state: STATE;
  readonly data: ComponentData;
}

export interface ResourceRef {
  readonly path: string;
  readonly selectors: string[];
  readonly type: string;
}

export interface ComponentData {
  readonly id: ResourceRef;
  readonly dialog: EditDialogData | null;
  transformData: any;
  readonly children?: {[name: string]: ComponentData};
  readonly childrenOrder?: string[];
}

export interface ResourceProps {
  readonly path: string;
  readonly skipRenderDialog?: boolean;
  readonly root?: boolean;
  readonly wcmmode?: string;
  readonly className?: string;
  readonly selectors: string[];
}

/**
 * Provides base functionality for components that are
 */
export abstract class ResourceComponent<
  P extends ResourceProps,
  S = {}
> extends AemComponent<P, S> {
  public static readonly childContextTypes: any = {
    path: PropTypes.string.isRequired,
    selectors: PropTypes.arrayOf(PropTypes.string),
    wcmmode: PropTypes.string
  };

  private loadingState: STATE;
  private componentData: ComponentData;

  public getChildContext(): any {
    return {
      path: this.getPath(),
      selectors: this.getSelectors(),
      wcmmode: this.getWcmmode()
    };
  }

  public shouldComponentUpdate(
    nextProps: P,
    nextState: {},
    nextCtx: AemComponentContext
  ): boolean {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context.path, nextCtx.path)
    );
  }

  public componentWillUpdate(
    newProps: P,
    newState: S,
    newContext: AemComponentContext
  ): void {
    this.loadIfNecessary(
      this.createPath(newProps, newContext),
      newProps.selectors
    );
  }

  public componentWillMount(): void {
    this.load(this.getPath(), this.getSelectors());
  }

  public loadIfNecessary(path: string, selectors: string[]): void {
    if (path !== this.getPath()) {
      // TODO compare selectors
      this.loadingState = undefined;
      this.load(this.getPath(), this.getSelectors());
    }
  }

  public load(path: string, selectors: string[]): void {
    this.loadingState = undefined;
    this.getAemContext().container.sling.loadComponent(
      {path, selectors, type: this.getResourceType()},
      this.handleLoadComponentSuccess.bind(this),
      {skipData: false}
    );
    if (this.loadingState !== STATE.LOADED) {
      this.loadingState = STATE.LOADING;
    }
  }

  public handleLoadComponentSuccess(data: ComponentData): void {
    if (this.loadingState === STATE.LOADING) {
      // assuming that load has only set the state to
      // LOADING if the method was called asynchronuously after load.
      this.loadingState = STATE.LOADED;
      this.componentData = data;
      this.forceUpdate();
    } else {
      this.loadingState = STATE.LOADED;
      this.componentData = data;
    }
  }

  public getSelectors(): string[] {
    return this.props.selectors || this.context.selectors || [];
  }

  public getWcmmode(): string | undefined {
    return this.props.wcmmode || this.context.wcmmode;
  }

  public getPath(): string {
    return this.createPath(this.props, this.context);
  }

  public render(): React.ReactElement<any> {
    let child: React.ReactElement<any>;

    if (this.loadingState === STATE.LOADING) {
      return this.renderLoading();
    } else if (!!this.props.skipRenderDialog) {
      return this.renderBody(this.componentData);
    } else {
      child = this.renderBody(this.componentData);
    }

    return (
      <EditDialog
        dialog={this.componentData.dialog}
        className={this.props.className}
      >
        {child}
      </EditDialog>
    );
  }

  public getRegistry(): RootComponentRegistry {
    return this.context.aemContext.registry;
  }

  public abstract renderBody(data: ComponentData): React.ReactElement<any>;

  public getTransformData(): any {
    return this.componentData.transformData;
  }

  public getResourceType(): string {
    return this.context.aemContext.registry.getResourceType(this);
  }

  protected renderLoading(): React.ReactElement<any> {
    return <span>Loading</span>;
  }

  protected getDepth(): number {
    return 0;
  }

  protected isSkipData(): boolean {
    return false;
  }

  protected renderChildren(
    path: string,
    childClassName: string = '',
    childElementName?: string,
    includeOptions: IncludeOptions = {}
  ): React.ReactElement<any>[] {
    if (path && path.match(/^\//)) {
      throw new Error('path must be relative. was ' + path);
    }

    const parentData: ComponentData = !!path
      ? this.componentData.children[path]
      : this.componentData;

    const childComponents: React.ReactElement<any>[] = [];
    const basePath: string = !!path ? path + '/' : '';

    // TODO alternatively create a div for each child
    // and set className/elementName there

    if (parentData.childrenOrder) {
      parentData.childrenOrder.forEach((nodeName: string) => {
        const child: ComponentData = parentData.children[nodeName];
        const resourceType: string = child.id.type;
        const actualPath: string = child.id.path;

        const componentType: React.ComponentClass<
          any
        > = this.getRegistry().getComponent(
          resourceType,
          calculateSelectors(this.getSelectors(), includeOptions)
        );

        if (childElementName) {
          if (componentType) {
            const props: any = {
              key: nodeName,
              path: actualPath,
              reactKey: path
            };

            childComponents.push(
              React.createElement(
                childElementName as any,
                {
                  className: childClassName,
                  key: nodeName
                },
                React.createElement(componentType, props)
              )
            );
          } else {
            childComponents.push(
              React.createElement(
                childElementName as any,
                {
                  className: childClassName,
                  key: nodeName
                },
                React.createElement(ResourceInclude, {
                  key: nodeName,
                  options: includeOptions,
                  path: actualPath,
                  resourceType
                })
              )
            );
          }
        } else {
          if (componentType) {
            const props: any = {
              className: childClassName,
              key: nodeName,
              path: basePath + nodeName,
              reactKey: path
            };

            childComponents.push(React.createElement(componentType, props));
          } else {
            childComponents.push(
              <ResourceInclude
                className={childClassName}
                element={childElementName}
                path={actualPath}
                key={nodeName}
                resourceType={resourceType}
                options={includeOptions}
              />
            );
          }
        }
      }, this);
    }

    let newZone: React.ReactElement<any> = null;

    if (this.isWcmEnabled()) {
      const parsysPath = path ? path + '/*' : '*';
      const resourceType = 'foundation/components/parsys/new';

      newZone = (
        <ResourceInclude
          key="newZone"
          element="div"
          path={parsysPath}
          resourceType={resourceType}
        />
      );

      childComponents.push(newZone);
    }

    return childComponents;
  }

  private createPath(
    props: ResourceProps,
    context: AemComponentContext
  ): string {
    return ResourceUtils.createPath(context.path, props.path);
  }
}
