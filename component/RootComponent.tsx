import * as React from "react";
import {AemContext} from "../AemContext";
import container from "../di/container";
import {Provider} from "react-redux";
import {Store, createStore, applyMiddleware, combineReducers } from "redux";
import * as reducers from "../store/reducers";
import * as reduxPromise from "redux-promise-middleware";
import connect from "../store/connect";
import {STATE} from "../store/reducers";

export interface RootComponentProps {
    comp: typeof React.Component;
    component: string;
    aemContext: AemContext;
}

export default class RootComponent extends React.Component<RootComponentProps, any> {
    public static childContextTypes: any = {
        aemContext: React.PropTypes.any
    };

    public getChildContext(): any {
        return {
            aemContext: this.props.aemContext
        };
    }

    public render(): React.ReactElement<any> {

        let initialState: any = {resources: {}};
        initialState.resources[this.props.rootPath] = {state: STATE.LOADED, resource: this.props.resource};

        let store: Store = applyMiddleware(reduxPromise())(createStore)(combineReducers(reducers), initialState);
        // TODO register store with container so that state can be retrieved.
        container.register("reduxStore", store);


        // store is based on url and never changes
        // let clientStore: ClientStore = new ClientStore({store: store, storePath: storePath});


        let componentClass: any = connect(this.props.comp);
        if (this.props.children) {
            return (
                <Provider store={store}>
                    {this.props.children}
                </Provider>
            );
        } else {
            let component: React.ReactElement<any> = React.createElement(componentClass, this.props);
            return (
                <Provider store={store}>
                    {component}
                </Provider>
            );
        }

    }

}
