import {Props} from './Props';

export interface EditConfig<P> {
  dragDropName: string;

  emptyLabel: string;

  isEmpty(props: Props<P>): boolean;
}
