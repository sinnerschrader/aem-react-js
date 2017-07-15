// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {ReactParsys} from '../../component/ReactParsys';
import {ResourceComponent} from '../../component/ResourceComponent';
import {AemTest} from '../AemTest';

describe('AemTest', () => {
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

  const registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(Text);
  registry.register(ReactParsys);

  const aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render Text', () => {
    const wrapper = aemTest.render({
      resourceType: '/components/text',
      text: 'Hallo'
    });

    expect(wrapper.html()).to.equal('<span>Hallo</span>');
  });
});
