import * as React from "react";
import AemComponent from "../component/AemComponent";
import {formatPattern} from "react-router/lib/PatternUtils";
import {ResourceMapping} from "./ResourceMapping";

export interface ResourceRouteProps {
    params: {storeId: any};
    route: any;
}

export default class ResourceRoute extends AemComponent<ResourceRouteProps, any> {

    public render(): React.ReactElement<any> {
        let pagePath: string = formatPattern(this.props.route.path, this.props.params);
        let resourceMapping: ResourceMapping = this.context.aemContext.container.get("resourceMapping");
        pagePath = resourceMapping.resolve(pagePath);

        // TODO move to Utils
        let resourcePath: string = this.getPath().substring(this.getPath().indexOf("jcr:content"));
        // let path: string = this.props.route.basePath + "/" + this.props.params.storeId + "/" + resourcePath + "/content";
        let path: string = pagePath + "/" + resourcePath + "/" + "content";
        return React.createElement(this.props.route.resourceComponent, {path: path});

    }
}


