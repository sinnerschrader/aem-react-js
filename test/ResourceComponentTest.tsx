import * as ReactTestUtils from "react-addons-test-utils";

import {expect} from "chai";

import "./setup";

import {ClientAemContext} from "../AemContext";
import {ResourceComponent} from "../component/ResourceComponent";
import RootComponent from "../component/RootComponent";
import * as React from "react";
import RootComponentRegistry from "../RootComponentRegistry";
import ComponentRegistry from "../ComponentRegistry";
import {Container} from "../di/Container";
import {EditDialogData} from "../store/Sling";
import ComponentManager from "../ComponentManager";

describe("ResourceComponent", () => {
    class Test extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<div>{this.props.resource ? this.props.resource.text : "unknown"}</div>);
        }
    }


    class Embedded extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<Test path="test"></Test>);
        }
    }


    let testRegistry: ComponentRegistry = new ComponentRegistry();
    testRegistry.register(Test);
    let registry: RootComponentRegistry = new RootComponentRegistry();
    registry.add(testRegistry);

    let container: Container = new Container();
    let componentManager: ComponentManager = new ComponentManager(registry, container);

    let aemContext: ClientAemContext = {
        registry: registry, componentManager: componentManager, container: container
    };

    it("should get resource directly", () => {


        container.register("sling", {
            subscribe: function (listener: ResourceComponent<any, any, any>, path: string, options?: any): void {
                if (path === "/content/embed") {
                    listener.changedResource(path, {embed: "Hallo"});
                } else if (path === "/content/embed/test") {
                    listener.changedResource(path, {text: "Hallo"});
                }
            }, renderDialogScript: function (): EditDialogData {
                return {element: "div"};
            }
        });
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Embedded} path="/content/embed"/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/embed/test");
        expect(test.props.path).to.equal("test");
        expect(test.getResource().text).to.equal("Hallo");

    });

    it("should get resource from absolute Path", () => {

        container.register("sling", {
            subscribe: function (listener: ResourceComponent<any, any, any>, path: string, options?: any) {
                if (path === "/content/test") {
                    listener.changedResource(path, {text: "Hallo"});
                }
            }, renderDialogScript: function (): EditDialogData {
                return {element: "div"};
            }
        });

        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Test} path="/content/test"/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/test");
        expect(test.props.path).to.equal("/content/test");
        expect(test.getResource().text).to.equal("Hallo");

    });


});

