export interface JsProxy {
  invoke(name: string, args: any[]): string;
  get(name: string): string;
  getObject(): string;
}
