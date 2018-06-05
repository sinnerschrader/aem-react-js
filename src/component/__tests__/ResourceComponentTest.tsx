// tslint:disable no-any

import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as React from 'react';
import * as ReactTestUtils from 'react-dom/test-utils';
import {ComponentRegistry} from '../../ComponentRegistry';
import {RootComponentRegistry} from '../../RootComponentRegistry';
import {Container} from '../../di/Container';
import {Cache} from '../../store/Cache';
import {MockSling} from '../../test/MockSling';
import {
  ComponentData,
  ResourceComponent,
  ResourceRef
} from '../ResourceComponent';
import {RootComponent} from '../RootComponent';

/*tslint:disable-next-line*/
import '../../test/setup';

describe('ResourceComponent', () => {
  class Test extends ResourceComponent<any, any> {
    public renderBody(data: any): React.ReactElement<any> {
      return (
        <span className="test">
          {data.text ? data.text : 'unknown'}
        </span>
      );
    }
  }

  class Embedded extends ResourceComponent<any, any> {
    public renderBody(): React.ReactElement<any> {
      return <Test path="test" />;
    }
  }

  class AemContainer extends ResourceComponent<any, any> {
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
    return class AnonComponent extends ResourceComponent<any, any> {
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

  it('shouldComponentUpdate return false', () => {
    const props = {
      path: '/content/notfound'
    };
    const state = {};
    const shouldUpdate = Embedded.prototype.shouldComponentUpdate.call(
      {props, state, context: {}},
      props,
      state,
      {}
    );

    expect(shouldUpdate).to.equal(false);
  });

  it('shouldComponentUpdate return true for simple prop', () => {
    const props = {
      path: '/content/notfound'
    };
    const nextProps = {
      path: '/page/first'
    };
    const state = {};
    const shouldUpdate = Embedded.prototype.shouldComponentUpdate.call(
      {props, state},
      nextProps,
      state
    );

    expect(shouldUpdate).to.equal(true);
  });

  it('shouldComponentUpdate return true for complex prop', () => {
    const props = {
      path: '/content/notfound',
      resource: '/my/resource'
    };
    const nextProps = {
      path: '/content/notfound',
      resource: '/my/second/resource'
    };
    const state = {};
    const shouldUpdate = Embedded.prototype.shouldComponentUpdate.call(
      {props, state},
      nextProps,
      state
    );

    expect(shouldUpdate).to.equal(true);
  });

  it('should render loading message', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const itemx = enzyme.mount(
      <RootComponent
        aemContext={{container, registry}}
        component={Test}
        path="/content/notfound"
        selectors={[]}
      />
    );

    expect(itemx.find('span').html()).to.equal('<span>Loading</span>');
  });

  it('should get resource directly', () => {
    const cache = new Cache();
    const ref: ResourceRef = {
      path: '/content/embed',
      selectors: [],
      type: 'testType'
    };
    const data: ComponentData = {
      dialog: {element: 'div'},
      id: ref,
      transformData: {text: 'hi'}
    };
    cache.putComponentData(data);
    const child: ComponentData = {
      dialog: {element: 'div'},
      id: {
        path: '/content/embed/test',
        selectors: [],
        type: 'embedType'
      },
      transformData: {text: 'Hallo'}
    };
    cache.putComponentData(child);

    const container = new Container(cache, new MockSling(cache));

    const itemx = ReactTestUtils.renderIntoDocument(
      <RootComponent
        aemContext={{container, registry}}
        component={Embedded}
        path="/content/embed"
        selectors={[]}
      />
    ) as any;

    const test: Test = ReactTestUtils.findRenderedComponentWithType(
      itemx,
      Test
    );

    expect(test.getPath()).to.equal('/content/embed/test');
    expect(test.props.path).to.equal('test');
    expect(test.getTransformData().text).to.equal('Hallo');
  });
  /*
  it('should get resource from absolute Path', () => {
    const cache = new Cache();
    const ref: ResourceRef = {
      path: '/content/test',
      selectors: [],
      type: 'testType'
    };

    //cache.putComponentData(ref, {text: 'Hallo'});

    const container = new Container(cache, new MockSling(cache));

    const item = ReactTestUtils.renderIntoDocument(
      <RootComponent
        aemContext={{container, registry}}
        component={Test}
        path="/content/test"
        selectors={[]}
      />
    ) as any;

    const test: Test = ReactTestUtils.findRenderedComponentWithType(item, Test);

    expect(test.getPath()).to.equal('/content/test');
    expect(test.props.path).to.equal('/content/test');
    expect(test.getTransformData().text).to.equal('Hallo');
  });
*/
  it('should render htl children wcmmode disabled', () => {
    const cache = new Cache();
    const ref: ResourceRef = {
      path: '/content',
      selectors: [],
      type: 'testType'
    };
    const child1: ComponentData = {
      children: {},
      dialog: {element: 'div'},
      id: {path: '/content/child1', selectors: [], type: 'htl/test'},
      transformData: {
        'jcr:primaryType': 'nt:unstructured',
        'sling:resourceType': 'htl/test',
        text: 'Hallo'
      }
    };

    cache.putComponentData({
      children: {x: child1},
      childrenOrder: ['x'],
      dialog: {element: 'div'},
      id: ref,
      transformData: {}
    });

    cache.putComponentData(child1);

    const container = new Container(cache, new MockSling(cache));

    const item = enzyme.render(
      <RootComponent
        wcmmode="disabled"
        aemContext={{container, registry}}
        component={createContainer('child', 'div')}
        path="/content"
        selectors={[]}
      />
    );

    const include = item.find('include');

    expect(include[0].attribs.path).to.equal('/content/child1');
    expect(include[0].attribs.resourcetype).to.equal('htl/test');
  });

  /*
  describe('should render htl children wcmmode enabled', () => {
    let container: Container;

    before(() => {
      const cache = new Cache();
      const ref: ResourceRef = {
        path: '/content',
        selectors: [],
        type: 'testType'
      };

      cache.put(ref, {
        child1: {
          'jcr:primaryType': 'nt:unstructured',
          'sling:resourceType': 'htl/test',
          text: 'Hallo'
        }
      });

      container = new Container(cache, new MockSling(cache));
    });

    it('default ', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="edit"
          aemContext={{container, registry}}
          component={AemContainer}
          path="/content"
          selectors={[]}
        />
      );

      const include = item.find('include');

      expect(include[1].attribs.path).to.equal('/content/*');
      expect(include[1].attribs.resourcetype).to.equal(
        'foundation/components/parsys/new'
      );
    });

    it('with child wrapper ', () => {
      const item = enzyme.mount(
        <RootComponent
          wcmmode="disabled"
          aemContext={{container, registry}}
          component={createContainer('childClass', 'el')}
          id="root"
          path="/content"
          selectors={[]}
        />
      );

      const dialog = item.find('el');

      expect(dialog.props().className).to.equal('childClass');
      expect(dialog.html()).to.equal(
        '<el class="childClass"><div id="text_undefined_0">' +
          '<include resourcetype="htl/test" ' +
          'selectors="" path="/content/child1"></include></div></el>'
      );
    });
  });

  describe('should render react children wcmmode disabled', () => {
    let container: Container;

    before(() => {
      const cache = new Cache();
      const ref: ResourceRef = {
        path: '/content',
        selectors: [],
        type: 'testType'
      };

      cache.put(ref, {
        child1: {
          'jcr:primaryType': 'nt:unstructured',
          'sling:resourceType': 'test',
          text: 'OOPS'
        }
      });

      container = new Container(cache, new MockSling(cache));
    });

    it('default ', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={{container, registry}}
          component={AemContainer}
          path="/content"
          selectors={[]}
        />
      );

      const test = item.find('.test');

      expect((test[0].children[0] as any).data).to.equal('OOPS');
    });

    it('with child wrapper', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={{container, registry}}
          component={createContainer('childClass', 'el')}
          path="/content"
          selectors={[]}
        />
      );

      const test = item.find('el');

      expect(test.length).to.equal(1);
      expect(test[0].attribs.class).to.equal('childClass');
    });

    it('with child class name', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={{container, registry}}
          component={createContainer('childClass')}
          path="/content"
          selectors={[]}
        />
      );

      const dialog = item.find('.dialog');

      expect(dialog[0].attribs.class.split(' ')).to.contain('childClass');
    });
  });

  describe('should render react children with child path', () => {
    let container: Container;

    before(() => {
      const cache = new Cache();
      const ref: ResourceRef = {
        path: '/content',
        selectors: [],
        type: 'testType'
      };

       cache.put(ref, {
        children: {
          child1: {
            'jcr:primaryType': 'nt:unstructured',
            'sling:resourceType': 'test',
            text: 'OOPS'
          }
        }
      });

      container = new Container(cache, new MockSling(cache));
    });

    it('with child path', () => {
      const item = enzyme.render(
        <RootComponent
          wcmmode="disabled"
          aemContext={{container, registry}}
          component={createContainer('childClass', null, 'children')}
          path="/content"
          selectors={[]}
        />
      );

      const child = item.find('.test');

      expect((child[0].children[0] as any).data).to.equal('OOPS');
    });
  });
  */
});
