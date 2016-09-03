import * as React from "react";
import {ClientAemContext, AemContext} from "../AemContext";
import RootComponentRegistry from "../RootComponentRegistry";

/**
 * Provides base functionality for components that are
 */
export default class AemComponent<P, S> extends React.Component<P, S> {


    public static contextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        rootPath: React.PropTypes.string, //
        resource: React.PropTypes.any, //
        aemContext: React.PropTypes.any
    };

    public context: {
        wcmmode: string;
        path: string;
        resource: any;
        aemContext: ClientAemContext;
    };


    public getWcmmode(): string {
        return this.context.wcmmode;
    }

    public getPath(): string {
        return this.context.path;
    }

    public getResource(): any {
        return this.context.resource;
    }

    public isWcmEnabled(): boolean {
        return !this.getWcmmode() || this.getWcmmode() !== "disabled";
    }

    protected getAemContext(): AemContext {
        return this.context.aemContext;
    }

    public getRegistry(): RootComponentRegistry {
        return this.context.aemContext.registry;
    }

    public getComponent(name: string): any {
        return this.context.aemContext.container.get(name);
    }

    public getOsgiService(name: string): any {
        return this.context.aemContext.container.getOsgiService(name);
    }

    public getResourceModel(name: string): any {
        return this.context.aemContext.container.getResourceModel(name);
    }

    public getRequestModel(name: string): any {
        return this.context.aemContext.container.getRequestModel(name);
    }

}
