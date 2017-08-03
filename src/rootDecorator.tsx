import {RootComponent} from './component/RootComponent';

export type rootDecorator = (
  root: React.ReactElement<RootComponent>
) => JSX.Element;

export const identity: rootDecorator = (
  root: React.ReactElement<RootComponent>
) => root;
