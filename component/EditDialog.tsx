import * as React from "react";
import AemComponent from "./AemComponent";
import {Sling, EditDialogData} from "../store/Sling";


export interface EditDialogProps {
    path: string;
    resourceType: string;
    className?: string;
}


export default class EditDialog extends AemComponent<EditDialogProps, any> {

    public render(): React.ReactElement<any> {
        let sling: Sling = this.getComponent("sling");
        let dialog: EditDialogData = sling.renderDialogScript(this.props.path, this.props.resourceType);

        if (dialog) {
            return this.createWrapperElement(dialog);
        } else {
            return (this.props.children as React.ReactElement<any>);
        }
    }

    private createWrapperElement(dialog: EditDialogData): React.ReactElement<any> {
        let attributes: {[name: string]: any} = {};
        if (dialog.attributes) {
            Object.keys(dialog.attributes).forEach((key: string) => attributes[key] = dialog.attributes[key]);
            if (this.props.className) {
                if (typeof attributes["className"] !== "undefined" && attributes["className"] !== null) {
                    attributes["className"] += " " + this.props.className;
                } else {
                    attributes["className"] = this.props.className;
                }
            }
        }
        return React.createElement(dialog.element, attributes, this.props.children, this.createAuthorElement(dialog.child));
    }

    private createAuthorElement(dialog: EditDialogData): React.ReactElement<any> {
        if (!dialog) {
            return null;
        }
        let attributes: any = {};
        if (!!dialog.attributes) {
            Object.keys(dialog.attributes).forEach((key: string) => {
                attributes[key] = dialog.attributes[key];
            });
        }
        if (dialog.html) {
            if (!attributes) {
                attributes = {};
            }
            attributes["dangerouslySetInnerHTML"] = {__html: dialog.html};
        }
        return React.createElement(dialog.element, attributes);
    }


}
