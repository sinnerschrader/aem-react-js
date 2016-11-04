export default class ResourceUtils {

    public static ABSOLUTE_PATH_PATTERN: RegExp = /^\//;

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

    public static getProperty(data: any, path: string[]): any {
        for (let i = 0; i < path.length; i++) {
            data = data[path[i]];
            if (!data) {
                return null;
            }
        }
        return data;
    }

    public static isAbsolutePath(path: string): boolean {
        return ResourceUtils.ABSOLUTE_PATH_PATTERN.test(path);
    }

    public static findAncestor(resourcePath: string, depth: number): PathResult {
        let subPath: string[] = [];
        for (let i = 0; i < depth; i++) {
            let index: number = resourcePath.lastIndexOf("/");
            if (index < 0) {
                return null;
            }
            subPath.push(resourcePath.substring(index + 1));
            resourcePath = resourcePath.substring(0, index);
        }
        return {path: resourcePath, subPath: subPath};
    }

    public static getContainingPagePath(requestPath: string): string {
        let index: number = requestPath.indexOf("jcr:content");
        if (index < 0) {
            return requestPath;
        }
        let dot: number = requestPath.indexOf(".");
        return requestPath.substring(0, index - 1) + requestPath.substring(dot, requestPath.length);
    }

}


export interface PathResult {
    path: string;
    subPath: string[];
}







