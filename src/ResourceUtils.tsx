export class ResourceUtils {
  public static readonly ABSOLUTE_PATH_PATTERN: RegExp = /^(\/|https?:\/\/)/;

  /**
   * returns only the properties of the given object
   * whoe have a property named sling:resourceType
   * @param resource the resource
   * @returns {any} the sub object
   */
  public static getChildren(resource: any): any {
    const children: any = {};

    if (resource) {
      Object.keys(resource).forEach((propertyName: string): void => {
        const child = resource[propertyName];

        if (child['sling:resourceType']) {
          children[propertyName] = child;
        }
      });
    }

    return children;
  }

  public static getProperty(data: any, path: string[]): any {
    /* tslint:disable-next-line prefer-for-of */
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
    const subPath: string[] = [];

    for (let i = 0; i < depth; i++) {
      const index: number = resourcePath.lastIndexOf('/');

      if (index < 0) {
        return null;
      }

      subPath.push(resourcePath.substring(index + 1));
      resourcePath = resourcePath.substring(0, index);
    }

    return {path: resourcePath, subPath};
  }

  public static getContainingPagePath(requestPath: string): string {
    const index: number = requestPath.indexOf('jcr:content');

    if (index < 0) {
      return requestPath;
    }

    const dot: number = requestPath.indexOf('.');

    return (
      requestPath.substring(0, index - 1) +
      requestPath.substring(dot, requestPath.length)
    );
  }

  public static isSamePath(path: string): boolean {
    return path === '.';
  }

  public static createPath(contextPath: string, path: string): string {
    return ResourceUtils.isAbsolutePath(path)
      ? path
      : ResourceUtils.isSamePath(path)
        ? contextPath
        : `${contextPath}/` + String(path);
  }
}

export interface PathResult {
  path: string;
  subPath: string[];
}
