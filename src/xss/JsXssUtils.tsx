import * as xss from 'xss';
import {Context, XssUtils} from './XssUtils';

export class JsXssUtils implements XssUtils {
  public processText(text: string, context: Context = 'text'): string {
    return context === 'text'
      ? this.escapeHtml(text)
      : context === 'html' ? this.filterHTML(text) : text;
  }

  private escapeHtml(text: string): string {
    return xss.escapeHtml(text);
  }
  private filterHTML(text: string): string {
    return text.replace(/<script>.*<\/script>/, '');
  }
}
