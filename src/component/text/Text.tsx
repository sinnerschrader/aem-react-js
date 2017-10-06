import * as React from 'react';
import {AemComponent} from '../AemComponent';

export interface TextProps {
  el: string;
  value: string | null;
}

export class Text extends AemComponent<TextProps> {
  public render(): JSX.Element {
    const Component = this.props.el;
    const passThroughs: any = {};
    Object.keys(this.props)
      .filter(
        (key: string) =>
          ['el', 'value', 'dangerouslySetInnerHTML', 'id'].indexOf(key) < 0
      )
      .forEach((key: string) => (passThroughs[key] = (this.props as any)[key]));
    const text = this.props.value;

    const pool = this.getAemContext().container.textPool;
    const id = pool.put(text);

    return (
      <Component
        dangerouslySetInnerHTML={{__html: text}}
        {...passThroughs}
        id={id}
      />
    );
  }
}
