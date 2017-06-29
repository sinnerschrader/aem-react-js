import {expect} from "chai";
import * as enzyme from "enzyme";
import * as React from "react";
import {CommonWrapper} from "enzyme";
import {EditDialog} from "../EditDialog";
import {MockSling} from "../../test/MockSling";
import {ClientAemContext} from "../../AemContext";
import {Container, Cq} from "../../di/Container";

describe("EditDialog", () => {
    class Wrapper extends React.Component<any, any> {
        public static childContextTypes: any = {
            aemContext: React.PropTypes.any,
        };

        public getChildContext(): any {
            return {
                aemContext: this.props.aemContext,
            };
        }

        public render(): JSX.Element {
            return (<div>{this.props.children}</div>);
        }
    }

    let container: Container = new Container(({} as Cq));

    let aemContext: ClientAemContext = {
        componentManager: null, container: container, registry: null,
    };

    it("should render wrapper element", () => {
        container.register("sling", new MockSling(null));

        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test" resourceType="components/test"/></Wrapper>);

        expect(item.html()).to.equal('<div><div class="dialog"></div></div>');
    });

    it("should render wrapper element with extra className", () => {
        container.register("sling", new MockSling());

        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog className="hi" path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);

        expect(item.html()).to.equal('<div><div class="dialog hi"></div></div>');
    });

    it("should render wrapper element with extra className and existing className", () => {
        container.register("sling", new MockSling(null, {
            child: {
                element: "script", html: "Cq.makeEditable()",
            }, element: "ul",
        }));

        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);

        expect(item.html()).to.equal("<div><ul><script>Cq.makeEditable()</script></ul></div>");
    });

    it("should render classic ui", () => {
        container.register("sling", new MockSling(null, {
            "attributes": {
                "className": "more react-parsys",
            },
            "child": {
                "attributes": {
                    "type": "text/javascript",
                },
                "child": null,
                "element": "script",
                "html": "CQ.WCM.edit();",
            },
            "element": "div",
            "html": null,
        }));

        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);

        expect(item.html()).to.equal('<div><div class="more react-parsys"><script type="text/javascript">CQ.WCM.edit();</script></div></div>');
    });

    it("should render touch ui", () => {
        container.register("sling", new MockSling(null, {
            "child": {
                "attributes": {
                    "data-config": "{\"path\":\"/content\"}",
                    "data-path": "/content/",
                },
                "child": null,
                "element": "cq",
                "html": "",
            },
            "element": "div",
            "html": null,
        }));

        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);

        expect(item.html()).to.equal('<div><div><cq data-config="{&quot;path&quot;:&quot;/content&quot;}" data-path="/content/"></cq></div></div>');
    });
});
