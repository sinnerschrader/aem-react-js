export default class ResourceUtils {

    /**
     * returns only the properties of the given object whoe have a property named jcr:primaryType
     * @param resource the resource
     * @returns {any} the sub object
     */
    public static getChildren(resource: any): any {
        let children: any = {};
        if (resource) {
            Object.keys(resource).forEach((propertyName: string): void => {
                let child = resource[propertyName];
                if (child["jcr:primaryType"]) {
                    children[propertyName] = child;
                }
            });
        }
        return children;
    }

    public static findAncestor(resourcePath: string, depth: number): string {
        for (let i = 0; i < depth; i++) {
            resourcePath = resourcePath.substring(0, resourcePath.lastIndexOf("/"));
        }
        return resourcePath;

    }

}






