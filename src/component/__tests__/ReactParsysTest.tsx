import {expect} from 'chai';
import {AemTest} from '../../test/AemTest';
import {ResourceComponent} from '../ResourceComponent';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {ReactParsys} from '../ReactParsys';

describe('ReactParsys', () => {
  class Text extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      let text: string = this.getResource()
        ? this.getResource().text
        : 'unknown';
      return (
        <span>
          {text}
        </span>
      );
    }
  }

  let registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(Text);
  registry.register(ReactParsys);

  let aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render ReactParsys with a single child', () => {
    let wrapper = aemTest.render({
      child_1: {
        'sling:resourceType': '/components/text',
        text: 'Hallo'
      },
      resourceType: '/components/react-parsys'
    });

    expect(wrapper.html()).to.equal(
      '<div><div class="dialog"><span>Hallo</span></div></div>'
    );
  });

  it('should render ReactParsys with no children', () => {
    let wrapper = aemTest.render({
      resourceType: '/components/react-parsys'
    });

    expect(wrapper.html()).to.equal('<div></div>');
  });
});
