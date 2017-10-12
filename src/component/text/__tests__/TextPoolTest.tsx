import {expect} from 'chai';
import {TextPool} from '../TextPool';

describe('TextPool', () => {
  it('put text', () => {
    const textPool = new TextPool();
    const id = textPool.put('Hi');

    expect(id).to.equal('text_1');
  });
  it('put text twice', () => {
    const textPool = new TextPool();
    const id1 = textPool.put('Hi');
    const id2 = textPool.put('Hi');

    expect(id2).to.equal(id1);
  });
  it('should get textId', () => {
    const textPool = new TextPool();
    const id = textPool.put('Hi');

    expect(textPool.getId('Hi')).to.equal(id);
  });
});
