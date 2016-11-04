import {ResourceComponent} from "../component/ResourceComponent";
import {EditDialogData} from "../store/Sling";
export default class MockSling {
    constructor(resource: {[path: string]: any}, data?: EditDialogData) {
        this.resources = resource;
        this.data = data;
    }

    private resources: {[path: string]: any};
    private data: EditDialogData;

    public subscribe(listener: ResourceComponent<any, any, any>, path: string, options?: any): void {
        if (this.resources[path]) {
            listener.changedResource(path, this.resources[path]);
        }

    }

    public renderDialogScript(): EditDialogData {
        if (this.data) {
            return this.data;
        }
        return {element: "div", attributes: {className: "dialog"}};
    }

    public includeResource(path: string, resourceType: string): string {
        return "<include resourcetype='" + resourceType + "' path='" + path + "'></include>";
    }
}
