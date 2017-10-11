import {expect} from "chai";
import * as enzyme from "enzyme";
import * as React from "react";
import PropTypes from "prop-types";
import "./setup";
import {CommonWrapper} from "enzyme";
import EditDialog from "../component/EditDialog";
import MockSling from "./MockSling";
import {ClientAemContext} from "../AemContext";
import {Container} from "../di/Container";
import {Cq} from "../references";

describe("EditDialog", () => {

    class Wrapper extends React.Component<any, any> {
        public static childContextTypes: any = {
            aemContext: PropTypes.any
        };

        public getChildContext(): any {
            return {
                aemContext: this.props.aemContext
            };
        }

        public render() {
            return (<div>{this.props.children}</div>);
        }
    }

    let container: Container = new Container(({} as Cq));

    let aemContext: ClientAemContext = {
        container: container, componentManager: null, registry: null
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
            element: "ul", child: {
                element: "script", html: "Cq.makeEditable()"
            }
        }));
        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);
        expect(item.html()).to.equal('<div><ul><script>Cq.makeEditable()</script></ul></div>');
    });

    it("should render classic ui", () => {
        container.register("sling", new MockSling(null, {
            "child": {
                "child": null,
                "attributes": {
                    "type": "text/javascript"
                },
                "element": "script",
                "html": "CQ.WCM.edit();"
            },
            "attributes": {
                "className": "more react-parsys"
            },
            "element": "div",
            "html": null
        }));
        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);
        expect(item.html()).to.equal('<div><div class="more react-parsys"><script type="text/javascript">CQ.WCM.edit();</script></div></div>');
    });

    it("should render touch ui", () => {
        container.register("sling", new MockSling(null, {
            "child": {
                "child": null,
                "attributes": {
                    "data-config": "{\"path\":\"/content\"}",
                    "data-path": "/content/"
                },
                "element": "cq",
                "html": ""
            },
            "element": "div",
            "html": null
        }));
        let item: CommonWrapper<any, any> = enzyme.mount(<Wrapper aemContext={aemContext}><EditDialog path="/test"
                                                                                                      resourceType="components/test"/></Wrapper>);
        expect(item.html()).to.equal('<div><div><cq data-config="{&quot;path&quot;:&quot;/content&quot;}" data-path="/content/"></cq></div></div>');
    });

});

