import * as React from 'react';
import {EditDialogData} from '../store/Sling';
import {AemComponent} from './AemComponent';

export interface EditDialogProps {
  readonly path: string;
  readonly resourceType: string;
  readonly className?: string;
}

function createAuthorElement(dialog: EditDialogData): React.ReactElement<any> {
  if (!dialog) {
    return null;
  }

  const attributes: any = {};

  if (!!dialog.attributes) {
    Object.keys(dialog.attributes).forEach((key: string) => {
      attributes[key] = dialog.attributes[key];
    });
  }

  if (dialog.html) {
    attributes.dangerouslySetInnerHTML = {__html: dialog.html};
  }

  return React.createElement(dialog.element as any, attributes);
}

export class EditDialog extends AemComponent<EditDialogProps, any> {
  public render(): React.ReactElement<any> {
    const dialog: EditDialogData = this.getContainer().sling.getDialog(
      this.props.path,
      this.props.resourceType
    );

    if (dialog) {
      return this.createWrapperElement(dialog);
    } else {
      return this.props.children as React.ReactElement<any>;
    }
  }

  private createWrapperElement(
    dialog: EditDialogData
  ): React.ReactElement<any> {
    const attributes: {[name: string]: any} = {};

    if (dialog.attributes) {
      Object.keys(dialog.attributes).forEach(
        (key: string) => (attributes[key] = dialog.attributes[key])
      );

      if (this.props.className) {
        if (
          typeof attributes.className !== 'undefined' &&
          attributes.className !== null
        ) {
          attributes.className += ' ' + this.props.className;
        } else {
          attributes.className = this.props.className;
        }
      }
    }

    return React.createElement(
      dialog.element as any,
      attributes,
      this.props.children,
      createAuthorElement(dialog.child)
    );
  }
}
