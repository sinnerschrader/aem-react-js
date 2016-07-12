import * as React from "react";
import {ClientAemContext} from "../AemContext";
import RootComponentRegistry from "../RootComponentRegistry";

/**
 * Provides base functionality for components that are
 */
export default class AemComponent<P, S> extends React.Component<P, S> {


    public static contextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        resource: React.PropTypes.any, //
        cqHidden: React.PropTypes.bool, //
        aemContext: React.PropTypes.any
    };

    public context: {
        wcmmode: string;
        path: string;
        resource: any;
        cqHidden: boolean;
        aemContext: ClientAemContext;
    };


    public getWcmmode(): string {
        return (this.context ? this.context.wcmmode : '');
    }

    public isCqHidden(): boolean {
        return (this.context ? this.context.cqHidden : false);
    }

    public getPath(): string {
        return (this.context ? this.context.wcmmode : '');
    }

    public getResource(): any {
        return (this.context ? this.context.resource : {});
    }

    public isWcmEnabled(): boolean {
        return !this.getWcmmode() || this.getWcmmode() !== "disabled";
    }

    public isWcmEditable(): boolean {
        return ["disabled", "preview"].indexOf(this.getWcmmode()) < 0;
    }

    public getRegistry(): RootComponentRegistry {
        return (this.context ? (this.context.aemContext ? this.context.aemContext.registry : null) : null);
    }

    /**
     * change visibility of all nested react component roots.
     * @param path
     * @param visible
     */
    public setAllEditableVisible(path: string, visible: boolean): void {
        if (this.context.aemContext.componentManager) {
            this.context.aemContext.componentManager.setNestedInstancesVisible(path, visible);
        }
    }

}
