import * as resource from "./component/ResourceComponent";

export interface ContentModel {
    label: string;
    node: string;
    resourceType: string;
}

export interface StackState {
    activeIndex: number;
}


export abstract class StackContainer extends resource.ResourceComponent<resource.Resource, resource.ResourceProps<resource.Resource>, StackState> {


    constructor(props: resource.ResourceProps<resource.Resource>) {
        super(props);
        // TODO remove this
        this.state = {activeIndex: 0};
        // TODO move this to ComponentManager
    }




}
