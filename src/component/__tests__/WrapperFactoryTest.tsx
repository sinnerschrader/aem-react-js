import {expect} from "chai";
import * as enzyme from "enzyme";
import * as React from "react";
import {WrapperFactory} from "../WrapperFactory";
import {CommonWrapper} from "enzyme";
import {RootComponent} from "../RootComponent";
import {ComponentRegistry} from "../../ComponentRegistry";
import {RootComponentRegistry} from "../../RootComponentRegistry";
import {Container, Cq} from "../../di/Container";
import {ComponentManager} from "../../ComponentManager";
import {ClientAemContext} from "../../AemContext";
import {MockSling} from "../../test/MockSling";
import {ResourceComponent} from "../ResourceComponent";
import {Cache} from "../../store/Cache";
import {VanillaInclude} from "../VanillaInclude";

describe("WrapperFactory", () => {
    class Test extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (<span data-global={this.props.global} data-text={this.props.text}>{this.props.children}</span>);
        }
    }

    class Text extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (<span>{this.props.text}</span>);
        }
    }

    let testRegistry: ComponentRegistry = new ComponentRegistry("components");
    let registry: RootComponentRegistry = new RootComponentRegistry();

    testRegistry.registerVanilla({component: Text});

    registry.add(testRegistry);
    registry.init();

    let container: Container = new Container(({} as Cq));
    let componentManager: ComponentManager = new ComponentManager(registry, container, ({} as Document));

    let aemContext: ClientAemContext = {
         componentManager: componentManager, container: container, registry: registry,
    };

    it("should render simple vanilla component", () => {
        let cache = new Cache();

        cache.put("/test", {text: "hallo"});
        container.register("sling", new MockSling(cache));

        let reactClass: any = WrapperFactory.createWrapper({component: Test, props: {global: "bye"}}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={reactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<span data-global="bye" data-text="hallo"></span>');
    });

    it("should render loading component", () => {
        let loader: any = () => {
            return (<span>...</span>);
        };

        let cache = new Cache();

        container.register("sling", new MockSling(cache));

        let reactClass: any = WrapperFactory.createWrapper({component: Test, props: {global: "bye"}, loadingComponent: loader}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={reactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<div class="dialog"><span>...</span></div>');
    });

    it("should render default loading ui", () => {
        let cache = new Cache();

        container.register("sling", new MockSling(cache));

        let reactClass: any = WrapperFactory.createWrapper({component: Test, props: {global: "bye"}}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={reactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<div class="dialog"><span>Loading</span></div>');
    });

    it("should render simple vanilla include", () => {
        class Test extends ResourceComponent<any, any, any> {
            public renderBody(): any {
                return (<div><VanillaInclude path="vanilla" component={Text}/></div>);
            }
        }

        let cache = new Cache();

        cache.put("/test", {vanilla: {text: "good bye"}});
        container.register("sling", new MockSling(cache));

        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={Test} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<div><div class="dialog"><span>good bye</span></div></div>');
    });

    it("should render simple vanilla component with transform", () => {
        let transform = (resource: any, c: ResourceComponent<any, any, any>) => {
            let props: any = {};
            props.text = resource.textProperty;
            return props;
        };

        let cache = new Cache();

        cache.put("/test", {textProperty: "hallo"});
        container.register("sling", new MockSling(cache));

        let reactClass: any = WrapperFactory.createWrapper({component: Text, transform: transform}, "components/text");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={reactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal("<span>hallo</span>");
    });

    it("should render simple vanilla container", () => {
        let cache = new Cache();

        cache.put("/test", {
            children: {
                child: {
                    "sling:resourceType": "components/text", "text": "hey there",
                },
            },
        });

        container.register("sling", new MockSling(cache));

        let reactClass: any = WrapperFactory.createWrapper({component: Test, parsys: {path: "children"}}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent wcmmode="disabled" aemContext={aemContext} comp={reactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<span><div class="dialog"><span>hey there</span></div></span>');
    });
});
