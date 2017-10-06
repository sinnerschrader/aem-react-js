export type Context = 'unsafe' | 'text' | 'html';

export interface XssUtils {
  processText(text: string, context?: Context): string;
}
