import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import * as ReactTestUtils from 'react-addons-test-utils';
import {ClientAemContext} from '../../AemContext';
import {ComponentManager} from '../../ComponentManager';
import {ComponentRegistry} from '../../ComponentRegistry';
import {RootComponentRegistry} from '../../RootComponentRegistry';
import {Container} from '../../di/Container';
import {Cache} from '../../store/Cache';
import {MockSling} from '../../test/MockSling';
import {ResourceComponent} from '../ResourceComponent';
import {RootComponent} from '../RootComponent';

describe('ResourceComponent', () => {
  class Test extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <span className="test">
          {this.props.resource ? this.props.resource.text : 'unknown'}
        </span>
      );
    }
  }

  class Embedded extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return <Test path="test" />;
    }
  }

  class AemContainer extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      const children: React.ReactElement<any>[] = this.renderChildren(
        this.props.childPath,
        this.props.childClassName,
        this.props.childElementName
      );

      return (
        <div data-container>
          {children}
        </div>
      );
    }
  }

  function createContainer(
    className?: string,
    elementName?: string,
    childPath?: string
  ): typeof AemContainer {
    return class AnonComponent extends ResourceComponent<any, any, any> {
      public renderBody(): React.ReactElement<any> {
        const children: React.ReactElement<any>[] = this.renderChildren(
          childPath,
          className,
          elementName
        );

        return (
          <div data-container>
            {children}
          </div>
        );
      }
    };
  }

  const testRegistry = new ComponentRegistry();

  testRegistry.register(Test);

  const registry = new RootComponentRegistry();

  registry.add(testRegistry);
  registry.init();

  const container: Container = new Container({} as any);

  const componentManager = new ComponentManager(registry, container);

  const aemContext: ClientAemContext = {
    componentManager,
    container,
    registry
  };

  it('should render loading message', () => {
    container.register('sling', new MockSling(null));

    const item = enzyme.mount(
      <RootComponent
        aemContext={aemContext}
        comp={Test}
        path="/content/notfound"
      />
    );

    expect(item.find('span').html()).to.equal('<span>Loading</span>');
  });

  it('should get resource directly', () => {
    const cache: Cache = new Cache();

    cache.put('/content/embed', {
      test: {
        text: 'Hallo'
      }
    });

    container.register('sling', new MockSling(cache));

    const item: any = ReactTestUtils.renderIntoDocument(
      <RootComponent
        aemContext={aemContext}
        comp={Embedded}
        path="/content/embed"
      />
    );

    const test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

    expect(test.getPath()).to.equal('/content/embed/test');
    expect(test.props.path).to.equal('test');
    expect(test.getResource().text).to.equal('Hallo');
  });

  it('should get resource from absolute Path', () => {
    const cache = new Cache();

    cache.put('/content/test', {text: 'Hallo'});
    container.register('sling', new MockSling(cache));

    const item: any = ReactTestUtils.renderIntoDocument(
      <RootComponent aemContext={aemContext} comp={Test} path="/content/test" />
    );

    const test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

    expect(test.getPath()).to.equal('/content/test');
    expect(test.props.path).to.equal('/content/test');
    expect(test.getResource().text).to.equal('Hallo');
  });

  it('should render htl children wcmmode disabled', () => {
    const cache = new Cache();

    cache.put('/content', {
      child1: {
        'jcr:primaryType': 'nt:unstructured',
        'sling:resourceType': 'htl/test',
        text: 'Hallo'
      }
    });

    container.register('sling', new MockSling(cache));

    const item = enzyme.render(
      <RootComponent
        wcmmode="disabled"
        aemContext={aemContext}
        comp={AemContainer}
        path="/content"
      />
    );

    const include: any = item.find('include');

    expect(include[0].attribs.path).to.equal('/content/child1');
    expect(include[0].attribs.resourcetype).to.equal('htl/test');
  });

  describe('should render htl children wcmmode enabled', () => {
    before(() => {
      const cache = new Cache();

      cache.put('/content', {
        child1: {
          'jcr:primaryType': 'nt:unstructured',
          'sling:resourceType': 'htl/test',
          text: 'Hallo'
        }
      });

      container.register('sling', new MockSling(cache));
    });

    it('default ', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="edit"
          aemContext={aemContext}
          comp={AemContainer}
          path="/content"
        />
      );

      const include: any = item.find('include');

      expect(include[1].attribs.path).to.equal('/content/*');
      expect(include[1].attribs.resourcetype).to.equal(
        'foundation/components/parsys/new'
      );
    });

    it('with child wrapper ', () => {
      const item = enzyme.mount(
        <RootComponent
          wcmmode="disabled"
          aemContext={aemContext}
          comp={createContainer('childClass', 'el')}
          path="/content"
        />
      );

      const dialog = item.find('el');

      expect(dialog.props().className).to.equal('childClass');
      expect(dialog.html()).to.equal(
        '<el class="childClass"><div><include resourcetype="htl/test" ' +
          'path="/content/child1"></include></div></el>'
      );
    });
  });

  describe('should render react children wcmmode disabled', () => {
    before(() => {
      const cache = new Cache();

      cache.put('/content', {
        child1: {
          'jcr:primaryType': 'nt:unstructured',
          'sling:resourceType': 'test',
          text: 'OOPS'
        }
      });

      container.register('sling', new MockSling(cache));
    });

    it('default ', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={aemContext}
          comp={AemContainer}
          path="/content"
        />
      );

      const test: any = item.find('.test');

      expect(test[0].children[0].data).to.equal('OOPS');
    });

    it('with child wrapper', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={aemContext}
          comp={createContainer('childClass', 'el')}
          path="/content"
        />
      );

      const test: any = item.find('el');

      expect(test.length).to.equal(1);
      expect(test[0].attribs.class).to.equal('childClass');
    });

    it('with child class name', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={aemContext}
          comp={createContainer('childClass')}
          path="/content"
        />
      );

      const dialog: any = item.find('.dialog');

      expect(dialog[0].attribs.class.split(' ')).to.contain('childClass');
    });
  });

  describe('should render react children with child path', () => {
    before(() => {
      const cache: Cache = new Cache();

      cache.put('/content', {
        children: {
          child1: {
            'jcr:primaryType': 'nt:unstructured',
            'sling:resourceType': 'test',
            text: 'OOPS'
          }
        }
      });

      container.register('sling', new MockSling(cache));
    });

    it('with child path', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={aemContext}
          comp={createContainer('childClass', null, 'children')}
          path="/content"
        />
      );

      const child: any = item.find('.test');

      expect(child[0].children[0].data).to.equal('OOPS');
    });
  });
});
