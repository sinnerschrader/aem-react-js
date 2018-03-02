import * as PropTypes from 'prop-types';
import * as React from 'react';
import {ResourceInclude} from '../ResourceInclude';
import {ResourceUtils} from '../ResourceUtils';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {IncludeOptions, calculateSelectors} from '../store/Sling';
import {shallowEqual} from '../utils/compare';
import {AemComponent, AemComponentContext} from './AemComponent';
import {EditDialog} from './EditDialog';

export interface Resource {
  readonly 'sling:resourceType': string;
}

export enum STATE {
  LOADING,
  LOADED,
  FAILED
}

export interface ResourceProps {
  readonly path: string;
  readonly skipRenderDialog?: boolean;
  readonly root?: boolean;
  readonly wcmmode?: string;
  readonly className?: string;
  readonly selectors?: string[];
}

/**
 * Provides base functionality for components that are
 */
export abstract class ResourceComponent<
  C extends Resource,
  P extends ResourceProps,
  S = {}
> extends AemComponent<P, S> {
  public static readonly childContextTypes: any = {
    path: PropTypes.string.isRequired,
    selectors: PropTypes.arrayOf(PropTypes.string),
    wcmmode: PropTypes.string
  };

  private loadingState: STATE;
  private resource: C;

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
    this.load(this.getPath(), this.props.selectors);
  }

  public loadIfNecessary(path: string, selectors: string[]): void {
    if (path !== this.getPath()) {
      // TODO compare selectors
      this.loadingState = undefined;
      this.getAemContext().container.sling.load(
        this.changedResource.bind(this),
        path,
        {
          depth: this.getDepth(),
          selectors,
          skipData: this.isSkipData() || false
        }
      );
      if (this.loadingState !== STATE.LOADED) {
        this.loadingState = STATE.LOADING;
      }
    }
  }

  public load(path: string, selectors: string[]): void {
    this.loadingState = undefined;
    this.getAemContext().container.sling.load(
      this.changedResource.bind(this),
      path,
      {
        depth: this.getDepth(),
        selectors,
        skipData: this.isSkipData() || false
      }
    );
    if (this.loadingState !== STATE.LOADED) {
      this.loadingState = STATE.LOADING;
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
      child = this.renderLoading();
    } else if (!!this.props.skipRenderDialog) {
      return this.renderBody();
    } else {
      child = this.renderBody();
    }

    return (
      <EditDialog
        path={this.getPath()}
        resourceType={this.getResourceType()}
        className={this.props.className}
      >
        {child}
      </EditDialog>
    );
  }

  public getRegistry(): RootComponentRegistry {
    return this.context.aemContext.registry;
  }

  public abstract renderBody(): React.ReactElement<any>;

  public getResource(): C {
    return this.resource;
  }

  public getResourceType(): string {
    return this.context.aemContext.registry.getResourceType(this);
  }

  public changedResource(resource: C): void {
    if (this.loadingState === STATE.LOADING) {
      // assuming that load has only set the state to
      // LOADING if the method was called asynchronuously after load.
      this.loadingState = STATE.LOADED;
      this.resource = resource;
      this.forceUpdate();
    } else {
      this.loadingState = STATE.LOADED;
      this.resource = resource;
    }
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

    const childrenResource: any = !!path
      ? (this.getResource() as any)[path]
      : this.getResource();

    const children: any = ResourceUtils.getChildren(childrenResource);
    const childComponents: React.ReactElement<any>[] = [];
    const basePath: string = !!path ? path + '/' : '';

    // TODO alternatively create a div for each child
    // and set className/elementName there

    Object.keys(children).forEach((nodeName: string, childIdx: number) => {
      const resource: Resource = children[nodeName];
      const resourceType: string = resource['sling:resourceType'];
      const actualPath: string = basePath + nodeName;

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
            reactKey: path,
            resource
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
            reactKey: path,
            resource
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
    return ResourceUtils.isAbsolutePath(props.path)
      ? props.path
      : `${context.path}/` + String(props.path);
  }
}
