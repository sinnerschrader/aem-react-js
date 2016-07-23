import {expect} from "chai";

import "./setup";

import ResourceUtils from "../ResourceUtils";

describe("ResourceUtils", () => {

    it(" should return the containing page path", () => {

        let pagePath: string = ResourceUtils.getContainingPagePath("/content/world/jcr:content/par/xxx.html")
        expect(pagePath).to.equal("/content/world.html");


    });

    it(" should leave pagePath as is", () => {

        let pagePath: string = ResourceUtils.getContainingPagePath("/content/world.html")
        expect(pagePath).to.equal("/content/world.html");


    });


});

