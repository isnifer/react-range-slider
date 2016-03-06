import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import { addEvent, removeEvent } from './event';

const noop = function () {};
const buildUnwrappingListener = (listener) => (e) => {
    const unwrappedEvent = e.changedTouches[e.changedTouches.length - 1];
    unwrappedEvent.stopPropagation = e.stopPropagation.bind(e);
    unwrappedEvent.preventDefault = e.preventDefault.bind(e);
    return listener(unwrappedEvent);
};

class Cursor extends Component {
    constructor(props) {
        super(props);

        this.addEvent = addEvent.bind(this);
        this.removeEvent = removeEvent.bind(this);

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

        const mousemoveListener = props.onDrag;
        const touchmoveListener = buildUnwrappingListener(mousemoveListener);
        let mouseupListener;
        let touchendListener;

        props.onMouseDown = (...rest) => {
            this.addEvent(window, 'mousemove', mousemoveListener);
            this.addEvent(window, 'touchmove', touchmoveListener);
            this.addEvent(window, 'mouseup', mouseupListener);
            this.addEvent(window, 'touchend', touchendListener);

            return props.onDragStart.apply(null, rest);
        };

        props.onTouchStart = (event) => {
            event.preventDefault(); // prevent for scroll
            return buildUnwrappingListener(props.onMouseDown)(event);
        };

        mouseupListener = (...rest) => {
            this.removeEvent(window, 'mousemove', mousemoveListener);
            this.removeEvent(window, 'touchmove', touchmoveListener);
            this.removeEvent(window, 'mouseup', mouseupListener);
            this.removeEvent(window, 'touchend', touchendListener);

            return props.onDragEnd.apply(null, rest);
        };

        touchendListener = buildUnwrappingListener(mouseupListener);

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
    onDrag: PropTypes.func,
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
