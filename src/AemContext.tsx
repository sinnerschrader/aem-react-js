import {RootComponentRegistry} from './RootComponentRegistry';
import {Container} from './di/Container';

export interface AemContext {
  registry: RootComponentRegistry;
  container: Container;
}
