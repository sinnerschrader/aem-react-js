import {expect} from "chai";
import AemTest from "./AemTest";
import * as enzyme from "enzyme";

import {ResourceComponent} from "../component/ResourceComponent";
import * as React from "react";
import {ReactWrapper} from "enzyme";
import ComponentRegistry from "../ComponentRegistry";
import ReactParsys from "../component/ReactParsys";
import AemLink from "../router/AemLink";
import {Router, Route, createMemoryHistory} from "react-router";
import {ShallowWrapper} from "enzyme";
import {History, MemoryHistoryOptions} from "history";

describe("AemLink", () => {

    let index: MemoryHistoryOptions = {
        entries: "/index.html"
    };
    let history: History = createMemoryHistory(index);

    class LinkComponent extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (
                <span>
                    <AemLink to="/bla.html">hallo</AemLink>
                </span>
            );
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
                </div>
            );
        }
    }

    let registry: ComponentRegistry = new ComponentRegistry("/components");
    registry.register(RouterComponent);
    registry.register(ReactParsys);

    let aemTest: AemTest = new AemTest();
    aemTest.addRegistry(registry);
    aemTest.init();

    it("should render AemLink in Router", () => {

        let wrapper: ReactWrapper<any, any> = aemTest.render({
            resourceType: "/components/router-component"
        });
        expect(wrapper.html()).to.equal("<span><a href=\"/bla.html\">hallo</a></span>");

    });

    it("should render AemLink", () => {

        class MyLink extends AemLink {
            protected isClickable(): boolean {
                return true;
            }
        }
        let router: any = {}
        let history = {
            createLocation: function () {
                return {pathname: "bla.html"};
            }

        };
        let container = {
            get: function () {
                return history;
            }
        };


        let context: any = {
            router: router,
            wcmmode: "disabled",

            aemContext: {
                container: container
            }
        };


        let wrapper: ShallowWrapper<any, any> = enzyme.shallow((<MyLink to="bla.html"/>), {context: context})
        wrapper.simulate('click');

    });

})
;

