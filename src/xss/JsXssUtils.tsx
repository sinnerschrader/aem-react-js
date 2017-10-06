import {Context, XssUtils} from './XssUtils';

export class JsXssUtils implements XssUtils {
  public processText(text: string, context: Context = 'text'): string {
    // processing should have been done on server
    return text;
  }
}
