// tslint:disable no-any

import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {RootComponentRegistry} from '../../RootComponentRegistry';
import {Container} from '../../di/Container';
import {Cache} from '../../store/Cache';
import {MockSling} from '../../test/MockSling';
import {ResourceComponent} from '../ResourceComponent';
import {RootComponent} from '../RootComponent';
import {VanillaInclude} from '../VanillaInclude';
import {WrapperFactory} from '../WrapperFactory';

describe('WrapperFactory', () => {
  class Test extends React.Component<any, any> {
    public render(): React.ReactElement<any> {
      return (
        <span data-global={this.props.global} data-text={this.props.text}>
          {this.props.children}
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

  const testRegistry = new ComponentRegistry('components');
  const registry = new RootComponentRegistry();

  testRegistry.registerVanilla({component: Text});

  registry.add(testRegistry);
  registry.init();

  it('should render simple vanilla component', () => {
    const cache = new Cache();

    cache.put('/test', {text: 'hallo'});

    const container = new Container(cache, new MockSling(cache));

    const reactClass = WrapperFactory.createWrapper(
      {component: Test, props: {global: 'bye'}},
      'components/test'
    );
    const item = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        comp={reactClass}
        path="/test"
      />
    );
    const html = item.html();

    expect(html).to.equal('<span data-global="bye" data-text="hallo"></span>');
  });

  it('should render loading component', () => {
    const loader = () => <span>...</span>;
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const reactClass = WrapperFactory.createWrapper(
      {
        component: Test,
        loadingComponent: loader as any,
        props: {global: 'bye'}
      },
      'components/test'
    );

    const item = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        comp={reactClass}
        path="/test"
      />
    );

    const html = item.html();

    expect(html).to.equal('<div class="dialog"><span>...</span></div>');
  });

  it('should render default loading ui', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const reactClass = WrapperFactory.createWrapper(
      {component: Test, props: {global: 'bye'}},
      'components/test'
    );

    const item = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        comp={reactClass}
        path="/test"
      />
    );

    const html: string = item.html();

    expect(html).to.equal('<div class="dialog"><span>Loading</span></div>');
  });

  it('should render simple vanilla include', () => {
    class MyTest extends ResourceComponent<any, any, any> {
      public renderBody(): any {
        return (
          <div>
            <VanillaInclude path="vanilla" component={Text} />
          </div>
        );
      }
    }

    const cache = new Cache();

    cache.put('/test', {vanilla: {text: 'good bye'}});

    const container = new Container(cache, new MockSling(cache));

    const item = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        comp={MyTest}
        path="/test"
      />
    );

    const html: string = item.html();

    expect(html).to.equal(
      '<div><div class="dialog"><span>good bye</span></div></div>'
    );
  });

  it('should render simple vanilla component with transform', () => {
    const transform = (resource: any, c: ResourceComponent<any, any, any>) => ({
      text: resource.textProperty
    });

    const cache = new Cache();

    cache.put('/test', {textProperty: 'hallo'});

    const container = new Container(cache, new MockSling(cache));

    const reactClass = WrapperFactory.createWrapper(
      {component: Text, transform},
      'components/text'
    );

    const item = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        comp={reactClass}
        path="/test"
      />
    );

    const html: string = item.html();

    expect(html).to.equal('<span>hallo</span>');
  });

  it('should render simple vanilla container', () => {
    const cache = new Cache();

    cache.put('/test', {
      children: {
        child: {
          'sling:resourceType': 'components/text',
          text: 'hey there'
        }
      }
    });

    const container = new Container(cache, new MockSling(cache));

    const reactClass = WrapperFactory.createWrapper(
      {component: Test, parsys: {path: 'children'}},
      'components/test'
    );

    const item = enzyme.mount(
      <RootComponent
        wcmmode="disabled"
        aemContext={{container, registry}}
        comp={reactClass}
        path="/test"
      />
    );

    const html: string = item.html();

    expect(html).to.equal(
      '<span><div class="dialog"><span>hey there</span></div></span>'
    );
  });
});
