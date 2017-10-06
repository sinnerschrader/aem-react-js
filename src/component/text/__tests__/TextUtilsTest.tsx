import {expect} from 'chai';
import {JSDOM} from 'jsdom';
import {TextPool} from '../TextPool';
import {replaceFactory, reviveFactory} from '../TextUtils';

describe('TextUtils', () => {
  it('should revive text', () => {
    const textPool = new TextPool();
    const text = 'Hi';
    const id = textPool.put('Hi');
    const doc = new JSDOM(
      `<body><div><span id=${id}>${text}</span></div></body>`
    ).window.document;
    const reviveFn = reviveFactory(doc);

    const parsed = JSON.parse(`{"$innerHTML": "${id}"}`, reviveFn);

    expect(parsed).to.equal('Hi');
  });
  it('should throw error if text not found', () => {
    const doc = new JSDOM('<body><div><span>Hi</span></div></body>').window
      .document;
    const reviveFn = reviveFactory(doc);

    let error: Error;
    try {
      JSON.parse('{"$innerHTML": "text_1"}', reviveFn);
    } catch (e) {
      error = e;
    }

    expect(error.message).to.not.eq('');
  });
  it('should create innerHTML prop', () => {
    const textPool = new TextPool();
    const text = 'Hi';
    const id = textPool.put('Hi');
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
