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

  class Test3 extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          <ResourceInclude
            path="embed"
            resourceType="/components/text"
            extraProps={this.props.myClass}
            options={{selectors: ['mobile']}}
          />
        </span>
      );
    }
  }

  class Test4 extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          <ResourceInclude
            path="embed"
            resourceType="/components/text"
            extraProps={this.props.myClass}
            options={{addSelectors: ['mobile']}}
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

  class Text2 extends React.Component<any, any> {
    public render(): React.ReactElement<any> {
      return (
        <div className={this.props.className}>
          {this.props.text}
        </div>
      );
    }
  }

  const registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(Test);
  registry.register(Test2);
  registry.register(Test3);
  registry.register(Test4);
  registry.registerVanilla({component: Text, name: '/components/text'});
  registry.registerVanilla({
    component: Text2,
    name: '/components/text',
    selector: 'mobile'
  });

  const aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render included resource', () => {
    const wrapper = aemTest.render({resourceType: '/components/test'});

    expect(wrapper.html()).to.equal(
      '<div data-react-text="text_root_0">' +
        '<include resourcetype="/components/something" ' +
        'selectors path="//embed">' +
        '</include>' +
        '</div>'
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

  it('should render included vanilla resource with unknown selectors', () => {
    const wrapper = aemTest.render(
      {
        embed: {text: 'hallo', className: 'myClass'},
        resourceType: '/components/test2'
      },
      '/content',
      ['x', 'y']
    );

    expect(wrapper.html()).to.equal(
      '<div class="dialog"><span class="myClass">hallo</span></div>'
    );
  });

  it(
    'should render included vanilla resource ' +
      'with selector inherited from root',
    () => {
      const wrapper = aemTest.render(
        {
          embed: {text: 'hallo', className: 'myClass'},
          resourceType: '/components/test2'
        },
        '/content',
        ['mobile']
      );

      expect(wrapper.html()).to.equal(
        '<div class="dialog"><div class="myClass">hallo</div></div>'
      );
    }
  );

  it(
    'should render included vanilla resource with selector ' +
      'explicitly passed to ResourceInclude via addSelectors',
    () => {
      const wrapper = aemTest.render(
        {
          embed: {text: 'hallo', className: 'myClass'},
          resourceType: '/components/test3'
        },
        '/content',
        ['x']
      );

      expect(wrapper.html()).to.equal(
        '<div class="dialog"><div class="myClass">hallo</div></div>'
      );
    }
  );

  it(
    'should render included vanilla resource with selector ' +
      'explicitly passed to ResourceInclude',
    () => {
      const wrapper = aemTest.render(
        {
          embed: {text: 'hallo', className: 'myClass'},
          resourceType: '/components/test4'
        },
        '/content',
        ['x']
      );

      expect(wrapper.html()).to.equal(
        '<div class="dialog"><div class="myClass">hallo</div></div>'
      );
    }
  );
});
