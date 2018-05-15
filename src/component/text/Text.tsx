import * as React from 'react';
import {HTMLAttributes} from 'react';
import {Context} from '../../xss/XssUtils';
import {AemComponent} from '../AemComponent';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  element: string;
  value: string | null;
  context?: Context;
}

export const poolableLength = 20;

export class Text extends AemComponent<TextProps> {
  public render(): JSX.Element {
    const Component = this.props.element;
    const passThroughs = this.getPassThroughs();
    const text = this.props.value;

    const poolable = text && text.length > poolableLength;

    const safeText: string | null = this.getContainer().xssUtils.processText(
      text,
      this.props.context
    );
    if (poolable) {
      const pool = this.getAemContext().container.textPool;
      const id = pool.put(text, this.context.root);

      return (
        <Component
          dangerouslySetInnerHTML={{__html: safeText}}
          {...passThroughs}
          data-react-text={id}
        />
      );
    } else {
      return (
        <Component
          dangerouslySetInnerHTML={{__html: safeText}}
          {...passThroughs}
        />
      );
    }
  }

  private getPassThroughs(): HTMLAttributes<HTMLElement> {
    const {
      element,
      value,
      dangerouslySetInnerHTML,
      id,
      context,
      ...passThroughs
    } = this.props;

    return passThroughs;
  }
}
