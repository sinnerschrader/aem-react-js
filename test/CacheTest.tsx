import {expect} from "chai";

import "./setup";

import Cache from "../store/Cache";

describe("Cache", () => {

    it("should return direct match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: "Test"});
        let result: any = cache.get("/content");

        expect(result).to.exist;


    });

    it("should return sub match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}});
        let result: any = cache.get("/content/test");

        expect(result).to.exist;
        expect(result.text).to.equal("Hallo");


    });

    it("should not return insufficiently deep match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}}, 1);
        let result: any = cache.get("/content/test");

        expect(result).to.not.exist;


    });

    it("should return sufficiently deep match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}});
        let result: any = cache.get("/content", 2);

        expect(result).to.exist;


    });

    it("should return sufficiently deep sub match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}}, 2);
        let result: any = cache.get("/content/test", 1);

        expect(result).to.exist;
        expect(result.text).to.equal("Hallo");


    });

    it("should return null if no match", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}}, 2);
        let result: any = cache.get("/something", 1);

        expect(result).to.not.exist;


    });

    it("should return match of depth 2", () => {


        let cache: Cache = new Cache();
        cache.put("/content", {level1: {level2: "Hallo"}});
        let result: any = cache.get("/content/level1/level2", 0);

        expect(result).to.equals("Hallo");


    });

});

