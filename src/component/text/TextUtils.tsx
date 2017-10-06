import {TextPool} from './TextPool';

const reviveFactory = (document: Document) => (key: any, value: any) => {
  if (!!value && !!value.$innerHTML) {
    const el = document.getElementById(value.$innerHTML);
    if (!el) {
      throw new Error(`cannot find text with id ${value}`);
    }

    return el.innerHTML;
  }

  return value;
};

const replaceFactory = (textPool: TextPool) => (key: any, value: any) => {
  if (typeof value === 'string') {
    const text = textPool.get(value);
    if (!!text) {
      return {$innerHTML: text};
    }
  }

  return value;
};

export {reviveFactory, replaceFactory};
