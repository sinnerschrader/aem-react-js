import {expect} from "chai";
import AemTest from "./AemTest";

import {ResourceComponent} from "../component/ResourceComponent";
import * as React from "react";
import ComponentRegistry from "../ComponentRegistry";
import ReactParsys from "../component/ReactParsys";
import AemLink from "../router/AemLink";
import {Router, Route, createMemoryHistory} from "react-router";
import ResourceRoute from "../router/ResourceRoute";
import ResourceMappingImpl from "../router/ResourceMappingImpl";
import {RouteProps} from "react-router";
import {History, MemoryHistoryOptions} from 'history';

describe("ResourceRoute", () => {

    let index: MemoryHistoryOptions = {
        entries: "/index.html"
    };
    let history: History = createMemoryHistory(index);

    class LinkComponent extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (
                <span>
                    <AemLink to="/bla.html">{this.getResource().text}</AemLink>
                </span>);
        }
    }
    class RouterComponent extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            let route = React.createElement(Route, ({path: "/index.html", component: ResourceRoute, resourceComponent: LinkComponent} as RouteProps));
            return (
                <div>
                    <Router history={history}>
                        {route}
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
    aemTest.currentAemContext.container.register("resourceMapping", new ResourceMappingImpl());

    it("should render content under /index", () => {

        aemTest.addResource("/index", {
            text: "hallo"
        });
        let wrapper: any = aemTest.render({
            resourceType: "/components/router-component"
        });
        expect(wrapper.html()).to.equal("<div class=\"dialog\"><span><a href=\"/bla.html\"></a></span></div>");

    });

    it("should render loading for unavailable content", () => {

        aemTest.addResource("/index", null);
        let wrapper: any = aemTest.render({
            resourceType: "/components/router-component"
        });
        expect(wrapper.html()).to.equal("<div class=\"dialog\"><span>Loading</span></div>");

    });

});

