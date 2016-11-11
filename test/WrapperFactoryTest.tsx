import {expect} from "chai";
import * as enzyme from "enzyme";
import "./setup";
import * as React from "react";
import WrapperFactory from "../component/WrapperFactory";
import {CommonWrapper} from "enzyme";
import RootComponent from "../component/RootComponent";
import ComponentRegistry from "../ComponentRegistry";
import RootComponentRegistry from "../RootComponentRegistry";
import {Container} from "../di/Container";
import ComponentManager from "../ComponentManager";
import {ClientAemContext} from "../AemContext";
import MockSling from "./MockSling";
import {Cq} from "../references";
import {ResourceComponent} from "../component/ResourceComponent";


describe("WrapperFactory", () => {

    class Test extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (<span data-global={this.props.global} data-text={this.props.text}>{this.props.children}</span>);
        };
    }

    class Text extends React.Component<any, any> {
        public render(): React.ReactElement<any> {
            return (<span>{this.props.text}</span>);
        };
    }


    let testRegistry: ComponentRegistry = new ComponentRegistry("components");
    let registry: RootComponentRegistry = new RootComponentRegistry();
    testRegistry.registerVanilla({component: Text})
    registry.add(testRegistry);
    registry.init();

    let container: Container = new Container(({} as Cq));
    let componentManager: ComponentManager = new ComponentManager(registry, container);

    let aemContext: ClientAemContext = {
        registry: registry, componentManager: componentManager, container: container
    };


    it(" should render simple vanilla component", () => {

        container.register("sling", new MockSling({"/test": {text: "hallo"}}));
        let ReactClass: any = WrapperFactory.createWrapper({component: Test, props: {global: "bye"}}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={ReactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<span data-global="bye" data-text="hallo"></span>');

    });

    it(" should render simple vanilla component with transform", () => {

        let transform = (resource: any, c: ResourceComponent<any, any, any>) => {
            let props: any = {};
            props.text = resource.textProperty;
            return props;
        };
        container.register("sling", new MockSling({"/test": {textProperty: "hallo"}}));
        let ReactClass: any = WrapperFactory.createWrapper({component: Text, transform: transform}, "components/text");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent aemContext={aemContext} comp={ReactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal("<span>hallo</span>");

    });


    it(" should render simple vanilla container", () => {

        container.register("sling", new MockSling({
            "/test": {
                child: {
                    "jcr:primaryType": "nt:unstructured", "sling:resourceType": "components/text", "text": "hey there"
                }
            }, "/test/child": {
                "jcr:primaryType": "nt:unstructured", "sling:resourceType": "components/text", "text": "hey there"

            }
        }));
        let ReactClass: any = WrapperFactory.createWrapper({component: Test, parsys: {path: "useless"}}, "components/test");
        let item: CommonWrapper<any, any> = enzyme.mount(<RootComponent wcmmode="disabled" aemContext={aemContext} comp={ReactClass} path="/test"/>);
        let html: string = item.html();

        expect(html).to.equal('<span><div class="dialog"><span>hey there</span></div></span>');

    });


});

