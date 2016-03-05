/*
 * react-range-slider-bem - index.js
 * Copyright(c) 2015 xeodou <xeodou@gmail.com>
 * Copyright(c) 2016 isnifer <isnifer@gmail.com>
 * MIT Licensed
 */

import React, { Component, PropTypes } from 'react';
import assign from 'object-assign';
import { isTouchDevice, dragEventFor, addEvent, removeEvent } from './event';
import Cursor from './Cursor';

const noop = () => {};

/**
 * To prevent text selection while dragging.
 * @credits: http://stackoverflow.com/questions/5429827/how-can-i-prevent-text-element-selection-with-cursor-drag
 */
function pauseEvent(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (e.preventDefault) {
        e.preventDefault();
    }

    /* eslint-disable no-param-reassign */
    e.cancelBubble = true;
    e.returnValue = false;

    return false;
}

/**
 * Format [1, 2] or ['#FFF', '#FAD']
 * To [{value:1, color: null}] or [{value: '20%', color: '#FFF'}]
 */
function valueFormat(value, max, min) {
    const currentValue = typeof value === 'number' ? [value] : value;
    return currentValue.map((v, i) => {
        if (typeof v === 'object') {
            return v;
        }

        return {
            value: typeof v === 'number' ? v : (parseInt((i + 1) * (max - min) / value.length, 10) + min),
            color: typeof v === 'string' ? v : '',
        };
    });
    // TO Do: Sort ?
    // .sort(function(a, b) {
    //   return parseInt(a.value) - parseInt(b.value);
    // })
}

/**
 * Find min and max in an object.
 * @credits: http://stackoverflow.com/questions/8864430/compare-javascript-array-of-objects-to-get-min-max
 */
function finder(cmp, arr, attr) {
    let val = arr[0] ? arr[0][attr] || 0 : 0;

    for (let i = 1; i < arr.length; i++) {
        val = cmp(val, arr[i][attr]);
    }

    return val;
}

class RangeSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            index: -1, // TODO: find better solution
            clicked: -1,
            upperBound: 0,
            axis: this.isHorizontal() ? 'X' : 'Y',
            minProp: this.isHorizontal() ? 'left' : 'top',
            maxProp: this.isHorizontal() ? 'right' : 'bottom',
            value: [],
        };

        this.isTouchDevice = isTouchDevice.bind(this);
        this.dragEventFor = dragEventFor;
        this.addEvent = addEvent.bind(this);
        this.removeEvent = removeEvent.bind(this);

        this.getValue = this.getValue.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleBarClick = this.handleBarClick.bind(this);
        this.isHorizontal = this.isHorizontal.bind(this);
        this.calcOffset = this.calcOffset.bind(this);
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
        this.addEvent(window, 'resize', this.handleResize);
    }

    componentDidMount() {
        this.handleResize();
    }

    componentWillReceiveProps(nextProps) {
        let range = nextProps.range || this.props.range;

        if (range) {
            range = typeof range === 'boolean' ? [range, range] : range;
        } else {
            range = [];
        }

        const header = range[0];
        const tailer = range[1];
        let min = nextProps.min || this.props.min;
        let max = nextProps.max || this.props.max;
        min = typeof header === 'number' ? Math.max(header, min) : min;
        max = typeof tailer === 'number' ? Math.min(Math.max(tailer, min), max) : max;
        const value = valueFormat(nextProps.value || this.props.value, max, min);

        this.setState({min, max, header, tailer, value}, () => {
            // Calculate the bound size again, if the bound size less than 0
            if (this.state.upperBound <= 0) {
                this.handleResize();
            }
        });
    }

    componentWillUnmount() {
        this.removeEvent(window, 'resize', this.handleResize);
    }

    getValue() {
        return this.state.value;
    }

    handleResize() {
        const slider = this.refs.slider;
        const handle = this.refs.header ? this.refs.header : {};
        // const rect = slider.getBoundingClientRect();

        const size = this.isHorizontal() ? 'clientWidth' : 'clientHeight';

        // const sliderMax = rect[this.props.maxProp] - (handle[size] || 0);
        // const sliderMin = rect[this.props.minProp];

        this.setState({
            upperBound: slider[size] - (handle[size] || 0),
        });
    }

    handleDragStart(i, e) {
        if (this.props.disabled) {
            return;
        }

        // Make it possible to attach event handlers on top of this one
        this.props.onMouseDown(e);
        const currentEvent = this.isTouchDevice() ? e.changedTouches[e.changedTouches.length - 1] : e;
        const position = currentEvent[`page${this.state.axis}`];
        let value = this.state.min;
        const l = this.state.value.length;

        if (l !== 0 && i > 0 && i <= l) {
            value = this.state.value[i - 1].value;
        } else if (i === l + 1) {
            value = this.state.max;
        }

        this.setState({
            startValue: value,
            startPosition: position,
            index: i,
            clicked: -1,
        });

        this.props.onBeforeChange(currentEvent, i - 1);

        // Add currentEvent handlers
        this.addEvent(window, this.dragEventFor.move, this.handleDrag);
        this.addEvent(window, this.dragEventFor.end, this.handleDragEnd);
        pauseEvent(currentEvent);
    }

    handleDrag(e) {
        if (this.props.disabled) {
            return;
        }

        const currentEvent = this.isTouchDevice() ? e.changedTouches[e.changedTouches.length - 1] : e;
        const position = currentEvent[`page${this.state.axis}`];
        const diffPosition = position - this.state.startPosition;
        const diffValue = (diffPosition / this.state.upperBound) * (this.props.max - this.props.min);
        const i = this.state.index;
        const l = this.state.value.length;

        // Cursor position after moved
        const nextCursorPosition = this.state.startValue + diffValue;

        if (i === 0) {
            // Move header
            if (this.props.disabledHeader) {
                return;
            }

            const v = l > 0 ? finder(Math.min, this.state.value, 'value') : this.state.max;
            let min;

            if (nextCursorPosition <= v) {
                min = Math.max(nextCursorPosition < 0 ? 0 : nextCursorPosition);
            } else {
                min = Math.max(v, this.props.min);
            }
            min = parseInt(min, 10);

            this.setState({min});
        } else if (i > 0 && i <= l) {
            // Move cursor
            // The cursor postion must smaller than the next cursor or this.state.max
            // bigger than the previous cursor or this.state.min
            const {value} = this.state;

            // var v = value[i - 1].value;
            const min = (value[i - 2] ? value[i - 2].value : this.state.min);
            const max = value[i] ? value[i].value : this.state.max;
            value[i - 1].value = parseInt(Math.max(Math.min(nextCursorPosition, max), min), 10);

            this.setState({value});
        } else if (i === l + 1) {
            // Move tailer
            if (this.props.disabledTailer) return;
            const v = l > 0 ? finder(Math.max, this.state.value, 'value') : this.state.min;
            this.setState({
                max: parseInt(Math.min(nextCursorPosition >= v ? nextCursorPosition : v, this.props.max), 10),
            });
        }

        this.props.onChange(e, i - 1, this.state.value);
    }

    handleDragEnd(e) {
        this.setState({index: -1});

        this.props.onAfterChange(e, this.state.value);

        // Remove event handlers
        this.removeEvent(window, this.dragEventFor.move, this.handleDrag);
        this.removeEvent(window, this.dragEventFor.end, this.handleDragEnd);
        e.stopPropagation();
    }

    handleBarClick(e) {
        const idx = parseInt(e.target.id.split('_')[1], 10);
        this.setState({clicked: idx});
        this.props.onBarClick(e, idx, this.state.value[idx]);
    }

    isHorizontal() {
        return this.props.orientation !== 'vertical';
    }

    // calculates the offset of a handle in pixels based on its value.
    calcOffset(v) {
        if (typeof v === 'undefined') {
            return;
        }

        const value = typeof v === 'number' ? v : v.value;
        const ratio = (value - this.props.min) / (this.props.max - this.props.min);

        return ratio * this.state.upperBound;
    }

    renderCursors(offsets) {
        let cursors = [];
        const l = this.state.value.length;
        const opts = {
            axis: this.state.axis,
            size: l,
            onDragEnd: this.handleDragEnd,
        };

        const className = `${this.props.className}__cursor`;

        if (this.props.cursor) {
            cursors = offsets.map((offset, i) => {
                const props = assign({}, opts, {
                    offset,
                    position: i + 1,
                    ref: `cursor_${(i + 1)}`,
                    key: `cursor_${(i + 1)}`,
                    className: `${className} ${className}_${(i + 1)}`,
                    value: this.state.value[i] ? this.state.value[i].value : null,
                    min: parseInt(this.props.min, 10),
                    max: parseInt(this.props.max, 10),
                    onDragStart: this.handleDragStart.bind(null, i + 1),
                });

                return (<Cursor {...props} />);
            });
        }

        if (this.state.header) {
            const props = assign({}, opts, {
                offset: this.calcOffset(this.state.min),
                position: 0,
                ref: 'header',
                key: 'header',
                className: `${className} ${className}_header`,
                value: this.state.min,
                min: parseInt(this.props.min, 10),
                max: parseInt(this.props.max, 10),
                onDragStart: this.handleDragStart.bind(null, 0),
            });

            cursors.splice(0, 0, (<Cursor {...props} />));
        }

        if (this.state.tailer) {
            const position = cursors.length;
            const props = assign({}, opts, {
                offset: this.calcOffset(this.state.max),
                position,
                ref: 'tailer',
                key: 'tailer',
                className: `${className} ${className}_tailer`,
                value: this.state.max,
                min: parseInt(this.props.min, 10),
                max: parseInt(this.props.max, 10),
                onDragStart: this.handleDragStart.bind(null, l + 1),
            });

            cursors.push((<Cursor {...props} />));
        }

        return cursors;
    }

    renderBar(from, to, i) {
        const style = {
            position: 'absolute',
            backgroundColor: this.state.value.length > 0 ? this.state.value[i].color : null,
            [this.state.minProp]: from,
            [this.state.maxProp]: this.state.upperBound - to,
        };

        const className = `${this.props.className}__bar`;
        const modClassName = `${className} ${className}_`;
        const barClassName = modClassName + i + (this.state.clicked === i ? ` ${className}_active` : '');

        // TODO: Update click handler
        return (
            <div
                key={`bar_${i}`}
                ref={`bar_${i}`}
                id={`bar_${i}`}
                className={barClassName}
                style={style}
                onClick={this.handleBarClick}>
            </div>
        );
    }

    renderBars(offsets) {
        const minOffset = this.calcOffset(this.state.min);
        const bars = offsets.map((offset, i) => this.renderBar(offsets[i - 1] || minOffset, offset, i));

        if (!bars.length) {
            bars.push(this.renderBar(minOffset, this.calcOffset(this.state.max), 0));
        }

        return bars;
    }

    render() {
        const offsets = this.state.value.map(this.calcOffset, this);
        const bars = this.props.withBars ? this.renderBars(offsets) : null;
        const cursors = this.renderCursors(offsets);
        const {className, modClassName} = this.props;
        const mod = modClassName ? ` ${className}_${modClassName}` : '';
        const rangeClassName = `${className} ${className}'_'${this.props.orientation}${mod}`;

        return (
            <div className={rangeClassName} ref="slider" style={{position: 'relative'}}>
                <div className={`${className}__bars`}>{bars}</div>
                {cursors}
            </div>
        );
    }
}

RangeSlider.propTypes = {
    /**
     * Min value for slider, default is 0.
     * Example:
     *
     * ```
     *  <RangeSlider min=0 />
     *
     * ```
     */
    min: PropTypes.number,
    /**
     * Max value for slider, default is 100.
     * Example:
     *
     * ```
     *  <RangeSlider max=999 />
     *
     * ```
     */
    max: PropTypes.number,
    /**
     * Define the value, can be string or array
     *
     * Example:
     *
     * ```
     *  <RangeSlider value=[10,20] />
     *  or
     *  <RangeSlider value=[{value:10, color: '#FFF'}] />
     *  or
     *  <RangeSlider value=['#FFF', '#FFS'] />
     * ```
     */
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.shape({
                value: PropTypes.number,
                color: PropTypes.string,
            })),
        ]),
    ]),
    /**
     * Orientation for slider, must be horizontal or vertical, default is horizontal.
     * Example:
     *
     * ```
     *  <RangeSlider orientation='vertical'/>
     *
     * ```
     */
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    /**
     * Options is slider show the bars or not, default false.
     */
    withBars: PropTypes.bool,
    /**
     * Options is slider show the cursors or not, default false.
     * You can also set up a custom cursor and implement like
     * ./Cursor.js
     */
    cursor: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.element,
    ]),
    /**
     * Options disable slider, default false.
     * If set diabled with true cursors in the slider will unable to drag.
     */
    disabled: PropTypes.bool,
    /**
     *
     * Range for slider, menas you can set header or tailer cursor or both, something like blow:
     *        -|-----------|-
     * Example:
     *
     * ```
     *  <RangeSlider range />
     *  or
     *  <RangeSlider range={[true, false]} />
     *  or
     *  <RangeSlider range={[10, 90]} />
     *
     * ```
     */
    range: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.arrayOf(PropTypes.bool),
        PropTypes.arrayOf(PropTypes.number),
    ]),
    /**
     * Disable slider header cursor.
     *
     * Example:
     * ```
     *  <RangeSlider range={[10]} disabledHeader />
     * ```
     */
    disabledHeader: PropTypes.bool,
    /**
     * Disable slider tailer cursor.
     *
     * Example:
     * ```
     *  <RangeSlider range={[null, 90]} disabledTailer />
     * ```
     */
    disabledTailer: PropTypes.bool,
    /**
     * Slider classname
     *
     * Example:
     * ```
     *  <RangeSlider className="custom-slider" />
     * ```
     */
    className: PropTypes.string,
    /**
     * Slider modifier classname
     *
     * Example:
     * ```
     *  <RangeSlider className="custom-slider" modClassName="rating" />
     * ```
     *
     * will transform to custom-slider_rating on element
     */
    modClassName: PropTypes.string,
    /**
     * Hook event for when mouse down for each cursor.
     *
     * Example:
     * ```
     *  <RangeSlider onMouseDown={somefunction} />
     * ```
     */
    onMouseDown: PropTypes.func,
    /**
     * Hook function before cursor dragging.
     */
    onBeforeChange: PropTypes.func,
    /**
     * Hook function when cursor dragging.
     */
    onChange: PropTypes.func,
    /**
     * Hook function after cursor dragging.
     */
    onAfterChange: PropTypes.func,
    /**
     * Click event for each bar.
     *
     * Example:
     * ```
     *   <RangeSlider onBarClick={somefunction(evt[, index, color])} />
     * ```
     * @param {Object} Event click event instance.
     * @param {Number} Index Index of the clicked bar.
     * @param {String} Color Clicked bar's background color.
     */
    onBarClick: PropTypes.func,
};

RangeSlider.defaultProps = {
    min: 0,
    max: 100,
    value: [],
    defaultValue: 0,
    orientation: 'horizontal',
    withBars: false,
    cursor: false,
    pearling: false,
    disabled: false,
    className: 'range-slider',
    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    onBarClick: noop,
    onMouseDown: noop,
};

module.exports = RangeSlider;
