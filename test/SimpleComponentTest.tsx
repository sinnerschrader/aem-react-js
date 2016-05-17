import {renderIntoDocument} from "react-addons-test-utils";

import {expect} from "chai";

import "./setup";

import AemComponent from "../component/AemComponent";
import * as React from "react";

class SimpleComponent extends AemComponent<any, any> {
    public render(): React.ReactElement {
        return (<div></div>);
    }
}



describe("SimpleComponent", () => {
    it("should display item details", () => {
        const item: React.DOMElement = renderIntoDocument(
            <SimpleComponent/>
        );

        expect(item.props.path).to.equal("hallo");
    });
});
