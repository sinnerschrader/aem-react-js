import * as ReactTestUtils from "react-addons-test-utils";
import {expect} from "chai";
import * as enzyme from "enzyme";

import "./setup";
import {ClientAemContext} from "../AemContext";
import {ResourceComponent} from "../component/ResourceComponent";
import RootComponent from "../component/RootComponent";
import * as React from "react";
import RootComponentRegistry from "../RootComponentRegistry";
import ComponentRegistry from "../ComponentRegistry";
import {Container} from "../di/Container";
import ComponentManager from "../ComponentManager";
import {CommonWrapper} from "enzyme";
import MockSling from "./MockSling";
import {Cq} from "../references";

describe("ResourceComponent", () => {
    class Test extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<span className="test">{this.props.resource ? this.props.resource.text : "unknown"}</span>);
        }
    }


    class Embedded extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<Test path="test"></Test>);
        }
    }

    class AemContainer extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            let children: React.ReactElement<any>[] = this.renderChildren(this.props.childPath, this.props.childClassName, this.props.childElementName);
            return (<div data-container>{children}</div>);
        }
    }

    function createContainer(className?: string, elementName?: string, childPath?: string): typeof AemContainer {
        return class AnonComponent extends ResourceComponent<any, any, any> {
            public renderBody(): React.ReactElement<any> {
                let children: React.ReactElement<any>[] = this.renderChildren(childPath, className, elementName);
                return (<div data-container>{children}</div>);
            }
        };
    }


    let testRegistry: ComponentRegistry = new ComponentRegistry();
    testRegistry.register(Test);
    let registry: RootComponentRegistry = new RootComponentRegistry();
    registry.add(testRegistry);
    registry.init();

    let container: Container = new Container(({} as Cq));
    let componentManager: ComponentManager = new ComponentManager(registry, container);

    let aemContext: ClientAemContext = {
        registry: registry, componentManager: componentManager, container: container
    };

    it("should render loading message", () => {


        container.register("sling", new MockSling({}));

        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={Test} path="/content/notfound"/>);
        expect(item.find("span").html()).to.equal("<span>Loading</span>");

    });

    it("should get resource directly", () => {


        container.register("sling", new MockSling({
            "/content/embed": {embed: "Hallo"}, //
            "/content/embed/test": {text: "Hallo"}
        }));
        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Embedded} path="/content/embed"/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/embed/test");
        expect(test.props.path).to.equal("test");
        expect(test.getResource().text).to.equal("Hallo");

    });

    it("should get resource from absolute Path", () => {

        container.register("sling", new MockSling({
            "/content/test": {text: "Hallo"}
        }));

        const item: any = ReactTestUtils.renderIntoDocument(
            <RootComponent aemContext={aemContext} comp={Test} path="/content/test"/>
        );

        let test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

        expect(test.getPath()).to.equal("/content/test");
        expect(test.props.path).to.equal("/content/test");
        expect(test.getResource().text).to.equal("Hallo");

    });

    it("should render htl children wcmmode disabled", () => {
        container.register("sling", new MockSling({
            "/content": {
                "child1": {
                    "sling:resourceType": "htl/test", "text": "Hallo", "jcr:primaryType": "nt:unstructured"
                }
            }
        }));

        const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="disabled" aemContext={aemContext} comp={AemContainer}
                                                                                     path="/content"/>);

        let include: CommonWrapper<any, any> = item.find("include");
        expect(include[0].attribs.path).to.equal("/content/child1");
        expect(include[0].attribs.resourcetype).to.equal("htl/test");

    });

    describe("should render htl children wcmmode enabled", () => {
        before(() => {
            container.register("sling", new MockSling({
                "/content": {
                    "child1": {
                        "sling:resourceType": "htl/test", "text": "Hallo", "jcr:primaryType": "nt:unstructured"
                    }
                }
            }));
        });

        it("default ", () => {
            const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="edit" aemContext={aemContext} comp={AemContainer}
                                                                                         path="/content"/>);

            let include: CommonWrapper<any, any> = item.find("include");
            expect(include[1].attribs.path).to.equal("/content/*");
            expect(include[1].attribs.resourcetype).to.equal("foundation/components/parsys/new");
        });

        it("with child wrapper ", () => {
            const item: CommonWrapper<RootComponent, any> = enzyme.mount(<RootComponent wcmmode="disabled" aemContext={aemContext}
                                                                                        comp={createContainer("childClass", "el")}
                                                                                        path="/content"/>);

            let dialog: CommonWrapper<any, any> = item.find("el");
            expect(dialog.props().className).to.equal("childClass");
            expect(dialog.html()).to.equal('<el class="childClass"><div><include resourcetype="htl/test" path="/content/child1"></include></div></el>');
        });

    });

    describe("should render react children wcmmode disabled", () => {
        before(() => {
            container.register("sling", new MockSling({
                "/content": {
                    "child1": {
                        "sling:resourceType": "test", "text": "OOPS", "jcr:primaryType": "nt:unstructured"
                    }
                }, "/content/child1": {
                    "sling:resourceType": "test", "text": "OOPS", "jcr:primaryType": "nt:unstructured"
                }
            }));
        });
        it("default ", () => {


            const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="disabled" aemContext={aemContext} comp={AemContainer}
                                                                                         path="/content"/>);

            let test: CommonWrapper<any, any> = item.find(".test");
            expect(test[0].children[0].data).to.equal("OOPS");

        });
        it("with child wrapper", () => {


            const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="disabled" aemContext={aemContext}
                                                                                         comp={createContainer("childClass","el")}
                                                                                         path="/content"/>);

            let test: CommonWrapper<any, any> = item.find("el");
            expect(test.length).to.equal(1);
            expect(test[0].attribs.class).to.equal("childClass");

        });
        it("with child class name", () => {


            const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="disabled" aemContext={aemContext}
                                                                                         comp={createContainer("childClass")}
                                                                                         path="/content"/>);

            let dialog: CommonWrapper<any, any> = item.find(".dialog");
            expect(dialog[0].attribs.class.split(" ")).to.contain("childClass");

        });


    });

    describe("should render react children with child path", () => {
        before(() => {
            let child: any = {
                "sling:resourceType": "test", "text": "OOPS", "jcr:primaryType": "nt:unstructured"
            };
            container.register("sling", new MockSling({
                "/content": {
                    "children": {child1: child}
                }, "/content/children": {
                    "child1": child
                }, "/content/children/child1": child
            }));
        });

        it("with child path", () => {


            const item: CommonWrapper<RootComponent, any> = enzyme.render(<RootComponent wcmmode="disabled" aemContext={aemContext}
                                                                                         comp={createContainer("childClass", null, "children")}
                                                                                         path="/content"/>);

            let child: CommonWrapper<any, any> = item.find(".test");
            expect(child[0].children[0].data).to.equal("OOPS");

        });

    });


});

