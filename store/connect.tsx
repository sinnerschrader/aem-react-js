import {ResourceComponent} from "../component/ResourceComponent";
import {loadResource} from "./actions";
import {STATE} from "./reducers";
import {connect} from "react-redux";

const ABSOLUTE_PATH_PATTERN: RegExp = /^\//;

const select = (state: any, ownProps: any) => {
    let value: any = {};
    if (ownProps.resource) {
        value = {state: STATE.LOADED, resource: ownProps.resource};
    } else if (ABSOLUTE_PATH_PATTERN.test(ownProps.path)) {
        let resource: any = state.resources[ownProps.path];
        if (resource) {
            value = {state: STATE.LOADED, resource};
        } else {
            value = {state: STATE.LOADING};
        }
    } else {
        let rootPath: string = ownProps.rootPath || this._reactInternalInstance._context.rootPath;
        let resource: any = state.resources[rootPath + "/" + ownProps.path];
        if (resource) {
            value = {state: STATE.LOADED, resource};
        } else {
            value = {state: STATE.LOADING};
        }
    }

    return value;
}

let wrap: (component: ResourceComponent) => any = connect(select, {loadResource});

export default wrap;
