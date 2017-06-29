/* tslint:disable no-unused-expression */

import {expect} from "chai";
import {JavaSling, ServerSling} from "../ServerSling";
import {Cache} from "../Cache";
import {EditDialogData} from "../Sling";
import {ResourceComponent} from "../../component/ResourceComponent";

describe("ServerSling", () => {
    it("should include resource", () => {
        let html: string = "<div></div>";
        let cache: Cache = new Cache();

        let javaSling: any = {
            includeResource: function (path: string, resourceType: string): string {
                return html;
            },
        };

        let sling: ServerSling = new ServerSling(cache, (javaSling as JavaSling));
        let actualHtml: string = sling.includeResource("/test", "/component/test");

        expect(actualHtml).to.equal(html);
        expect(cache.getIncluded("/test")).to.equal(html);
    });

    it("should subscribe to resource", () => {
        let resource: any = {text: "hi"};
        let path: string = "/test";
        let actualResource: any;
        let actualPath: string;
        let cache: Cache = new Cache();

        let javaSling: any = {
            getResource: function (_path: string, depth?: number): string {
                if (_path === path && depth === 3) {
                    return JSON.stringify(resource);
                } else {
                    return null;
                }
            },
        };

        let sling: ServerSling = new ServerSling(cache, (javaSling as JavaSling));

        let component: ResourceComponent<any, any, any> = (({
            changedResource: function (_path: string, _resource: any): void {
                actualResource = _resource;
                actualPath = _path;
            },
        } as any) as ResourceComponent<any, any, any>);

        sling.subscribe(component, path, {depth: 3});

        expect(actualPath).to.equal(path);
        expect(actualResource).to.deep.equal(resource);
    });

    it("should include dialog", () => {
        let dialog: EditDialogData = {element: "el"};
        let cache: Cache = new Cache();

        let javaSling: any = {
            renderDialogScript: function (path: string, resourceType: string): string {
                return JSON.stringify(dialog);
            },
        };

        let sling: ServerSling = new ServerSling(cache, (javaSling as JavaSling));
        let actualDialog: EditDialogData = sling.renderDialogScript("/test", "/component/test");

        expect(actualDialog).to.deep.equal(dialog);
        expect(cache.getScript("/test")).to.deep.equal(dialog);
    });

    it("should include null dialog", () => {
        let cache: Cache = new Cache();

        let javaSling: any = {
            renderDialogScript: function (path: string, resourceType: string): string {
                return null;
            },
        };

        let sling: ServerSling = new ServerSling(cache, (javaSling as JavaSling));
        let actualDialog: EditDialogData = sling.renderDialogScript("/test", "/component/test");

        expect(actualDialog).to.be.null;
    });

    it("should get path", () => {
        let path: string = "/test";

        let javaSling: any = {
            getPagePath: function (): string {
                return path;
            },
        };

        let sling: ServerSling = new ServerSling(null, (javaSling as JavaSling));
        let actualPath: string = sling.getRequestPath();

        expect(actualPath).to.equal(path);
    });
});
