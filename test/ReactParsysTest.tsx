import {expect} from "chai";
import AemTest from "./AemTest";

import {ResourceComponent} from "../component/ResourceComponent";
import * as React from "react";
import {CheerioWrapper} from "enzyme";
import ComponentRegistry from "../ComponentRegistry";
import ReactParsys from "../component/ReactParsys";

describe("ReactParsys", () => {
    class Text extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            let text: string = this.getResource() ? this.getResource().text : "unknown";
            return (<span >{text}</span>);
        }
    }

    let registry: ComponentRegistry = new ComponentRegistry("/components");
    registry.register(Text);
    registry.register(ReactParsys);

    let aemTest: AemTest = new AemTest();
    aemTest.addRegistry(registry);
    aemTest.init();

    it("should render ReactParsys with a single child", () => {

        let wrapper: CheerioWrapper<any, any> = aemTest.render({
            resourceType: "/components/react-parsys",
            child_1: {
                "sling:resourceType": "/components/text",
                text: "Hallo"
            }
        });
        expect(wrapper.html()).to.equal("<div><div class=\"dialog\"><span>Hallo</span></div></div>");

    });

    it("should render ReactParsys with no children", () => {

        let wrapper: CheerioWrapper<any, any> = aemTest.render({
            resourceType: "/components/react-parsys",
        });
        expect(wrapper.html()).to.equal("<div></div>");

    });
});

