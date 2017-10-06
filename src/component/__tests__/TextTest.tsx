import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import {Text} from '../text/Text';
import {TextPool} from '../text/TextPool';

describe('Text', () => {
  it('should render span with text', () => {
    const textPool = new TextPool();
    const aemContext = {
      container: {textPool}
    };
    const item = enzyme.shallow(<Text value="Some text" el="span" />, {
      context: {aemContext}
    });

    expect(item.html()).to.equal('<span id="text_1">Some text</span>');
    expect(textPool.get('Some text')).to.equal('text_1');
  });
});
