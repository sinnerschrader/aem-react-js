// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {ReactParsys} from '../../component/ReactParsys';
import {ResourceComponent} from '../../component/ResourceComponent';
import {AemTest} from '../AemTest';

describe('AemTest', () => {
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

  const registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(Text);
  registry.register(ReactParsys);

  const aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render Text', () => {
    const wrapper = aemTest.render(
      {text: 'Hallo'},
      {
        path: '/content/test',
        selectors: [],
        type: '/components/text'
      }
    );

    expect(wrapper.html()).to.equal('Hallo');
  });
});
