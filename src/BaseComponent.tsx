import * as React from 'react'
import { Resource, ResourceComponent, ResourceProps } from './component/ResourceComponent'
import { ResourceUtils } from './ResourceUtils'
import { ResourceInclude } from './include'
import CqUtils from "./CqUtils"
var Frame = require('react-frame-component')

export default class BaseComponent extends ResourceComponent<Resource, ResourceProps<Resource>, any> {
  protected fixedComponents: Array<any> = []
  constructor( props: ResourceProps<Resource> ) {
    super(props)
  }

  private keyRef = 0
  protected generateKeyRef():string {
    return 'reactAEM' + this.keyRef++
  }

  // Check if the given component is one of the fixed type ones
  protected isFixedComponent(componentType:string):Boolean {
    for( let i = 0; i < this.fixedComponents.length; i++ ) {
      if( this.fixedComponents[i].toLowerCase() == componentType.toLowerCase() ) {
        return true
      }
    }

    return false
  }

  // Override this to render what you want
  public renderBody(): React.ReactElement<any> {
    let childComponents: React.ReactElement<any>[] = this.renderPrep()
    let newZone: React.ReactElement<any> = this.createNewZone()

    return (
      <div>
        {childComponents}
        {newZone}
      </div>
    )
  }

  protected static markReactLoaded:Boolean = false;
  public componentDidMount(): void {
      super.componentDidMount();

      // Mark the CQ component that react components are now in it
      if( !BaseComponent.markReactLoaded ) {
        BaseComponent.markReactLoaded = true;
        window.setTimeout(() => {
          let cqElement:any = document.getElementById('CQ');
          if( cqElement != null ) {
            cqElement.classList.add('aem-react-loaded');
          }
        }, 1000);
      }
  }

  // Override this to create your components
  protected createChildComponent(resource: Resource, resourceType: string, componentType: any, path: string ):any {
    let props: any = {resource: resource, path: path, key:this.generateKeyRef()}
    let element: any = React.createElement(componentType, props)

    return element
  }

  protected createNewZone() {
    let newZone: React.ReactElement<any> = null
    if( this.isWcmEditable() ) {
      let resourceType = this.getResourceType() + "/../react-parsys/new"
      newZone = <ResourceInclude element="div" path={ this.getPath() + "/*" }
      resourceType={ resourceType }></ResourceInclude>
    }

    return newZone
  }

  protected renderPrep(asComponent?: boolean): React.ReactElement<any>[] {
    let content: any = this.getResource()
    let children: any = ResourceUtils.getChildren(content)
    let childComponents: React.ReactElement<any>[] = []

    Object.keys(children).forEach( (nodeName: string, childIdx: number) => {
      let resource: Resource = children[nodeName]
      let resourceType: string = resource["sling:resourceType"]
      let componentType: typeof React.Component = this.getRegistry().getComponent(resourceType)
      let path: string =  nodeName

      if( !this.isFixedComponent(path) ) {
        if( componentType ) {
          let element: any = null
          const childElement: any = this.createChildComponent(resource, resourceType, componentType, path)

          if ( asComponent ) {
            element = <Frame>{childElement}</Frame>
          } else {
            element = childElement
          }

          if( element ) {
            childComponents.push(element)
          }
        } else {
          childComponents.push(<ResourceInclude path={path} resourceType={resourceType}></ResourceInclude>)
        }
      }
    }, this)

    if (this.isWcmEditable()) {
      let visible: boolean = !this.isCqHidden()
      CqUtils.setVisible(this.getPath() + "/*", visible, true)
    }

    return childComponents
  }
}
