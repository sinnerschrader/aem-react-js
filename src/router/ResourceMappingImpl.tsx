/**
 * Trivial implementation for resource mapping.
 * It adds and removes an extension to convert from url path to resource path.
 */
export class ResourceMappingImpl {
    private extension: string = ".html";

    constructor(extension?: string) {
        if (extension) {
            this.extension = extension;
        }
    }

    public resolve(path: string): string {
        return path.substring(0, path.length - this.extension.length);
    }

    public map(path: string): string {
        return path + this.extension;
    }
}
