/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {JsXssUtils} from '../JsXssUtils';

describe('JsXssUtils', () => {
  it('should encode all tags', () => {
    const result = new JsXssUtils().processText('<span>Hallo</span>');
    expect(result).to.equal('&lt;span&gt;Hallo&lt;/span&gt;');
  });
});
