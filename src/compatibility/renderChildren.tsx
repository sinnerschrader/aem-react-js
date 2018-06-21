import {Constants, Utils} from '@adobe/cq-react-editable-components';
import * as React from 'react';
import {Include} from './Include';
import {Props} from './Props';

export type ChildTransform = (
  nodeName: string,
  childModel: Props<{}>
) => JSX.Element;

const defaultChildTransform = (nodeName: string, childModel: Props<{}>) => {
  const type = childModel.resourceType;

  return <Include key={nodeName} resourceType={type} path={nodeName} />;
};

export const renderChildren = (
  props: Props<{}>,
  transform: ChildTransform = defaultChildTransform
) => {
  let _children: JSX.Element[];
  if (props && props.itemsOrder) {
    _children = props.itemsOrder.map((key: string) => {
      const item: Props<{}> = props.items[key];

      return transform(key, item);
    });
  } else {
    _children = [];
  }
  if (Utils.isInEditor()) {
    const dataPath = props && `${props.dataPath}/*`;
    _children.push(
      <div
        key="__new"
        className={Constants.NEW_SECTION_CLASS_NAMES}
        data-cq-data-path={dataPath}
      />
    );
  }

  return _children;
};
