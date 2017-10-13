import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import {Context} from '../../../xss/XssUtils';
import {Text} from '../Text';
import {TextPool} from '../TextPool';

describe('Text', () => {
  it('should render span with text', () => {
    const textPool = new TextPool();
    const xssUtils = {
      processText(text: string, context?: Context): string {
        return text;
      }
    };
    const aemContext = {
      container: {textPool, xssUtils}
    };
    const item = enzyme.shallow(
      <Text value="Some text" element="span" className="test" context="html" />,
      {
        context: {aemContext}
      }
    );

    expect(item.html()).to.equal(
      '<span class="test" id="text_1">Some text</span>'
    );

    expect(textPool.getId('Some text')).to.equal('text_1');
  });
});
