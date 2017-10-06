import {TextPool} from './TextPool';

const reviveFactory = (document: Document) => (key: string, value: any) => {
  if (!!value && !!value.$innerHTML) {
    const el = document.getElementById(value.$innerHTML);
    if (!el) {
      throw new Error(`cannot find text with id ${value}`);
    }

    return el.innerHTML;
  }

  return value;
};

const replaceFactory = (textPool: TextPool) => (key: string, value: any) => {
  if (typeof value === 'string') {
    const id = textPool.getId(value);
    if (!!id) {
      return {$innerHTML: id};
    }
  }

  return value;
};

export {reviveFactory, replaceFactory};
