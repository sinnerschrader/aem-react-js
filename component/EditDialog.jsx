"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AemComponent_1 = require("./AemComponent");
var EditDialog = (function (_super) {
    __extends(EditDialog, _super);
    function EditDialog() {
        return _super.apply(this, arguments) || this;
    }
    EditDialog.prototype.render = function () {
        var sling = this.getComponent("sling");
        var dialog = sling.renderDialogScript(this.props.path, this.props.resourceType);
        if (dialog) {
            return this.createWrapperElement(dialog);
        }
        else {
            return this.props.children;
        }
    };
    EditDialog.prototype.createWrapperElement = function (dialog) {
        var attributes = {};
        if (dialog.attributes) {
            Object.keys(dialog.attributes).forEach(function (key) { return attributes[key] = dialog.attributes[key]; });
            if (this.props.className) {
                if (typeof attributes["className"] !== "undefined" && attributes["className"] !== null) {
                    attributes["className"] += " " + this.props.className;
                }
                else {
                    attributes["className"] = this.props.className;
                }
            }
        }
        return React.createElement(dialog.element, attributes, this.props.children, this.createAuthorElement(dialog.child));
    };
    EditDialog.prototype.createAuthorElement = function (dialog) {
        if (!dialog) {
            return null;
        }
        var attributes = {};
        if (!!dialog.attributes) {
            Object.keys(dialog.attributes).forEach(function (key) {
                attributes[key] = dialog.attributes[key];
            });
        }
        if (dialog.html) {
            attributes["dangerouslySetInnerHTML"] = { __html: dialog.html };
        }
        return React.createElement(dialog.element, attributes);
    };
    return EditDialog;
}(AemComponent_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditDialog;
