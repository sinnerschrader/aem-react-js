import {expect} from 'chai';
import {ResourceComponent} from '../component/ResourceComponent';
import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {ResourceInclude} from '../ResourceInclude';
import {AemTest} from '../test/AemTest';

describe('ResourceInclude', () => {
  class Test extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          <ResourceInclude path="embed" resourceType="/components/something" />
        </span>
      );
    }
  }

  class Test2 extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          <ResourceInclude path="embed" resourceType="/components/text" />
        </span>
      );
    }
  }

  class Text extends React.Component<any, any> {
    public render(): React.ReactElement<any> {
      return (
        <span>
          {this.props.text}
        </span>
      );
    }
  }

  let registry: ComponentRegistry = new ComponentRegistry('/components');
  registry.register(Test);
  registry.register(Test2);
  registry.registerVanilla({component: Text});

  let aemTest: AemTest = new AemTest();
  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render included resource', () => {
    let wrapper = aemTest.render({resourceType: '/components/test'});

    expect(wrapper.html()).to.equal(
      '<span><div><include resourcetype="/components/something" path="//embed"></include></div></span>'
    );
  });

  it('should render included vanilla resource', () => {
    let wrapper = aemTest.render(
      {
        embed: {text: 'hallo'},
        resourceType: '/components/test2'
      },
      '/content'
    );

    expect(wrapper.html()).to.equal(
      '<span><div class="dialog"><span>hallo</span></div></span>'
    );
  });
});
