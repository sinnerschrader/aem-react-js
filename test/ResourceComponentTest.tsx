import * as ReactTestUtils from "react-addons-test-utils";

import {expect} from "chai";

import "./setup";

import {AemContext} from "../AemContext";
import {ResourceComponent} from "../component/ResourceComponent";
import RootComponent from "../component/RootComponent";
import * as React from "react";
import RootComponentRegistry from "../RootComponentRegistry";
import ComponentRegistry from "../ComponentRegistry";
import ComponentManager from "../ComponentManager";
import {Container} from "../di/Container";

describe("ResourceComponent", () => {
    class Test extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement[] {
            return (<div>{this.props.resource ? this.props.resource.text : "unknown"}</div>);
        }
    }


    class Embedded extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement[] {
            return (<Test path={this.props.childPath}></Test>);
        }
    }


    let testRegistry: ComponentRegistry = new ComponentRegistry();
    testRegistry.register(Test);
    let registry: RootComponentRegistry = new RootComponentRegistry();
    registry.add(testRegistry);

    let componentManager: ComponentManager = new ComponentManager(registry);

    let container = new Container();

    let aemContext: AemContext = {
        registry: registry, componentManager: componentManager, container: container
    };

    it("should get resource directly", () => {


        container.register("sling", {
            subscribe: function (listener: ResourceComponent, path: string, options?: any): void {
                if (path === "/content/embed") {
                    listener.changedResource({embed: "Hallo"});
                } else if (path === "/content/embed/test") {
                    listener.changedResource({text: "Hallo"});
                }
            }
        });
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Embedded} rootPath="/content" childPath="test" path="embed"/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/embed/test");
        expect(test.props.path).to.equal("test");
        expect(test.getResource().text).to.equal("Hallo");


    });

    it("should get resource from absolute Path", () => {

        container.register("sling", {
            subscribe: function (listener: ResourceComponent, path: string, options?: any) {
                if (path === "/content/test") {
                    listener.changedResource({text: "Hallo"});
                }
            }
        })

        const resource: any = {"test": null};
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Test} path="/content/test" resource={resource}/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/test");
        expect(test.props.path).to.equal("/content/test");
        expect(test.getResource().text).to.equal("Hallo");

    });

    it("should get resource from relative Path", () => {

        container.register("sling", {
            subscribe: function (listener: ResourceComponent, path: string, options?: any) {
                if (path === "/content/test") {
                    listener.changedResource({text: "Hallo"});
                }
            }
        })

        const resource: any = {"test": null};
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} rootPath="/content" comp={Test} path="test" resource={resource}/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/test");
        expect(test.props.path).to.equal("test");
        expect(test.getResource().text).to.equal("Hallo");

    });


});

