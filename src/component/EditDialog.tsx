import * as React from "react";
import AemComponent from "./AemComponent";
import CqUtils from "../CqUtils";


export interface EditDialogProps {
    path: string;
    resourceType: string;
    hidden?: boolean;
}


export default class EditDialog extends AemComponent<EditDialogProps, any> {

    public render(): React.ReactElement<any> {


        let script: string = "{{{edit-dialog \"" + this.props.path + "\" \"" + this.props.resourceType + "\"}}}";

        if (this.props.hidden) {
            CqUtils.setVisible(this.props.path, false, false);
        }

        return React.createElement("script", {
            // "data-always-hidden": this.props.hidden,
            hidden: !!this.props.hidden, dangerouslySetInnerHTML: {__html: script}
        });
    }


}