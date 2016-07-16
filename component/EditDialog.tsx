import * as React from "react";
import AemComponent from "./AemComponent";
import CqUtils from "../CqUtils";
import {Sling} from "../store/Sling";


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
        let script: string = sling.renderDialogScript(this.props.path, this.props.resourceType);

        /*
        if (typeof window !== "undefined") {
            setTimeout(() => {
                eval(script);
            }, 500);
        }
        */

        return React.createElement("script", {
            // "data-always-hidden": this.props.hidden,
            hidden: !!this.props.hidden, dangerouslySetInnerHTML: {__html: script}
        });
    }


}