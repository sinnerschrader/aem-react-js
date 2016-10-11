import Cache from "../store/Cache";
import {JsProxy} from "../references";



/**
 * this class is a proxy that wraps java object of type JsProxy. The  proxy
 * put all calls into the cache.
 */
export default class ServiceProxy {
    constructor(cache: Cache, locator: () => any, name: string) {
        this.cache = cache;
        this.locator = locator;
        this.name = name;
    }

    private cache: Cache;
    private name: string;
    private locator:  () => any;

    /**
     * call a method on the proxied object. returns the cached value if available.
     *
     * @param name of java method to call
     * @param args to java method
     * @returns {any}
     */
    public invoke(method: string, ...args: any[]): any {
        let cacheKey: string = this.cache.generateServiceCacheKey(this.name, method, args);
        return this.cache.wrapServiceCall(cacheKey, (): any => {
            let service: JsProxy = this.locator();
            let result: any = service.invoke(method, args);
            if (result == null) {
                return null;
            }
            return JSON.parse(result);
        });
    }

}
