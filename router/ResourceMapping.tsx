export interface ResourceMapping {
    resolve(requestPath: string): string;
    map(resourcePath: string): string;
}


