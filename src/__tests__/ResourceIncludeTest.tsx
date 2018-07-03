// tslint:disable no-any

import {expect} from 'chai';
import * as React from 'react';
import {ComponentRegistry} from '../ComponentRegistry';
import {ResourceInclude} from '../ResourceInclude';
import {Props} from '../compatibility/Props';
import {ResourceComponent, ResourceRef} from '../component/ResourceComponent';
import {AemTest} from '../test/AemTest';

describe('ResourceInclude', () => {
  class Test extends ResourceComponent<any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span>
          <ResourceInclude path="embed" resourceType="/components/something" />
        </span>
      );
    }
  }

  class Test2 extends ResourceComponent<any, any> {
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

  class Test3 extends ResourceComponent<any, any> {
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

  class Test4 extends ResourceComponent<any, any> {
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

  class Text extends React.Component<Props<{text: string; className: string}>> {
    public render(): React.ReactElement<any> {
      return (
        <span className={this.props.model.className}>
          {this.props.model.text}
        </span>
      );
    }
  }

  class Text2 extends React.Component<
    Props<{text: string; className: string}>
  > {
    public render(): React.ReactElement<any> {
      return (
        <div className={this.props.model.className}>
          {this.props.model.text}
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
    const resourceType = '/components/test2';
    const ref: ResourceRef = {
      path: '/content',
      selectors: [],
      type: resourceType
    };
    const childRef: ResourceRef = {
      path: '/content/embed',
      selectors: [],
      type: resourceType
    };
    aemTest.addResource(childRef, {text: 'hallo'});
    const wrapper = aemTest.render({x: 1}, ref);

    expect(wrapper.html()).to.equal('<dialog><span>hallo</span></dialog>');
  });

  it('should render included vanilla resource', () => {
    const resourceType = '/components/test2';
    const ref: ResourceRef = {
      path: '/content',
      selectors: [],
      type: resourceType
    };
    aemTest.addResource(
      {
        path: '/content/embed',
        selectors: [],
        type: ''
      },
      {text: 'hallo', className: 'myClass'}
    );
    const wrapper = aemTest.render({}, ref);

    expect(wrapper.html()).to.equal(
      '<dialog><span class="myClass">hallo</span></dialog>'
    );
  });
  /*
  it('should render included vanilla resource with unknown selectors', () => {
    const wrapper = aemTest.render(
      {
        embed: {text: 'hallo', className: 'myClass'},
        resourceType: '/components/test2'
      },
      {
        path: '/content',
        selectors: ['x', 'y'],
        type: '/components/test2'
      }
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
        {
          path: '/content',
          type: '/components/test2',
          selectors: ['mobile']
        }
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
        {
          path: '/content',
          type: '/components/test3',
          selectors: ['x']
        }
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
        {
          path: '/content',
          type: '/components/test4',
          selectors: ['x']
        }
      );

      expect(wrapper.html()).to.equal(
        '<div class="dialog"><div class="myClass">hallo</div></div>'
      );
    }
  );
  */
});
