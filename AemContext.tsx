import RootComponentRegistry from "./RootComponentRegistry";
import ComponentManager from "./ComponentManager";
import {Container} from "./di/Container";

export interface AemContext {
    registry: RootComponentRegistry;
    container: Container;
}

export interface ClientAemContext extends AemContext {
    componentManager: ComponentManager;
}
