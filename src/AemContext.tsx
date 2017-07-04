import {ComponentManager} from './ComponentManager';
import {RootComponentRegistry} from './RootComponentRegistry';
import {Container} from './di/Container';

export interface AemContext {
  registry: RootComponentRegistry;
  container: Container;
}

export interface ClientAemContext extends AemContext {
  componentManager: ComponentManager;
}
