/* tslint:disable no-any no-unused-expression */

import {expect} from 'chai';
import {PathResult, ResourceUtils} from '../ResourceUtils';

describe('ResourceUtils', () => {
  it('should return the containing page path', () => {
    const pagePath: string = ResourceUtils.getContainingPagePath(
      '/content/world/jcr:content/par/xxx.html'
    );

    expect(pagePath).to.equal('/content/world.html');
  });

  it('should leave pagePath as is', () => {
    const pagePath: string = ResourceUtils.getContainingPagePath(
      '/content/world.html'
    );

    expect(pagePath).to.equal('/content/world.html');
  });

  it('should return children which are objects with a primaryType prop', () => {
    const test: any = {child1: {'sling:resourceType': '1'}, value: 'hallo'};
    const children: any[] = ResourceUtils.getChildren(test);

    expect(Object.keys(children).length).to.equal(1);
    expect((children as any).child1['sling:resourceType']).to.equal('1');
  });

  it('should return value for path', () => {
    const test: any = {a: {b: 1}};
    const value: any = ResourceUtils.getProperty(test, ['a', 'b']);

    expect(value).to.equal(1);
  });

  it('should return null if path does not exist', () => {
    const test: any = {a: {b: 1}};
    const value: any = ResourceUtils.getProperty(test, ['a', 'b', 'c']);

    expect(value).to.be.null;
  });

  it('should recognize absolute path', () => {
    const value: boolean = ResourceUtils.isAbsolutePath('/a/b');

    expect(value).to.be.true;
  });

  it('should recognize relative path', () => {
    const value: boolean = ResourceUtils.isAbsolutePath('a/b');

    expect(value).to.be.false;
  });

  it('should find ancestor by depth', () => {
    const value: PathResult = ResourceUtils.findAncestor('/a/b/c', 2);

    expect(value.path).to.equal('/a');
    expect(value.subPath).to.deep.equal(['c', 'b']);
  });
});
