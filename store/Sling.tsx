import Promise from "redux-promise";

export interface Sling {

    getResource(path: string, options?: any): Promise;
}
