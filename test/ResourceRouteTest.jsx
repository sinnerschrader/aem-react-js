"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var chai_1 = require("chai");
var AemTest_1 = require("./AemTest");
var ResourceComponent_1 = require("../component/ResourceComponent");
var React = require("react");
var ComponentRegistry_1 = require("../ComponentRegistry");
var ReactParsys_1 = require("../component/ReactParsys");
var AemLink_1 = require("../router/AemLink");
var react_router_1 = require("react-router");
var ResourceRoute_1 = require("../router/ResourceRoute");
describe("AemLink", function () {
    var history = react_router_1.createMemoryHistory("/index.html");
    var LinkComponent = (function (_super) {
        __extends(LinkComponent, _super);
        function LinkComponent() {
            return _super.apply(this, arguments) || this;
        }
        LinkComponent.prototype.renderBody = function () {
            return (<span>
                    <AemLink_1.default to="/bla.html">{this.getResource().text}</AemLink_1.default>
                </span>);
        };
        return LinkComponent;
    }(ResourceComponent_1.ResourceComponent));
    var RouterComponent = (function (_super) {
        __extends(RouterComponent, _super);
        function RouterComponent() {
            return _super.apply(this, arguments) || this;
        }
        RouterComponent.prototype.renderBody = function () {
            return (<div>
                    <react_router_1.Router history={history}>
                        <react_router_1.Route path="/index.html" component={ResourceRoute_1.default} resourceComponent={LinkComponent}/>
                        <react_router_1.Route path="/bla.html" component={LinkComponent}/>
                    </react_router_1.Router>
                </div>);
        };
        return RouterComponent;
    }(ResourceComponent_1.ResourceComponent));
    var registry = new ComponentRegistry_1.default("/components");
    registry.register(RouterComponent);
    registry.register(ReactParsys_1.default);
    var aemTest = new AemTest_1.default();
    aemTest.addRegistry(registry);
    aemTest.init();
    aemTest.
        it("should render AemLink", function () {
        var wrapper = aemTest.render({
            resourceType: "/components/router-component"
        });
        chai_1.expect(wrapper.html()).to.equal("<div><span><a href=\"/bla.html\">hallo</a></span></div>");
    });
});
