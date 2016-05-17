import {STATE} from "./reducers";



export interface ResourceState {
    resource?: any;
    state: STATE;
    path: string;

}

export interface StoreReference {
    name: string;
    path: string;

}
