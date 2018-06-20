import React, {Component} from 'react';
import {MapTo, Constants, Utils} from "@adobe/cq-react-editable-components";
import {EasyInclude} from './EasyInclude';
import {EditConfig} from './EditConfig';
import {MapVanillaTo} from './ModelContext';

const ContainerEditConfig: EditConfig = {

  dragDropName: 'container';

  emptyLabel: 'Container';

  public isEmpty(): boolean {
    return !this.props.cq_model || !this.props.cq_model.items;
  }
};

class EasyContainer extends Component {

  render() {


      return <div>
        <h1>children</h1>
        {this.children}
      </div>;

  }

  get children() {
    let _children;
    if (this.props.cq_model && this.props.cq_model.itemsOrder) {
      _children = this.props.cq_model.itemsOrder.map((key) => {

        const item = this.props.cq_model.items[key];
        return <EasyInclude key={key} resourceType={item[':type']} path={key}></EasyInclude>


        return _children;
      })
    } else{
      _children=[];
    }
    if (Utils.isInEditor()) {
      const dataPath = this.props.cq_model && this.props.cq_model[Constants.DATA_PATH_PROP] + "/*";
      _children.push(<div key="__new" className={Constants.NEW_SECTION_CLASS_NAMES} data-cq-data-path={dataPath}></div>);
    }

    return _children;
  }

}

MapVanillaTo('we-retail-journal/global/components/container', EasyContainer, ContainerEditConfig);
