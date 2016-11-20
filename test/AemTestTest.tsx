import {expect} from "chai";
import AemTest from "./AemTest";
import {ResourceComponent} from "../component/ResourceComponent";
import * as React from "react";
import {CheerioWrapper} from "enzyme";
import ComponentRegistry from "../ComponentRegistry";
import ReactParsys from "../component/ReactParsys";

describe("AemTest", () => {
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

    it("should render Text", () => {



        let wrapper: CheerioWrapper<any, any> = aemTest.render( {
            resourceType: "/components/text",
            text: "Hallo"
        });
        expect(wrapper.html()).to.equal("<span>Hallo</span>");

    });

});

