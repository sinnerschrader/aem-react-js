import * as xss from 'xss';
import {XssApi} from './XssApi';
import {Context, XssUtils} from './XssUtils';

export class JavaXssUtils implements XssUtils {
  private readonly xssApi: XssApi;

  public constructor(xssApi: XssApi) {
    this.xssApi = xssApi;
  }

  public processText(text: string, context: Context = 'text'): string {
    return context === 'text'
      ? this.escapeHtml(text)
      : context === 'html' ? this.xssApi.filterHTML(text) : text;
  }

  private escapeHtml(text: string): string {
    return xss.escapeHtml(text);
  }
}
