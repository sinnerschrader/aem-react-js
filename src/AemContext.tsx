import {RootComponentRegistry} from './RootComponentRegistry';
import {Container} from './di/Container';

export interface AemContext {
  readonly container: Container;
  readonly registry: RootComponentRegistry;
}
