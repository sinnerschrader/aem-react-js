import {expect} from "chai";

import "./setup";
import * as React from "react";
import ServerRenderer from "../ServerRenderer";
import {Container} from "../di/Container";
import {ServerResponse} from "../ServerRenderer";
import {Cq} from "../references";
import RootComponentRegistry from "../RootComponentRegistry";
import {ResourceComponent} from "../component/ResourceComponent";
import Cache from "../store/Cache";

describe("ServerRenderer", () => {

    it("should return direct match", () => {

        class Test extends ResourceComponent<any, any, any> {
            public renderBody(): React.ReactElement<any> {
                return (<span>{this.getResource().text}</span>);
            }
        }

        let sling: any = {
            subscribe: function(component: ResourceComponent<any, any, any>, path: string): void {
                component.changedResource(path, {text: "hi"});
            }
        };

        let container: Container = new Container(({} as Cq));
        container.register("sling", sling);
        container.register("cache", new Cache());
        let registry: RootComponentRegistry = ({
            getComponent: function(resourceType: string): any {
                return Test;
            }
        } as RootComponentRegistry);
        let renderer: ServerRenderer = new ServerRenderer(registry, container);
        let response: ServerResponse = renderer.renderReactComponent("/test", "/components/test", "disabled");

        expect(response.html).to.equal('<span data-reactroot="" data-reactid="1" data-react-checksum="-1096281847">hi</span>');


    });


});

