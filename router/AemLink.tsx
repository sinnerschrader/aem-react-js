import * as React from "react";
import {Link} from "react-router";

export default class AemLink extends Link {

    public static contextTypes: any = {
        wcmmode: React.PropTypes.string,
        history: React.PropTypes.any
    }

    public context: {
        wcmmode: string;
        history: any;
    };

    public isWcmEnabled(): boolean {
        return !this.context.wcmmode || this.context.wcmmode !== "disabled";
    }

    public handleClick(event: any): void {
        if (!this.isWcmEnabled()) {
            return super.handleClick(event);
        }
    }

}


