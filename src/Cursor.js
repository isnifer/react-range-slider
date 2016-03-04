import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';

const noop = function () {};

class Cursor extends Component {
    getStyle() {
        const transform = `translate${this.props.axis}(${this.props.offset}px)`;
        return {
            WebkitTransform: transform,
            MozTransform: transform,
            msTransform: transform,
            OTransform: transform,
            transform,
            position: 'absolute',
        };
    }

    getProps() {
        const props = assign({}, this.props);
        const i = this.props.position;
        const l = this.props.size;
        props.style = this.getStyle();
        props.onMouseDown = this.props.onDragStart;
        props.onTouchStart = (e, ...rest) => {
            e.preventDefault(); // prevent for scroll
            return this.props.onDragStart.apply(null, [e, ...rest]);
        };
        props.onMouseUp = this.props.onDragEnd;
        props.onTouchEnd = this.props.onDragEnd;
        props.zIndex = (i === 0 || i === l + 1) ? 0 : i + 1;
        return props;
    }

    render() {
        return (
            <div {...this.getProps()}>
                <span>
                    <span>{this.props.value}</span>
                </span>
            </div>
        );
    }
}

Cursor.propTypes = {
    axis: PropTypes.oneOf(['X', 'Y']),
    offset: PropTypes.number,
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    value: PropTypes.number,
};

Cursor.defaultProps = {
    axis: 'X',
    offset: 0,
    size: 0,
    position: 0,
    onDragStart: noop,
    onDragEnd: noop,
};

module.exports = Cursor;
