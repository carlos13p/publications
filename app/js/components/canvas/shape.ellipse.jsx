import React, {Component} from 'react';

import ShapeFrame from './shape.frame';
import ShapeBase from './shape.base';

export default class ShapeEllipse extends ShapeBase {
  render() {
    let {
      dpi,
      selectable,
      shape,
      updateShape,
      zoom
    } = this.props,
    shapeFrame;

    if (super.isShapeSelected()) {
      shapeFrame = (
        <ShapeFrame {...this.props} />
      );
    }

    return (
      <g>
        <ellipse
          onClick={selectable ? this.shapeSelected : null}
          cx={(shape.x * dpi * zoom) + (shape.width / 2.0 * dpi * zoom)}
          cy={(shape.y * dpi * zoom) + (shape.height / 2.0 * dpi * zoom)}
          rx={shape.width / 2.0 * dpi * zoom} ry={shape.height / 2.0 * dpi * zoom}
          fill={shape.fill} stroke={shape.stroke}
          fillOpacity={shape.fillOpacity} strokeOpacity={shape.strokeOpacity}
          strokeWidth={shape.strokeWidth * zoom}
        />
        {shapeFrame}
      </g>
    );
  }
}