import * as React from "react";
import AemComponent from "./AemComponent";
import CqUtils from "../CqUtils";
import {Script} from "../component/Script";
import {Sling, EditDialogData} from "../store/Sling";


export interface EditDialogProps {
    path: string;
    resourceType: string;
    hidden?: boolean;
}


export default class EditDialog extends AemComponent<EditDialogProps, any> {

    public render(): React.ReactElement<any> {

        if (this.props.hidden) {
            CqUtils.setVisible(this.props.path, false, false);
        }

        let sling: Sling = this.context.aemContext.container.get("sling");
        let dialog: EditDialogData = sling.renderDialogScript(this.props.path, this.props.resourceType);

        if (dialog && dialog.element) {
            if (dialog.script) {
                let script: React.ReactElement<any> = (<Script js={dialog.script}></Script>);
                return React.createElement(dialog.element, dialog.attributes, this.props.children, script);
            }
            return React.createElement(dialog.element, dialog.attributes, this.props.children);

        } else {
            return (this.props.children as React.ReactElement<any>);
        }
    }

}
