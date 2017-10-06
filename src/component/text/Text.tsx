import * as React from 'react';
import {Context} from '../../xss/XssUtils';
import {AemComponent} from '../AemComponent';

export interface TextProps {
  element: string;
  value: string | null;
  context?: Context;
}

export class Text extends AemComponent<TextProps> {
  public render(): JSX.Element {
    const Component = this.props.element;
    const passThroughs: any = {};

    Object.keys(this.props)
      .filter(
        (key: string) =>
          ['element', 'value', 'dangerouslySetInnerHTML', 'id'].indexOf(key) < 0
      )
      .forEach((key: string) => (passThroughs[key] = (this.props as any)[key]));
    const text = this.props.value;

    const pool = this.getAemContext().container.textPool;
    const id = pool.put(text);
    const safeText: string | null = this.getContainer().xssUtils.processText(
      text,
      this.props.context
    );

    return (
      <Component
        dangerouslySetInnerHTML={{__html: safeText}}
        {...passThroughs}
        id={id}
      />
    );
  }
}
