import * as React from "react";
import AemComponent from "./AemComponent";
import {Sling, EditDialogData} from "../store/Sling";


export interface EditDialogProps {
    path: string;
    resourceType: string;
    hidden?: boolean;
}


export default class EditDialog extends AemComponent<EditDialogProps, any> {

    public render(): React.ReactElement<any> {
        let sling: Sling = this.context.aemContext.container.get("sling");
        let dialog: EditDialogData = sling.renderDialogScript(this.props.path, this.props.resourceType);

        if (dialog) {
            return this.createWrapperElement(dialog);
        } else {
            return (this.props.children as React.ReactElement<any>);
        }
    }

    private createWrapperElement(dialog: EditDialogData): React.ReactElement<any> {
        return React.createElement(dialog.element, dialog.attributes, this.props.children, this.createAuthorElement(dialog.child));
    }

    private createAuthorElement(dialog: EditDialogData): React.ReactElement<any> {
        if (!dialog) {
            return null;
        }
        if (dialog.html) {
            dialog.attributes["dangerouslySetInnerHTML"] = {__html: dialog.html};
        }
        return React.createElement(dialog.element, dialog.attributes);
    }


}
