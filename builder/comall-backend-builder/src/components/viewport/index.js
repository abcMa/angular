import React, { Component } from 'react';
import classNames from 'classnames';

export class Viewport extends Component {
    render() {
        const { entity, children, className, style } = this.props;

        let extendedChildren;

        // 需将当前实体向下传递
        if (entity) {
            extendedChildren = React.cloneElement(children, {
                entity
            });
        }
        else {
            extendedChildren = children;
        }

        return (
            <div className={classNames('viewport', className)} style={style}>
                {extendedChildren}
            </div>
        );
    }
}
