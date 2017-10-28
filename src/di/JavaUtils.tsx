declare var Java: any;

export class JavaUtils {
  public static convertArrayToJava(data: any[]): any {
    if (typeof Java === 'undefined') {
      // for unit tests
      return data;
    }
    const ObjectArray = Java.type('java.lang.Object[]');
    const argsArray = new ObjectArray(data.length);
    data.forEach((item: any, idx: number) => (argsArray[idx] = item));

    return argsArray;
  }
}
