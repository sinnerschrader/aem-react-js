import {expect} from "chai";

import "./setup";

import ResourceUtils from "../ResourceUtils";
import {PathResult} from "../ResourceUtils";



describe("ResourceUtils", () => {

    it(" should return the containing page path", () => {

        let pagePath: string = ResourceUtils.getContainingPagePath("/content/world/jcr:content/par/xxx.html")
        expect(pagePath).to.equal("/content/world.html");


    });

    it(" should leave pagePath as is", () => {

        let pagePath: string = ResourceUtils.getContainingPagePath("/content/world.html")
        expect(pagePath).to.equal("/content/world.html");


    });

    it(" should return children which are objects with a primaryType prop", () => {

        let test: any = {child1: {"sling:resourceType": "1"}, value: "hallo"};
        let children: any[] = ResourceUtils.getChildren(test);
        expect(Object.keys(children).length).to.equal(1);
        expect(((children as any)["child1"] as any)["sling:resourceType"]).to.equal("1");


    });

    it(" should return value for path", () => {

        let test: any = {a: {b: 1}};
        let value: any = ResourceUtils.getProperty(test, ["a", "b"]);
        expect(value).to.equal(1);


    });

    it(" should return null if path does not exist", () => {

        let test: any = {a: {b: 1}};
        let value: any = ResourceUtils.getProperty(test, ["a", "b", "c"]);
        expect(value).to.be.null;


    });

    it(" should recognize absolute path", () => {

        let value: boolean = ResourceUtils.isAbsolutePath("/a/b");
        expect(value).to.be.true;

    });

    it(" should recognize relative path", () => {

        let value: boolean = ResourceUtils.isAbsolutePath("a/b");
        expect(value).to.be.false;

    });

    it(" should find ancestor by depth", () => {

        let value: PathResult = ResourceUtils.findAncestor("/a/b/c", 2);
        expect(value.path).to.equal("/a");
        expect(value.subPath).to.deep.equal(["c", "b"]);

    });


});

