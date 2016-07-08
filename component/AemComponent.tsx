import * as React from "react";
import {ClientAemContext, AemContext} from "../AemContext";

/**
 * Provides base functionality for components that are
 */
export default class AemComponent<P, S> extends React.Component<P, S> {


    public static contextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        rootPath: React.PropTypes.string, //
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
        return this.context.wcmmode;
    }

    public isCqHidden(): boolean {
        return this.context.cqHidden;
    }

    public getPath(): string {
        return this.context.wcmmode;
    }

    public getResource(): any {
        return this.context.resource;
    }

    public isWcmEnabled(): boolean {
        return !this.getWcmmode() || this.getWcmmode() !== "disabled";
    }

    public isWcmEditable(): boolean {
        return ["disabled", "preview"].indexOf(this.getWcmmode()) < 0;
    }
    
    protected getAemContext(): AemContext {
        return this.context.aemContext
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
