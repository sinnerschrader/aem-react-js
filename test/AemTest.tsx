import * as enzyme from "enzyme";
import {ClientAemContext} from "../AemContext";
import RootComponent from "../component/RootComponent";
import RootComponentRegistry from "../RootComponentRegistry";
import ComponentRegistry from "../ComponentRegistry";
import {Container} from "../di/Container";
import ComponentManager from "../ComponentManager";
import {Cq} from "../references";
import {CheerioWrapper} from "enzyme";
import * as React from "react";
import Cache from "../store/Cache";
import MockSling from "./MockSling";
import {ShallowWrapper} from "enzyme";

export default class AemTest {

    private registry: RootComponentRegistry = new RootComponentRegistry();
    public currentAemContext: ClientAemContext;

    public init(): void {
        this.registry.init();
        let container: Container = new Container(({} as Cq));
        let cache: Cache = new Cache();
        container.register("cache", cache);
        container.register("sling", new MockSling(cache))
        let componentManager: ComponentManager = new ComponentManager(this.registry, container, ({} as Document));

        this.currentAemContext = {
            registry: this.registry, componentManager: componentManager, container: container
        };

    }

    public addRegistry(registry: ComponentRegistry): void {
        this.registry.add(registry);
    }

    public addResource(path: string, resource: any, depth?: number): void {
        let cache: Cache = this.currentAemContext.container.get("cache");
        cache.put(path, resource, depth);
    }

    public render(resource: any, path?: string): CheerioWrapper<any, any> {
        this.addResource(path || "/", resource);
        let component: any = this.registry.getComponent(resource.resourceType);
        if (!component) {
            throw new Error("cannot find component for " + resource.resourceType);
        }
        return enzyme.render(<RootComponent comp={component} path={path || "/"} wcmmode="disabled" aemContext={this.currentAemContext}/>);
    }
}
