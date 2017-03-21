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
import {ResourceInclude} from "../include";
import AemTest from "./AemTest";
import {CheerioWrapper} from "enzyme";


describe("ResourceInclude", () => {
    class Test extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<span><ResourceInclude path="embed" resourceType="/components/something"></ResourceInclude></span>);
        }
    }

    class Test2 extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<span><ResourceInclude path="embed" resourceType="/components/text"></ResourceInclude></span>);
        }
    }

    class Text extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (<span>{this.props.text}</span>);
        }
    }

    let registry: ComponentRegistry = new ComponentRegistry("/components");
    registry.register(Test);
    registry.register(Test2);
    registry.registerVanilla({component: Text})

    let aemTest: AemTest = new AemTest();
    aemTest.addRegistry(registry);
    aemTest.init();


    it("should render included resource", () => {


        let wrapper: CheerioWrapper<any, any> = aemTest.render({resourceType: "/components/test"})

        expect(wrapper.html()).to.equal("<span><div><include resourcetype=\"/components/something\" path=\"//embed\"></include></div></span>");

    });

    it("should render included vanilla resource", () => {


        let wrapper: CheerioWrapper<any, any> = aemTest.render({
            resourceType: "/components/test2",
            embed: {text: "hallo"}
        }, "/content")

        expect(wrapper.html()).to.equal("<span><div class=\"dialog\"><span>hallo</span></div></span>");

    });

});

