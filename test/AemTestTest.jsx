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
describe("AemTest", function () {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text() {
            return _super.apply(this, arguments) || this;
        }
        Text.prototype.renderBody = function () {
            var text = this.getResource() ? this.getResource().text : "unknown";
            return (<span>{text}</span>);
        };
        return Text;
    }(ResourceComponent_1.ResourceComponent));
    var registry = new ComponentRegistry_1.default("/components");
    registry.register(Text);
    registry.register(ReactParsys_1.default);
    var aemTest = new AemTest_1.default();
    aemTest.addRegistry(registry);
    aemTest.init();
    it("should render Text", function () {
        var wrapper = aemTest.render({
            resourceType: "/components/text",
            text: "Hallo"
        });
        chai_1.expect(wrapper.html()).to.equal("<span>Hallo</span>");
    });
});
