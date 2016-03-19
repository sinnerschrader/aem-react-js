import {ResourceComponent} from "./ResourceComponent";
import ReactParsys from "./ReactParsys";
import * as React from "react";

export interface ComponentConfig {
    depth?: number;
    parsysPath?: string;
    component: typeof React.Component;
}

export default class WrapperFactory {
    public static createWrapper(config: ComponentConfig): React.ComponentClass<any> {
        return class TheWrapper extends Wrapper {
            constructor(props?: any, context?: any) {
                super(config, props, context);
            }
        };
    }
}

export class Wrapper extends ResourceComponent<any, any, any> {

    protected config: ComponentConfig;

    protected getDepth(): number {
        return this.config.depth || 0;
    }

    public constructor(config: ComponentConfig, props?: any, context?: any) {
        super(props, context);
        this.config = config;
    }

    public create(): React.ReactElement<any> {
        let child: React.ReactElement<any>;
        if (!!this.config.parsysPath) {
            child = React.createElement(ReactParsys, {path: this.config.parsysPath});
        }
        let props: any = this.getResource();
        return React.createElement(this.config.component, props, child);

    }

    public renderBody(): React.ReactElement<any> {
        return this.create();
    }
}
