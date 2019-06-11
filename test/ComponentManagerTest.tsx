import {expect} from "chai";
import "./setup";
import * as jsdom from "jsdom";
import * as React from "react";
import ComponentManager from "../ComponentManager";
import Cache from "../store/Cache";
import {ComponentTreeConfig} from "../ComponentManager";
import {ResourceComponent} from "../component/ResourceComponent";
import {Container} from "../di/Container";
import {Cq} from "../references";
import {SlingResourceOptions} from "../store/Sling";

describe("ComponentManager", () => {

    it("should not install components when wcmmode is not disabled", () => {

        let cache: Cache = new Cache();
        let data: ComponentTreeConfig = {
            cache: cache,
            wcmmode: "edit",
            path: "/test",
            resourceType: "/components/test"
        };

        let doc: Document = jsdom.jsdom("<html><div data-react-id='1'></div><script id='1' type='application/json'>" + JSON.stringify(data) + "</script></html>");

        let cm: ComponentManager = new ComponentManager(null, null, doc);

        let element: Element = doc.querySelector("div");
        cm.initReactComponent(element);

    });

    it("should instantiate react components", () => {

        class Test extends ResourceComponent<any, any, any> {
            public renderBody(): React.ReactElement<any> {
                return (<span>test</span>);
            };
        }

        let cache: Cache = new Cache();
        let data: ComponentTreeConfig = {
            cache: cache,
            wcmmode: "disabled",
            path: "/test",
            resourceType: "/components/test"
        };

        let cqx: any = {};
        let container: Container = new Container((cqx as Cq));
        container.register("cache", cache);
        let sling: any = {
            subscribe: function(listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions) {
                listener.changedResource(path, {});
            }
        }
        container.register("sling", sling);

        let registry: any = {
            getComponent: function(resourceType: string): any {
                return Test;
            }
        }

        let doc: Document = jsdom.jsdom("<html><div data-react data-react-id='1'></div><script id='1' type='application/json'>" + JSON.stringify(data) + "</script></html>");

        let cm: ComponentManager = new ComponentManager(registry, container, doc);

        let element: Element = doc.querySelector("div");
        cm.initReactComponent(element);
        let count: number = cm.initReactComponents();
        expect(count).to.equal(1);

    });


});

