import {ResourceUtils} from '../ResourceUtils';
import {EditDialogData} from './Sling';

interface ResourceEntry {
  depth: number;
  data: any;
}

function merge(target: any, source: any): void {
  if (source) {
    Object.keys(source).forEach((key: string) => {
      target[key] = source[key];
    });
  }
}

function normalizeDepth(depth?: number): number {
  if (depth < 0 || depth === null || typeof depth === 'undefined') {
    return -1;
  }

  return depth;
}

function getProperty(data: any, path: string[]): any {
  const subData = ResourceUtils.getProperty(data, path);

  if (typeof subData === 'undefined' || subData === null) {
    return {};
  } else {
    return subData;
  }
}

/**
 * This cache is used to store server side data and pass it to the client.
 */
export class Cache {
  private resources: {[path: string]: ResourceEntry};
  private scripts: {[path: string]: EditDialogData};
  private included: {[path: string]: string};
  private serviceCalls: {[path: string]: any};

  public constructor() {
    this.resources = {};
    this.scripts = {};
    this.included = {};
    this.serviceCalls = {};
  }

  public generateServiceCacheKey(
    service: string,
    method: string,
    args: any[]
  ): string {
    let cacheKey = `${service}.${method}(`;

    for (let i = 0; i < args.length; i++) {
      cacheKey += String(args[i]) + '';
      if (i < args.length - 1) {
        cacheKey += ',';
      }
    }

    cacheKey += ')';

    return cacheKey;
  }

  public wrapServiceCall<T>(cacheKey: string, callback: () => T): T {
    let result: T = this.getServiceCall(cacheKey);

    if (typeof result === 'undefined') {
      result = callback();
      this.putServiceCall(cacheKey, result);
    }

    return result;
  }

  public mergeCache(cache: any): void {
    if (cache) {
      ['resources', 'included', 'scripts', 'serviceCalls'].forEach(key => {
        merge((this as any)[key], cache[key]);
      });
    }
  }

  public put(path: string, resource: any, depth?: number): void {
    if (resource === null || typeof resource === 'undefined') {
      delete this.resources[path];
    } else {
      this.resources[path] = {
        data: resource,
        depth: normalizeDepth(depth)
      };
    }
  }

  public get(path: string, depth?: number): any {
    const normalizedDepth: number = normalizeDepth(depth);
    const subPath: string[] = [];

    let resource: ResourceEntry = this.resources[path];

    while (!resource && path != null) {
      const result = ResourceUtils.findAncestor(path, 1);

      if (result !== null) {
        path = result.path;
        subPath.splice(0, 0, result.subPath[0]);
        resource = this.resources[result.path];
      } else {
        break;
      }
    }

    if (typeof resource === 'undefined' || resource === null) {
      return null;
    } else if (resource.depth < 0) {
      return getProperty(resource.data, subPath);
    } else if (normalizedDepth < 0) {
      return null;
    } else if (subPath.length + normalizedDepth - 1 <= resource.depth) {
      return getProperty(resource.data, subPath);
    } else {
      return null;
    }
  }

  public putServiceCall(key: string, serviceCall: any): void {
    this.serviceCalls[key] = serviceCall;
  }

  public getServiceCall(key: string): any {
    return this.serviceCalls[key];
  }

  public putScript(path: string, script: EditDialogData): void {
    this.scripts[path] = script;
  }

  public getScript(path: string): EditDialogData {
    return this.scripts[path];
  }

  public putIncluded(path: string, included: string): void {
    this.included[path] = included;
  }

  public getIncluded(path: string): string {
    return this.included[path];
  }

  public getFullState(): any {
    return {
      included: this.included,
      resources: this.resources,
      scripts: this.scripts,
      serviceCalls: this.serviceCalls
    };
  }

  public clear(): void {
    this.resources = {};
    this.scripts = {};
    this.included = {};
    this.serviceCalls = {};
  }
}
