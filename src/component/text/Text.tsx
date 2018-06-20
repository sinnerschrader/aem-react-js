import * as React from 'react';
/*tslint:disable-next-line */
import {HTMLAttributes} from 'react';
import {Context} from '../../xss/XssUtils';
import {AemComponent} from '../AemComponent';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  element: string;
  value: string | null;
  context?: Context;
}

export class Text extends AemComponent<TextProps> {
  public render(): JSX.Element {
    const Component = this.props.element;
    const passThroughs = this.getPassThroughs();
    const text = this.props.value;

    const pool = this.getAemContext().container.textPool;
    const safeText: string | null = this.getContainer().xssUtils.processText(
      text,
      this.props.context
    );
    const id = pool.put(text, this.context.root);

    return (
      <Component
        dangerouslySetInnerHTML={{__html: safeText}}
        {...passThroughs}
        id={id}
      />
    );
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
