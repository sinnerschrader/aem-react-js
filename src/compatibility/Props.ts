export interface Props<P> {
  items?: {[key: string]: Props<{}>};
  itemsOrder?: string[];
  model: P;
  resourceType: string;
  dataPath: string;
}
