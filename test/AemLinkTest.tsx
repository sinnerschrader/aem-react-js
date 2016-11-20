import {expect} from "chai";
import AemTest from "./AemTest";

import {ResourceComponent} from "../component/ResourceComponent";
import * as React from "react";
import {CheerioWrapper} from "enzyme";
import ComponentRegistry from "../ComponentRegistry";
import ReactParsys from "../component/ReactParsys";
import AemLink from "../router/AemLink";
import {Router, Route, createMemoryHistory} from "react-router";

describe("AemLink", () => {

    let history: HistoryModule.History = createMemoryHistory("/index.html");

    class LinkComponent extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (
                <span>
                    <AemLink to="/bla.html">hallo</AemLink>
                </span>);
        }
    }
    class RouterComponent extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (
                <div>
                    <Router history={history}>
                        <Route path="/index.html" component={LinkComponent}/>
                        <Route path="/bla.html" component={LinkComponent}/>
                    </Router>
                </div>);
        }
    }

    let registry: ComponentRegistry = new ComponentRegistry("/components");
    registry.register(RouterComponent);
    registry.register(ReactParsys);

    let aemTest: AemTest = new AemTest();
    aemTest.addRegistry(registry);
    aemTest.init();

    it("should render AemLink", () => {

        let wrapper: CheerioWrapper<any, any> = aemTest.render({
            resourceType: "/components/router-component"
        });
        expect(wrapper.html()).to.equal("<div><span><a href=\"/bla.html\">hallo</a></span></div>");

    });

});

