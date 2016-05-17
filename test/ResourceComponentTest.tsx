import * as ReactTestUtils from "react-addons-test-utils";

import {expect} from "chai";
import {STATE} from "../store/reducers";

import "./setup";

import {AemContext} from "../AemContext";
import {ResourceComponent} from "../component/ResourceComponent";
import RootComponent from "../component/RootComponent";
import * as React from "react";
import RootComponentRegistry from "../RootComponentRegistry";
import ComponentRegistry from "../ComponentRegistry";
import ComponentManager from "../ComponentManager";
import connect from "../store/connect";
import container from "../di/container";

describe("ResourceComponent", () => {
    class TestComponent extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement[] {
            return (<div>{this.props.resource ? this.props.resource.text : "unknown"}</div>);
        }
    }

    const Test: any = connect(TestComponent);

    class EmbeddedComponent extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement[] {
            return (<Test path="{this.props.childPath}"{...this.getPathInfo(this.props.childPath)}></Test>);
        }
    }

    const Embedded: any = connect(EmbeddedComponent);

    let testRegistry: ComponentRegistry = new ComponentRegistry();
    testRegistry.register(TestComponent);
    let registry: RootComponentRegistry = new RootComponentRegistry();
    registry.add(testRegistry);

    let componentManager: ComponentManager = new ComponentManager(registry);

    let aemContext: AemContext = {
        registry: registry, componentManager: componentManager
    };

    it("should get resource directly", () => {

        const resource: any = {"sling:resourceType": "test", text: "Hallo"};
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Test} rootPath="/content" resource={resource}/>
        );

        let test: TestComponent = ReactTestUtils.findRenderedComponentWithType(item, TestComponent);

        expect(test.props.rootPath).to.equal("/content");
        expect(test.props.resource.text).to.equal("Hallo");


    });

    it("should get resource from relativePath", () => {

        container.register("sling", {
            getResource: function (path: string, options?: any) {
                if (path == "/content/test") {
                    return {
                        then: function (cb: Function) {
                            cb({text: "Hallo"});
                        }
                    };
                }
            }
        })

        const resource: any = {"test": null};
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={EmbeddedComponent} childPath="test" rootPath="/content" resource={resource}/>
        );

        let test: TestComponent = ReactTestUtils.findRenderedComponentWithType(item, TestComponent);

        expect(test.props.rootPath).to.equal("/content");
        expect(test.props.path).to.equal("test");
        expect(test.props.resource.resource.text).to.equal("Hallo");

    });


    it("should load resource from absolutePath", () => {

        container.register("sling", {
            getResource: function (path: string, options?: any) {
                return {
                    then: function (cb: Function) {
                        cb({text: "bye"});
                    }
                };
            }
        })
        const resource: any = {};
        let item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={EmbeddedComponent} childPath="/x/oops" rootPath="/content" resource={resource}/>
        );
        item = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={EmbeddedComponent} childPath="/x/oops" rootPath="/content" resource={resource}/>
        );

        let test: TestComponent = ReactTestUtils.findRenderedComponentWithType(item, TestComponent);

        let store: any = container.get("reduxStore");

        expect(test.props.path).to.equal("/x/oops");
        expect(test.props.state).to.equal(STATE.LOADED);
        expect(test.props.resource.resource.text).to.equal("bye");

    });

});

