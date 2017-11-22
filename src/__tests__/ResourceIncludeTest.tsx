// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {ResourceInclude} from '../ResourceInclude';
import {ResourceComponent} from '../component/ResourceComponent';
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
          <ResourceInclude
            path="embed"
            resourceType="/components/text"
            extraProps={this.props.myClass}
          />
        </span>
      );
    }
  }

  class Text extends React.Component<any, any> {
    public render(): React.ReactElement<any> {
      return (
        <span className={this.props.className}>
          {this.props.text}
        </span>
      );
    }
  }

  const registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(Test);
  registry.register(Test2);
  registry.registerVanilla({component: Text});

  const aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render included resource', () => {
    const wrapper = aemTest.render({resourceType: '/components/test'});

    expect(wrapper.html()).to.equal(
      '<div id="text_root_0"><include resourcetype="/components/something" ' +
        'path="//embed"></include></div>'
    );
  });

  it('should render included vanilla resource', () => {
    const wrapper = aemTest.render(
      {
        embed: {text: 'hallo', className: 'myClass'},
        resourceType: '/components/test2'
      },
      '/content'
    );

    expect(wrapper.html()).to.equal(
      '<div class="dialog"><span class="myClass">hallo</span></div>'
    );
  });
});
