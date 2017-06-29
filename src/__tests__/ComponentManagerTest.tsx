import {expect} from "chai";
import {JSDOM} from "jsdom";
import * as React from "react";
import {ComponentManager, ComponentTreeConfig} from "../ComponentManager";
import {ResourceComponent} from "../component/ResourceComponent";
import {Container, Cq} from "../di/Container";
import {Cache} from "../store/Cache";
import {SlingResourceOptions} from "../store/Sling";

describe("ComponentManager", () => {
    it("should not install components when wcmmode is not disabled", () => {
        let cache: Cache = new Cache();

        let data: ComponentTreeConfig = {
            cache: cache,
            path: "/test",
            resourceType: "/components/test",
            wcmmode: "edit",
        };

        let doc: Document = new JSDOM("<html><div data-react-id='1'></div><textarea id='1'>" + JSON.stringify(data) + "</textarea></html>").window.document;
        let cm: ComponentManager = new ComponentManager(null, null, doc);
        let element: Element = doc.querySelector("div");

        cm.initReactComponent(element);
    });

    it("should instantiate react components", () => {
        class Test extends ResourceComponent<any, any, any> {
            public renderBody(): React.ReactElement<any> {
                return (<span>test</span>);
            }
        }

        let cache: Cache = new Cache();

        let data: ComponentTreeConfig = {
            cache: cache,
            path: "/test",
            resourceType: "/components/test",
            wcmmode: "disabled",
        };

        let cqx: any = {};
        let container: Container = new Container((cqx as Cq));

        container.register("cache", cache);

        let sling: any = {
            subscribe: (listener: ResourceComponent<any, any, any>, path: string, options?: SlingResourceOptions) => {
                listener.changedResource(path, {});
            },
        };

        container.register("sling", sling);

        let registry: any = {
            getComponent: (resourceType: string) => {
                return Test;
            },
        };

        let doc: Document = new JSDOM("<html><div data-react data-react-id='1'></div><textarea id='1'>" + JSON.stringify(data) + "</textarea></html>").window.document;
        let cm: ComponentManager = new ComponentManager(registry, container, doc);
        let element: Element = doc.querySelector("div");

        cm.initReactComponent(element);

        let count: number = cm.initReactComponents();

        expect(count).to.equal(1);
    });
});
