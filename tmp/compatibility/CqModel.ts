export interface CqModel {
  ':type': string;
  ':pagePath': string;
  ':dataPath': string;
  items: {[nodeName: string]: CqModel};
  itemsOrder: string[];
}
