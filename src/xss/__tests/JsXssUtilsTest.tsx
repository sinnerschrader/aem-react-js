/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {JsXssUtils} from '../JsXssUtils';

describe('JsXssUtils', () => {
  it('should encode all tags', () => {
    const result = new JsXssUtils().processText('<span>Hallo</span>', 'text');
    expect(result).to.equal('&lt;span&gt;Hallo&lt;/span&gt;');
  });
  it('should encode undefined as empty string', () => {
    const result = new JsXssUtils().processText(undefined, 'text');
    expect(result).to.equal('');
  });
  it('should encode null as empty string', () => {
    const result = new JsXssUtils().processText(null, 'text');
    expect(result).to.equal('');
  });
  it('should remove script tags', () => {
    const result = new JsXssUtils().processText(
      'Guten<script>Hallo</script>',
      'html'
    );
    expect(result).to.equal('Guten');
  });
});
