import * as React from "react";
import {ClientAemContext, AemContext} from "../AemContext";
import RootComponentRegistry from "../RootComponentRegistry";
import {Container} from "../di/Container";

/**
 * Provides base functionality for components that are
 */
export default class AemComponent<P, S> extends React.Component<P, S> {


    public static contextTypes: any = {
        wcmmode: React.PropTypes.string, //
        path: React.PropTypes.string, //
        rootPath: React.PropTypes.string, //
        aemContext: React.PropTypes.any
    };

    public context: {
        wcmmode: string;
        path: string;
        aemContext: ClientAemContext;
    };


    public getWcmmode(): string {
        return this.context.wcmmode;
    }

    public getPath(): string {
        return this.context.path;
    }

    public isWcmEnabled(): boolean {
        return !this.getWcmmode() || this.getWcmmode() !== "disabled";
    }

    protected getAemContext(): AemContext {
        return this.context.aemContext;
    }

    /* istanbul ignore next */
    public getRegistry(): RootComponentRegistry {
        return this.context.aemContext.registry;
    }

    /* istanbul ignore next */
    public getComponent(name: string): any {
        return this.getContainer().get(name);
    }

    /* istanbul ignore next */
    public getOsgiService(name: string): any {
        return this.getContainer().getOsgiService(name);
    }

    /* istanbul ignore next */
    public getResourceModel(name: string): any {
        return this.getContainer().getResourceModel(this.getPath(), name);
    }

    /* istanbul ignore next */
    public getRequestModel(name: string): any {
        return this.getContainer().getRequestModel(this.getPath(), name);
    }

    protected getContainer(): Container {
        return this.context.aemContext.container;
    }
}
