import {ComponentData} from '../component/ResourceComponent';
import {IncludeOptions} from './Sling';

// interface ResourceEntry {
//   readonly depth: number;
//   readonly data: any;
// }
//
function merge(target: any, source: any): void {
  if (source) {
    Object.keys(source).forEach((key: string) => {
      target[key] = source[key];
    });
  }
}

// function normalizeDepth(depth?: number): number {
//   if (depth < 0 || depth === null || typeof depth === 'undefined') {
//     return -1;
//   }
//
//   return depth;
// }
//
// function getProperty(data: any, path: string[]): any {
//   const subData = ResourceUtils.getProperty(data, path);
//
//   if (typeof subData === 'undefined' || subData === null) {
//     return {};
//   } else {
//     return subData;
//   }
// }

function createKey(path: string, selectors: string[]): string {
  if (selectors && selectors.length > 0) {
    return `${path}:${selectors.join('-')}`;
  }

  return path;
}

function createKeyForCd(componentData: ComponentData): string {
  const {id: {path, selectors}} = componentData;

  return createKey(path, selectors);
}

/**
 * This cache is used to store server side data and pass it to the client.
 */
export class Cache {
  // included data in the transform ?
  private included: {[path: string]: string};
  private serviceCalls: {[path: string]: any}; // prepare for deprecation
  private componentData: {[id: string]: ComponentData};

  public constructor() {
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
      Object.keys(cache).forEach(key => {
        merge((this as any)[key], cache[key]);
      });
    }
  }

  // public put(ref: ResourceRef, props: any): void {
  //   if (!props === null || typeof props === 'undefined') {
  //     delete this.transformProps[ref.path];
  //   } else {
  //     this.transformProps[createKey(ref.path, ref.selectors)] = props;
  //   }
  // }

  // public get(path: string, depth?: number): any {
  //   const normalizedDepth: number = normalizeDepth(depth);
  //   const subPath: string[] = [];
  //   let resource: ResourceEntry = this.resources[path];
  //
  //   while (!resource && path != null) {
  //     const result = ResourceUtils.findAncestor(path, 1);
  //
  //     if (result !== null) {
  //       path = result.path;
  //       subPath.splice(0, 0, result.subPath[0]);
  //       resource = this.resources[result.path];
  //     } else {
  //       break;
  //     }
  //   }
  //
  //   if (typeof resource === 'undefined' || resource === null) {
  //     return null;
  //   } else if (resource.depth < 0) {
  //     return getProperty(resource.data, subPath);
  //   } else if (normalizedDepth < 0) {
  //     return null;
  //   } else if (subPath.length + normalizedDepth - 1 <= resource.depth) {
  //     return getProperty(resource.data, subPath);
  //   } else {
  //     return null;
  //   }
  // }

  public getTransformData(path: string, selectors: string[]): any {
    return this.componentData[createKey(path, selectors)].transformData;
  }

  public putTransformData(path: string, selectors: string[], value: any): void {
    this.componentData[createKey(path, selectors)].transformData = value;
  }

  public putServiceCall(key: string, serviceCall: any): void {
    this.serviceCalls[key] = serviceCall;
  }

  public getServiceCall(key: string): any {
    return this.serviceCalls[key];
  }

  // public putDialogData(path: string, wrapper: EditDialogData): void {
  //   this.dialogData[path] = wrapper;
  // }
  //
  // public getDialogData(path: string): EditDialogData {
  //   return this.dialogData[path];
  // }

  public putComponentData(data: ComponentData): ComponentData {
    this.componentData[createKeyForCd(data)] = data;

    return data;
  }

  public getComponentData(path: string, selectors: string[]): ComponentData {
    return this.componentData[createKey(path, selectors)];
  }

  public putIncluded(
    path: string,
    selectors: string[],
    included: string,
    options: IncludeOptions = {}
  ): void {
    this.included[this.createIncludedKey(path, selectors, options)] = included;
  }

  public getIncluded(
    path: string,
    selectors: string[],
    options: IncludeOptions = {}
  ): string {
    return this.included[this.createIncludedKey(path, selectors, options)];
  }

  public getFullState(): any {
    return {
      included: this.included,
      serviceCalls: this.serviceCalls
    };
  }

  public clear(): void {
    this.included = {};
    this.serviceCalls = {};
  }

  private createIncludedKey(
    path: string,
    selectors: string[],
    options: IncludeOptions
  ): string {
    return (
      createKey(path, selectors) +
      (options && Object.keys(options).length > 0
        ? '::' + JSON.stringify(options)
        : '')
    );
  }
}
