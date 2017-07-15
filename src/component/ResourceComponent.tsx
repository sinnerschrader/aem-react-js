import * as React from 'react';
import * as shallowCompare from 'react-addons-shallow-compare';
import {ResourceInclude} from '../ResourceInclude';
import {ResourceUtils} from '../ResourceUtils';
import {RootComponentRegistry} from '../RootComponentRegistry';
import {AemComponent} from './AemComponent';
import {EditDialog} from './EditDialog';

export interface Resource {
  readonly 'sling:resourceType': string;
}

export enum STATE {
  LOADING,
  LOADED,
  FAILED
}

export interface ResourceState {
  readonly absolutePath: string;
  readonly resource?: any;
  readonly state: STATE;
}

export interface ResourceProps {
  readonly path: string;
  readonly skipRenderDialog?: boolean;
  readonly root?: boolean;
  readonly wcmmode?: string;
  readonly className?: string;
}

/**
 * Provides base functionality for components that are
 */
export abstract class ResourceComponent<
  C extends Resource,
  P extends ResourceProps,
  S extends ResourceState
> extends AemComponent<P, S> {
  public static readonly childContextTypes: any = {
    path: React.PropTypes.string, //
    wcmmode: React.PropTypes.string //
  };

  public getChildContext(): any {
    return {
      path: this.getPath(),
      wcmmode: this.getWcmmode()
    };
  }

  public shouldComponentUpdate(nextProps: P, nextState: S): boolean {
    return shallowCompare(this, nextProps, nextState);
  }

  public componentWillMount(): void {
    this.initialize();
  }

  public componentWillReceiveProps(): void {
    this.initialize();
  }

  public initialize(): void {
    const absolutePath = ResourceUtils.isAbsolutePath(this.props.path)
      ? this.props.path
      : `${this.context.path}/` + String(this.props.path);

    if (absolutePath !== this.getPath()) {
      this.setState({absolutePath, state: STATE.LOADING});

      this.getAemContext().container.sling.subscribe(this, absolutePath, {
        depth: this.getDepth()
      });
    }
  }

  public getWcmmode(): string {
    return this.props.wcmmode || this.context.wcmmode;
  }

  public getPath(): string {
    if (typeof this.state !== 'undefined' && this.state !== null) {
      return this.state.absolutePath;
    } else {
      return null;
    }
  }

  public render(): React.ReactElement<any> {
    let child: React.ReactElement<any>;

    if (this.state.state === STATE.LOADING) {
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
    return this.state.resource as C;
  }

  public getResourceType(): string {
    return this.context.aemContext.registry.getResourceType(this);
  }

  public changedResource(path: string, resource: C): void {
    this.setState({state: STATE.LOADED, resource, absolutePath: path} as any);
  }

  protected renderLoading(): React.ReactElement<any> {
    return <span>Loading</span>;
  }

  protected getDepth(): number {
    return 0;
  }

  protected renderChildren(
    path: string,
    childClassName?: string,
    childElementName?: string
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
      > = this.getRegistry().getComponent(resourceType);

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
              path={actualPath}
              key={nodeName}
              resourceType={resourceType}
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
}
