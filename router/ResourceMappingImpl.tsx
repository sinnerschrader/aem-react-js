export default class ResourceMappingImpl {

    constructor(extension: string) {
        this.extension = extension;
    }

    private extension: string = ".html";

    public resolve(path: string): string {
        return path.substring(0, path.length - this.extension.length);
    }

    public map(path: string): string {
        return path + this.extension;
    }

}


