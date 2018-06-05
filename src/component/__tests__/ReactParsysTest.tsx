// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {AemTest} from '../../test/AemTest';
import {ReactParsys} from '../ReactParsys';
import {
  ComponentData,
  ResourceComponent,
  ResourceRef
} from '../ResourceComponent';

describe('ReactParsys', () => {
  class Text extends ResourceComponent<any, any> {
    public renderBody(): React.ReactElement<any> {
      const text: string = this.getTransformData()
        ? this.getTransformData().text
        : 'unknown';

      return (
        <span>
          {text}
        </span>
      );
    }
  }

  const registry = new ComponentRegistry('/components');

  registry.register(Text);
  registry.register(ReactParsys);

  const aemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  const childData: ComponentData = {
    dialog: {element: 'dialog'},
    id: {
      path: '/content/child1',
      selectors: [],
      type: '/components/text'
    },
    transformData: {
      text: 'hallo'
    }
  };

  const ref: ResourceRef = {
    path: '/content',
    selectors: [],
    type: '/components/react-parsys'
  };

  it('should render ReactParsys with a single child', () => {
    const parys: ComponentData = {
      children: {
        child1: childData
      },
      childrenOrder: ['child1'],
      dialog: {element: 'dialog'},
      id: {
        path: '/content',
        selectors: [],
        type: '/components/react-parsys'
      },
      transformData: {}
    };
    aemTest.addComponentData(parys);
    aemTest.addComponentData(childData);
    const wrapper = aemTest.render(null, ref);

    expect(wrapper.html()).to.equal('<dialog><span>hallo</span></dialog>');
  });

  it('should render ReactParsys with no children', () => {
    const parys: ComponentData = {
      dialog: {element: 'dialog'},
      id: {
        path: '/content',
        selectors: [],
        type: '/components/react-parsys'
      },
      transformData: {}
    };
    aemTest.addComponentData(parys);
    const wrapper = aemTest.render(null, ref);

    expect(wrapper.html()).to.equal('');
  });
});
