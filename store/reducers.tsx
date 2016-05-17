import * as model from "./model";

export interface Es6Object extends Object {
    assign(x: any, y: any, z?: any): any;
}
declare var Object: Es6Object;

export enum STATE {
    LOADING, LOADED, FAILED
}


export function resources(state: {[path: string]: model.ResourceState} = {}, action: any): {[path: string]: model.ResourceState} {
    let newState: {[path: string]: model.ResourceState} = Object.assign({}, state);
    // TODO action does not contain storeId but only type
    console.log("reduce store " + action.type);
    switch (action.type) {
        case "RESOURCE_PENDING":
            newState[action.meta.path] = {path: action.meta.path, state: STATE.LOADING};
            return newState;
        case "RESOURCE_FULFILLED":
            newState[action.meta.path] = {path: action.meta.path, resource: action.payload, state: STATE.LOADED};
            return newState;
        case "RESOURCE_REJECTED":
            newState[action.meta.path] = {path: action.meta.path, state: STATE.FAILED};
            return newState;
        default:
            return newState;
    }
}





