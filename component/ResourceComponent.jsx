"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AemComponent_1 = require("./AemComponent");
var EditDialog_1 = require("./EditDialog");
var ResourceUtils_1 = require("../ResourceUtils");
var include_1 = require("../include");
(function (STATE) {
    STATE[STATE["LOADING"] = 0] = "LOADING";
    STATE[STATE["LOADED"] = 1] = "LOADED";
    STATE[STATE["FAILED"] = 2] = "FAILED";
})(exports.STATE || (exports.STATE = {}));
var STATE = exports.STATE;
/**
 * Provides base functionality for components that are
 */
var ResourceComponent = (function (_super) {
    __extends(ResourceComponent, _super);
    function ResourceComponent() {
        return _super.apply(this, arguments) || this;
    }
    ResourceComponent.prototype.getChildContext = function () {
        return {
            wcmmode: this.getWcmmode(), path: this.getPath()
        };
    };
    ResourceComponent.prototype.componentWillMount = function () {
        this.initialize();
    };
    ResourceComponent.prototype.componentDidUpdate = function (prevProps) {
        this.initialize();
    };
    ResourceComponent.prototype.initialize = function () {
        var absolutePath;
        if (ResourceUtils_1.default.isAbsolutePath(this.props.path)) {
            absolutePath = this.props.path;
        }
        else {
            absolutePath = this.context.path + "/" + this.props.path;
        }
        if (absolutePath !== this.getPath()) {
            this.setState({ absolutePath: absolutePath, state: STATE.LOADING });
            this.getAemContext().container.get("sling").subscribe(this, absolutePath, { depth: this.getDepth() });
        }
    };
    ResourceComponent.prototype.getWcmmode = function () {
        return this.props.wcmmode || this.context.wcmmode;
    };
    ResourceComponent.prototype.getPath = function () {
        if (typeof this.state !== "undefined" && this.state !== null) {
            return this.state.absolutePath;
        }
        else {
            return null;
        }
    };
    ResourceComponent.prototype.renderLoading = function () {
        return (<span>Loading</span>);
    };
    ResourceComponent.prototype.render = function () {
        var child;
        if (this.state.state === STATE.LOADING) {
            child = this.renderLoading();
        }
        else if (!!this.props.skipRenderDialog) {
            console.log("RC skip root dialog");
            return this.renderBody();
        }
        else {
            console.log("RC render root dialog");
            child = this.renderBody();
        }
        return (<EditDialog_1.default path={this.getPath()} resourceType={this.getResourceType()} className={this.props.className}>
                {child}
            </EditDialog_1.default>);
    };
    ResourceComponent.prototype.getRegistry = function () {
        return this.context.aemContext.registry;
    };
    ResourceComponent.prototype.getResource = function () {
        return this.state.resource;
    };
    ResourceComponent.prototype.getResourceType = function () {
        return this.context.aemContext.registry.getResourceType(this);
    };
    ResourceComponent.prototype.changedResource = function (path, resource) {
        this.setState(({ state: STATE.LOADED, resource: resource, absolutePath: path }));
    };
    ResourceComponent.prototype.getDepth = function () {
        return 0;
    };
    ResourceComponent.prototype.renderChildren = function (path, childClassName, childElementName) {
        var _this = this;
        if (path && path.match(/^\//)) {
            throw new Error("path must be relative. was " + path);
        }
        var childrenResource = !!path ? this.getResource()[path] : this.getResource();
        var children = ResourceUtils_1.default.getChildren(childrenResource);
        var childComponents = [];
        var basePath = !!path ? path + "/" : "";
        // TODO alternatively create a div for each child and set className/elementName there
        Object.keys(children).forEach(function (nodeName, childIdx) {
            var resource = children[nodeName];
            var resourceType = resource["sling:resourceType"];
            var actualPath = basePath + nodeName;
            var componentType = _this.getRegistry().getComponent(resourceType);
            if (childElementName) {
                if (componentType) {
                    var props = { resource: resource, path: actualPath, reactKey: path, key: nodeName };
                    childComponents.push(React.createElement(childElementName, {
                        key: nodeName, className: childClassName
                    }, React.createElement(componentType, props)));
                }
                else {
                    childComponents.push(React.createElement(childElementName, {
                        key: nodeName, className: childClassName
                    }, React.createElement(include_1.ResourceInclude, { path: actualPath, key: nodeName, resourceType: resourceType })));
                }
            }
            else {
                if (componentType) {
                    var props = { resource: resource, path: basePath + nodeName, reactKey: path, key: nodeName, className: childClassName };
                    childComponents.push(React.createElement(componentType, props));
                }
                else {
                    childComponents.push(<include_1.ResourceInclude path={actualPath} key={nodeName} resourceType={resourceType}></include_1.ResourceInclude>);
                }
            }
        }, this);
        var newZone = null;
        if (this.isWcmEnabled()) {
            var resourceType = "foundation/components/parsys/new";
            newZone = <include_1.ResourceInclude key="newZone" element="div" path="*" resourceType={resourceType}></include_1.ResourceInclude>;
            childComponents.push(newZone);
        }
        return childComponents;
    };
    return ResourceComponent;
}(AemComponent_1.default));
exports.ResourceComponent = ResourceComponent;
ResourceComponent.childContextTypes = {
    wcmmode: React.PropTypes.string,
    path: React.PropTypes.string,
};
