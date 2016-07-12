import RootComponentRegistry from "./RootComponentRegistry";
import ComponentManager from "./ComponentManager";

export interface AemContext {
    registry: RootComponentRegistry;
}

export interface ClientAemContext extends AemContext {
    componentManager: ComponentManager;
}
