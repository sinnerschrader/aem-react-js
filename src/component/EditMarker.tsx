import * as React from 'react';
import {AemComponent} from './AemComponent';

export interface EditMarkerProps {
  readonly label?: string;
}

export class EditMarker extends AemComponent<EditMarkerProps, any> {
  public render(): React.ReactElement<any> {
    if (this.getWcmmode() === 'edit') {
      return (
        <h3 className="placeholder">
          {this.props.label}
        </h3>
      );
    } else {
      return null;
    }
  }
}
