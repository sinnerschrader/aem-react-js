// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {AemTest} from '../../test/AemTest';
import {ReactParsys} from '../ReactParsys';
import {ResourceComponent} from '../ResourceComponent';

describe('ReactParsys', () => {
  class Text extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      const text: string = this.getResource()
        ? this.getResource().text
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

  it('should render ReactParsys with a single child', () => {
    const wrapper = aemTest.render({
      child_1: {
        'sling:resourceType': '/components/text',
        text: 'Hallo'
      },
      resourceType: '/components/react-parsys'
    });

    expect(wrapper.html()).to.equal(
      '<div class="dialog"><span>Hallo</span></div>'
    );
  });

  it('should render ReactParsys with no children', () => {
    const wrapper = aemTest.render({
      resourceType: '/components/react-parsys'
    });

    expect(wrapper.html()).to.equal('');
  });
});
