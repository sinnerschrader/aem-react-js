import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import {TextPool} from '../TextPool';
import {replaceFactory, reviveFactory} from '../TextUtils';

describe('TextUtils', () => {
  it('should revive text', () => {
    const textPool = new TextPool();
    const text = 'A012345678901234567890123';
    const id = textPool.put(text, '1');
    const text1 = 'B012345678901234567890123';
    const id1 = textPool.put(text1, '1');

    const body = `<body><div><span data-react-text=${id}>${text}</span>
<span data-react-text=${id1}>${text1}</span></div></body>`;
    const doc = new JSDOM(body).window.document;
    const reviver = reviveFactory(doc.body);

    const state = {
      a: {$innerHTML: id},
      b: {$innerHTML: id1}
    };
    const parsed = JSON.parse(JSON.stringify(state), reviver);

    expect(parsed.a).to.equal(text);
    expect(parsed.b).to.equal(text1);
  });
  it('should throw error if text not found', () => {
    const doc = new JSDOM('<body><div><span>Hi</span></div></body>').window
      .document;
    const reviver = reviveFactory(doc.body);

    let error: Error;
    try {
      JSON.parse('{"$innerHTML": "text_1"}', reviver);
    } catch (e) {
      error = e;
    }

    expect(error.message).to.not.eq('');
  });
  it('should create innerHTML prop ', () => {
    const textPool = new TextPool();
    const text = 'Moin';
    const id = textPool.put(text, '1');
    const json = JSON.stringify({mytext: text}, replaceFactory(textPool));

    expect(JSON.parse(json).mytext.$innerHTML).to.eq(id);
  });
  it('should keep text if not in pool', () => {
    const textPool = new TextPool();
    const text = 'Hi';
    const json = JSON.stringify({mytext: text}, replaceFactory(textPool));

    expect(JSON.parse(json).mytext).to.eq(text);
  });
});
