/* tslint:disable no-unused-expression */

import {expect} from "chai";
import * as React from "react";
import {ComponentRegistry} from "../ComponentRegistry";
import {Mapping} from "../RootComponentRegistry";
import {ResourceComponent} from "../component/ResourceComponent";

describe("ComponentRegistry", () => {
    class TestView extends ResourceComponent<any, any, any> {
        public renderBody(): React.ReactElement<any> {
            return (<span>{this.getResource().text}</span>);
        }
    }

    it("should register component", () => {
        let registry: ComponentRegistry = new ComponentRegistry("/components");

        registry.register(TestView);

        let mapping: Mapping = registry.mappings[0];

        expect(mapping.componentClass).to.equal(TestView);
        expect(mapping.resourceType).to.equal("/components/test-view");
        expect(mapping.vanillaClass).to.be.null;
    });

    it("should register component with special mapping", () => {
        let registry: ComponentRegistry = new ComponentRegistry((name: string) => {
            return "/x/" + name;
        });

        registry.register(TestView);

        let mapping: Mapping = registry.mappings[0];

        expect(mapping.componentClass).to.equal(TestView);
        expect(mapping.resourceType).to.equal("/x/TestView");
        expect(mapping.vanillaClass).to.be.null;
    });

    it("should register vanilla component", () => {
        let registry: ComponentRegistry = new ComponentRegistry("/components/vanilla");

        registry.registerVanilla({component: TestView});

        let mapping: Mapping = registry.mappings[0];

        expect(mapping.componentClass).to.not.equal(TestView);
        expect(mapping.resourceType).to.equal("/components/vanilla/test-view");
        expect(mapping.vanillaClass).to.equal(TestView);
    });
});
