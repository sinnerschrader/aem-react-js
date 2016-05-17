import container from "../di/container";
//import ActionQueue from "../di/ActionQueue";
import {Cq} from "../references";
import {Promise} from "../references";
import {Sling} from "./Sling";

export const STORE: string = "STORE";
export const STORE_LIST: string = "STORE_LIST";

declare var Cqx: Cq;

declare var window: Window;

/*export function loadState(path: string): any {
 console.log("loading state " + storeId);
 if (typeof window !== "undefined") {
 let url: string = path + ".json.html";
 let promise: Promise = window.fetch(url, {credentials: "same-origin"}).then((all: any) => {
 return all.json();
 }).then((all: any) => {
 // return the state for path
 return all.state.states[path];
 });


 return {
 type: STORE, meta: {path: path}, payload: {
 storeId: path, promise: promise
 }
 };
 } else {
 throw new Error("cannot load state on server");
 }
 }*/
export function loadResource(path: string): any {
    let sling: Sling = container.get("sling")
    let promise: Promise = sling.getResource(path);
    return {
        type: "RESOURCE", meta: {path: path}, payload: {
            path: path, promise: promise
        }
    };
    /*    console.log("loading resource " + path);
     if (typeof window !== "undefined") {
     let promise: Promise = window.fetch(path + ".json.html", {credentials: "same-origin"}).then((all: any) => {
     return all.json();
     }).then((all: any) => {
     return all.state.resources[path].resource;
     });


     return {
     type: "RESOURCE", meta: {path: path}, payload: {
     path: path, promise: promise
     }
     };
     } else {
     let queue: ActionQueue = container.get("ActionQueue");
     return {
     type: STORE, meta: {path: path}, payload: {
     promise: {
     then: (cb: (data: any) => void): void => {
     // load StoreDetail which is currentResource and pageProperties
     console.log("waiting for store " + storeId);
     queue.push(() => {
     try {
     let resource: any = JSON.parse(global.Cqx.sling.currentResource(2));
     console.log("got store " + JSON.stringify(resource));
     resource.path = path;
     cb(resource);
     } catch (e) {
     console.log(e);
     cb({path: path, name: "error"});
     }
     });
     }
     }
     }
     };
     }*/
}
