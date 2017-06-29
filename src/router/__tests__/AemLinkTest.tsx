import {expect} from 'chai';
import {AemTest} from '../../test/AemTest';
import * as enzyme from 'enzyme';
import {ResourceComponent} from '../../component/ResourceComponent';
import * as React from 'react';
import {ComponentRegistry} from '../../ComponentRegistry';
import {ReactParsys} from '../../component/ReactParsys';
import {AemLink} from '../../router/AemLink';
import {Router, Route, createMemoryHistory} from 'react-router';
import {ShallowWrapper} from 'enzyme';

describe('AemLink', () => {
  let history = createMemoryHistory('/index.html' as any);

  class LinkComponent extends React.Component<any, any> {
    public render(): React.ReactElement<any> {
      return (
        <span>
          <AemLink to="/bla.html">hallo</AemLink>
        </span>
      );
    }
  }
  class RouterComponent extends ResourceComponent<any, any, any> {
    public renderBody(): React.ReactElement<any> {
      return (
        <div>
          <Router history={history}>
            <Route path="/index.html" component={LinkComponent} />
            <Route path="/bla.html" component={LinkComponent} />
          </Router>
        </div>
      );
    }
  }

  let registry: ComponentRegistry = new ComponentRegistry('/components');

  registry.register(RouterComponent);
  registry.register(ReactParsys);

  let aemTest: AemTest = new AemTest();

  aemTest.addRegistry(registry);
  aemTest.init();

  it('should render AemLink in Router', () => {
    let wrapper = aemTest.render({
      resourceType: '/components/router-component'
    });

    expect(wrapper.html()).to.equal(
      '<div><span><a href="/bla.html">hallo</a></span></div>'
    );
  });

  it('should render AemLink', () => {
    class MyLink extends AemLink {
      protected isClickable(): boolean {
        return true;
      }
    }

    let router: any = {};

    let container = {
      get: () => {
        return {
          createLocation: () => {
            return {pathname: 'bla.html'};
          }
        };
      }
    };

    let context: any = {
      aemContext: {
        container: container
      },
      router: router,
      wcmmode: 'disabled'
    };

    let wrapper: ShallowWrapper<
      any,
      any
    > = enzyme.shallow(<MyLink to="bla.html" />, {context: context});

    wrapper.simulate('click');
  });
});
