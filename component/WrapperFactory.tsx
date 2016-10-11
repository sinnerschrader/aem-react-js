import {ResourceComponent} from "./ResourceComponent";
import * as React from "react";
import {ReactParsysProps} from "./ReactParsys";

export interface ComponentConfig {
    depth?: number;
    parsys?: ReactParsysProps;
    component: typeof React.Component;
    props?: {[name: string]: any};
    transform?: (props: {[name: string]: any}, r: ResourceComponent<any, any, any>) => {[name: string]: any};
}

export default class WrapperFactory {
    /**
     * 
     * @param config
     * @param resourceType
     * @return {TheWrapper}
     */
    public static createWrapper(config: ComponentConfig, resourceType: string): React.ComponentClass<any> {
        return class TheWrapper extends Wrapper {
            constructor(props?: any, context?: any) {
                super(config, props, context);
            }

            public getResourceType(): string {
                return resourceType;
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
        let children: React.ReactElement<any>[];
        if (!!this.config.parsys) {
            let parsysPath: string = this.getPath() + "/" + this.config.parsys.path;
            children = this.renderChildren(this.getResource(), parsysPath, this.config.parsys.childClassName, this.config.parsys.childElementName);
        }
        let props: any = this.getResource();
        if (this.config.props) {
            Object.keys(this.config.props).forEach((key: string) => props[key] = this.config.props[key]);
        }
        let newProps: {[name: string]: any};
        if (this.config.transform) {
            newProps = this.config.transform(props, this);
        } else {
            newProps = props;
        }
        return React.createElement(this.config.component, props, children);
    }

    public renderBody(): React.ReactElement<any> {
        return this.create();
    }
}
