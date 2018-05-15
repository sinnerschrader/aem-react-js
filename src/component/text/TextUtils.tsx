import {TextPool} from './TextPool';

type reviver = (key: string, value: any) => any;

const reviveFactory = (container: Element) => {
  const elements = container.querySelectorAll('[data-react-text]');
  const pool: {[id: string]: string} = {};
  for (let i = 0; i < elements.length; i++) {
    pool[elements.item(i).getAttribute('data-react-text')] = elements.item(
      i
    ).innerHTML;
  }

  return (key: string, value: any) => {
    if (!!value && !!value.$innerHTML) {
      const el = pool[value.$innerHTML];
      if (!el) {
        throw new Error(`cannot find text with id ${value}`);
      }

      return el;
    }

    return value;
  };
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

export {reviveFactory, replaceFactory, reviver};
