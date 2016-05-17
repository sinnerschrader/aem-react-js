import {Sling} from "./Sling";
import {Promise} from "../references";
interface FetchWindow extends Window {
    fetch(url: string, options: any): any;
}



export default class ClientSling implements Sling {
    public getResource(path: string, options: any): Promise {
        let url: string = origin + path + ".html.json";
        return (window as FetchWindow).fetch(url, {credentials: "same-origin"}).then((response: any) => {
            return response.json();
        });
    }

}
