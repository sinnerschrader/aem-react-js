import {expect} from "chai";

import "./setup";

import Cache from "../store/Cache";
import ServiceProxy from "../di/ServiceProxy";

describe("ServiceProxy", () => {

    it("should invoke target and cache result", () => {


        let target: any = {
            invoke: function (method: string, args: any[]): string {
                if (method === "add" && args.length === 2) {
                    return JSON.stringify(args[0] + args[1]);
                }
                throw new Error("unknown method");
            }
        }

        let cache: Cache = new Cache();
        let proxy: ServiceProxy = new ServiceProxy(cache, () => {
            return target;
        }, "javaClass");

        let result: number = proxy.invoke("add", 1, 3);

        expect(result).to.equal(4);

        expect(cache.getServiceCall("javaClass.add(1,3)")).to.equal(4);


    });

    it("should invoke target and not cache result when error is thrown", () => {


        let target: any = {
            invoke: function (method: string, args: any[]): string {
                throw new Error("unknown method");
            }
        }

        let cache: Cache = new Cache();
        let proxy: ServiceProxy = new ServiceProxy(cache, () => {
            return target;
        }, "javaClass");

        try {
            proxy.invoke("add", 1, 3);
            expect.fail("expected error");
        } catch (e) {
            // expected
            expect(cache.getServiceCall("javaClass.add(1,3)")).to.be.undefined;
        }


    });

});

