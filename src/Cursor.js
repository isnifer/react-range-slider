import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';

const noop = function () {};

class Cursor extends Component {
    constructor(props) {
        super(props);

        this.getStyle = this.getStyle.bind(this);
        this.getProps = this.getProps.bind(this);
        this.getZIndex = this.getZIndex.bind(this);
    }

    getStyle(zIndex) {
        const transform = `translate${this.props.axis}(${this.props.offset}px)`;
        return {
            WebkitTransform: transform,
            MozTransform: transform,
            msTransform: transform,
            OTransform: transform,
            transform,
            position: 'absolute',
            zIndex,
        };
    }

    getProps() {
        const props = assign({}, this.props);
        const zIndex = this.getZIndex();
        props.style = this.getStyle(zIndex);
        props.onMouseDown = this.props.onDragStart;
        props.onTouchStart = (e, ...rest) => {
            e.preventDefault(); // prevent for scroll
            return this.props.onDragStart.apply(null, [e, ...rest]);
        };
        props.onMouseUp = props.onTouchEnd = this.props.onDragEnd;
        return props;
    }

    getZIndex() {
        const {position, min, max, value, size} = this.props;

        // If first everywhere but not max  || If last at max value
        if (position === 0 && value !== max || (position === size || position === size + 1) && value === max) {
            return 0;
        }

        // If first at max value            || If last at min value
        if (position === 0 && value === max || (position === size || position === size + 1) && value === min) {
            return size + 1;
        }

        // Between first and last at max value
        if (position !== 0 && position !== size && position !== size + 1 && value === max) {
            return size - position;
        }

        return position + 1;
    }

    render() {
        const props = this.getProps();
        return (
            <div {...props}>
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
    min: PropTypes.number,
    max: PropTypes.number,
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
