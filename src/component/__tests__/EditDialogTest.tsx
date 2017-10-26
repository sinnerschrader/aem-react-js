// tslint:disable no-any

import {expect} from 'chai';
import * as enzyme from 'enzyme';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {RootComponentRegistry} from '../../RootComponentRegistry';
import {Container} from '../../di/Container';
import {Cache} from '../../store/Cache';
import {MockSling} from '../../test/MockSling';
import {EditDialog} from '../EditDialog';

describe('EditDialog', () => {
  class Wrapper extends React.Component<any, any> {
    public static childContextTypes: any = {
      aemContext: PropTypes.any
    };

    public getChildContext(): any {
      return {
        aemContext: this.props.aemContext
      };
    }

    public render(): JSX.Element {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
  }

  it('should render wrapper element', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const item = enzyme.mount(
      <Wrapper aemContext={{container, registry: new RootComponentRegistry()}}>
        <EditDialog path="/test" resourceType="components/test" />
      </Wrapper>
    );

    expect(item.html()).to.equal('<div><div class="dialog"></div></div>');
  });

  it('should render wrapper element with extra className', () => {
    const cache = new Cache();
    const container = new Container(cache, new MockSling(cache));

    const item = enzyme.mount(
      <Wrapper aemContext={{container, registry: new RootComponentRegistry()}}>
        <EditDialog
          className="hi"
          path="/test"
          resourceType="components/test"
        />
      </Wrapper>
    );

    expect(item.html()).to.equal('<div><div class="dialog hi"></div></div>');
  });

  it(
    'should render wrapper element ' +
      'with extra className and existing className',
    () => {
      const cache = new Cache();

      const container = new Container(
        cache,
        new MockSling(cache, {
          child: {
            element: 'script',
            html: 'Cq.makeEditable()'
          },
          element: 'ul'
        })
      );

      const item = enzyme.mount(
        <Wrapper
          aemContext={{container, registry: new RootComponentRegistry()}}
        >
          <EditDialog path="/test" resourceType="components/test" />
        </Wrapper>
      );

      expect(item.html()).to.equal(
        '<div><ul><script>Cq.makeEditable()</script></ul></div>'
      );
    }
  );

  it('should render classic ui', () => {
    const cache = new Cache();

    const container = new Container(
      cache,
      new MockSling(cache, {
        attributes: {
          className: 'more react-parsys'
        },
        child: {
          attributes: {
            type: 'text/javascript'
          },
          child: null,
          element: 'script',
          html: 'CQ.WCM.edit();'
        },
        element: 'div',
        html: null
      })
    );

    const item = enzyme.mount(
      <Wrapper aemContext={{container, registry: new RootComponentRegistry()}}>
        <EditDialog path="/test" resourceType="components/test" />
      </Wrapper>
    );

    expect(item.html()).to.equal(
      '<div><div class="more react-parsys">' +
        '<script type="text/javascript">CQ.WCM.edit();</script></div></div>'
    );
  });

  it('should render touch ui', () => {
    const cache = new Cache();

    const container = new Container(
      cache,
      new MockSling(cache, {
        child: {
          attributes: {
            'data-config': '{"path":"/content"}',
            'data-path': '/content/'
          },
          child: null,
          element: 'cq',
          html: ''
        },
        element: 'div',
        html: null
      })
    );

    const item = enzyme.mount(
      <Wrapper aemContext={{container, registry: new RootComponentRegistry()}}>
        <EditDialog path="/test" resourceType="components/test" />
      </Wrapper>
    );

    expect(item.html()).to.equal(
      '<div><div><cq data-config="{&quot;path&quot;:&quot;/content&quot;}" ' +
        'data-path="/content/"></cq></div></div>'
    );
  });
});
