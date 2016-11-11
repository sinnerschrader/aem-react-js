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

    it("should return empty sub match", () => {

        let cache: Cache = new Cache();
        cache.put("/content", {test: null});
        let result: any = cache.get("/content/test");

        expect(result).to.exist;
        expect(result).to.deep.equal({});

    });

    it("should not return insufficiently deep match", () => {

        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}}, 1);
        let result: any = cache.get("/content/test");

        expect(result).to.not.exist;

    });

    it("should return inifinity deep match", () => {

        let cache: Cache = new Cache();
        cache.put("/content", {test: {text: "Hallo"}}, -1);
        let result: any = cache.get("/content/test/text");

        expect(result).to.exist;

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
        cache.put("/content", {test: {text: "Hallo"}}, 1);
        let result: any = cache.get("/something", 1);

        expect(result).to.not.exist;

    });

    it("should return match of depth 1", () => {

        let cache: Cache = new Cache();
        cache.put("/content", {level1: {level2: "Hallo"}}, 1);
        let result: any = cache.get("/content/level1/level2", 0);

        expect(result).to.equals("Hallo");

    });

    it("should create a cache key that resembles the method invocation", () => {

        let cache: Cache = new Cache();

        function test(x: string, y: string): string {
            return cache.generateServiceCacheKey("javaClass", "make", [x, y]);
        }

        let key: string = test("do", "it");
        expect(key).to.equals("javaClass.make(do,it)");
    });

    it("should create a cache key that resembles the method invocation", () => {

        let cache: Cache = new Cache();

        function test(x: string, y: string): string {
            return cache.generateServiceCacheKey("javaClass", "make", [x, y]);
        }

        let key: string = test("do", "it");
        expect(key).to.equals("javaClass.make(do,it)");
    });

    it("should merge caches", () => {

        let cache: Cache = new Cache();
        cache.putIncluded("new", "oldValue");
        cache.putIncluded("existing", "existingValue");

        cache.mergeCache({included: {"new": "newValue"}});

        expect(cache.getIncluded("new")).to.equals("newValue");
        expect(cache.getIncluded("existing")).to.equals("existingValue");
    });

    it("should merge null caches", () => {

        let cache: Cache = new Cache();

        cache.mergeCache(null);
        // expect no error

    });

    it("should clear cache", () => {

        let cache: Cache = new Cache();
        cache.put("incl", {x: 1});
        expect(cache.get("incl")["x"]).to.equals(1);
        cache.putIncluded("incl", "value");
        expect(cache.getIncluded("incl")).to.equals("value");
        cache.putScript("script", {element: "test"});
        expect(cache.getScript("script")).to.deep.equal({element: "test"});
        cache.putServiceCall("call", "result");
        expect(cache.getServiceCall("call")).to.equal("result");
        cache.clear();
        expect(cache.get("incl")).to.be.null;
        expect(cache.getIncluded("incl")).to.be.undefined;
        expect(cache.getScript("script")).to.be.undefined;
        expect(cache.getServiceCall("call")).to.be.undefined;

    });

    it("should write and read entries", () => {

        let cache: Cache = new Cache();
        cache.putIncluded("incl", "value");
        expect(cache.getIncluded("incl")).to.equals("value");
        cache.putScript("script", {element: "test"});
        expect(cache.getScript("script")).to.deep.equal({element: "test"});
        cache.putServiceCall("call", "result");
        expect(cache.getServiceCall("call")).to.equal("result");

    });

    it("should wrap service call", () => {

        let cache: Cache = new Cache();
        let result: any = cache.wrapServiceCall("x", () => {
            return "done"
        });
        expect(result).to.equals("done");


    });

});

