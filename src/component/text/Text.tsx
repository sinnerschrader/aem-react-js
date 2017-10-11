import * as React from 'react';
import {HTMLAttributes} from 'react';
import {Context} from '../../xss/XssUtils';
import {AemComponent} from '../AemComponent';

type TextPropertyNames = keyof TextProps;

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

  private getPassThroughs(): {[key: string]: string} {
    const passThroughs: {[key: string]: string} = Object.create(null);
    Object.keys(this.props)
      .filter(
        (key: string) =>
          ['element', 'value', 'dangerouslySetInnerHTML', 'id'].indexOf(key) < 0
      )
      .forEach(
        (key: TextPropertyNames) => (passThroughs[key] = this.props[key])
      );

    return passThroughs;
  }
}
