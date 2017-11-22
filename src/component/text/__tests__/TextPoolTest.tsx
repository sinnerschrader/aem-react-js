import {expect} from 'chai';
import {TextPool} from '../TextPool';

describe('TextPool', () => {
  it('put text', () => {
    const textPool = new TextPool();
    const id = textPool.put('Hi', '1');

    expect(id).to.equal('text_1_0');
  });
  it('put text twice', () => {
    const textPool = new TextPool();
    const id1 = textPool.put('Hi', '1');
    const id2 = textPool.put('Hi', '1');

    expect(id2).to.equal(id1);
  });
  it('should get textId', () => {
    const textPool = new TextPool();
    const id = textPool.put('Hi', '1');

    expect(textPool.getId('Hi')).to.equal(id);
  });
  it('should get separate text ids of different roots', () => {
    const textPool = new TextPool();
    const id1 = textPool.put('Hi1', '1');
    const id2 = textPool.put('Hi2', '2');
    const id3 = textPool.put('Hi3', '1');

    expect(id1).to.equal('text_1_0');
    expect(id2).to.equal('text_2_0');
    expect(id3).to.equal('text_1_1');
  });
});
