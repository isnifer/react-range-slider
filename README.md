# React Range Slider BEM

*A flexible slider for reactjs*

###### [Demo](http://isnifer.github.io/react-range-slider-bem)

## Getting Started

Install via [npm](http://npmjs.org/react-range-slider-bem)

```sh
npm i react-range-slider-bem -S
```

## Usage

```js
import RangeSlider from 'react-range-slider-bem';

// ...
render() {
    return (
        <RangeSlider value={[20]} withBars />
    );
}
```

## Options

#### min
Type: `Number`  
Default: `0`  
Description: Min value for slider, default is 0.  

```js
// ...
render() {
    return (
        <RangeSlider min={0} />
    );
}
```

#### max
Type: `Number`  
Default: `100`  
Description: Max value for slider, default is 100.

```js
// ...
render() {
    return (
        <RangeSlider max={999} />
    );
}
```

#### value
Type: 
```js
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
])
```
Default: `[]`  
Description: Define the value, can be string or array

```js
// ...
render() {
    return (
        <div>
            <RangeSlider value=[10,20] />
            or
            <RangeSlider value=[{value:10, color: '#FFF'}] />
            or
            <RangeSlider value=['#FFF', '#FFS'] />
        </div>
    );
}
```

#### orientation
Type: `PropTypes.oneOf(['horizontal', 'vertical'])`  
Default: `horizontal`  
Description: Orientation for slider, must be horizontal or vertical, default is horizontal.

```js
// ...
render() {
    return (
        <RangeSlider orientation="vertical" />
    );
}
```

#### withBars
Type: `Boolean`  
Default: `false`  
Description: Options is slider show the bars or not, default false.

#### cursor
Type: `Boolean`  
Default: `false`  
Description: Options is slider show the cursors or not, default false. You can also set up a custom cursor and implement like ./Cursor.js

#### disabled
Type: `Boolean`  
Default: `false`  
Description: Options disable slider, default false. If set diabled with true cursors in the slider will unable to drag.

#### range
Type:
```js
range: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.bool),
    PropTypes.arrayOf(PropTypes.number),
])
```
Description: Range for slider, menas you can set header or tailer cursor or both, something like blow: -|-----------|-

```js
// ...
render() {
    return (
        <div>
            <RangeSlider range />
            or
            <RangeSlider range={[true, false]} />
            or
            <RangeSlider range={[10, 90]} />
        </div>
    );
}
```

#### disabledHeader
Type: `Boolean`  
Description: Disable slider header cursor.

```js
// ...
render() {
    return (
        <RangeSlider range={[10]} disabledHeader />
    );
}
```

#### disabledTailer
Type: `Boolean`  
Description: Disable slider tailer cursor.

```js
// ...
render() {
    return (
        <RangeSlider range={[null, 90]} disabledTailer />
    );
}
```
#### className
Type: `String`  
Default: `range-slider`  
Description: Slider classname

```js
// ...
render() {
    return (
        <RangeSlider className="custom-slider" />
    );
}
```

#### modClassName
Type: `String`  
Description: Slider modifier classname

```js
// ...
render() {
    return (
        <RangeSlider className="custom-slider" modClassName="rating" />
    );
}
```
> It will transform to `custom-slider_rating` on root element

#### onMouseDown
Type: `Function`  
Default: `function noop() {}`  
Description: Hook event for when mouse down for each cursor.

```js
// ...
render() {
    return (
        <RangeSlider onMouseDown={somefunction} />
    );
}
```

#### onBeforeChange
Type: `Function`  
Default: `function noop() {}`  
Description: Hook function before cursor dragging

#### onChange
Type: `Function`  
Default: `function noop() {}`  
Description: Hook function when cursor dragging

#### onAfterChange
Type: `Function`  
Default: `function noop() {}`  
Description: Hook function after cursor dragging

#### onBarClick
Type: `Function`  
Default: `function noop() {}`  
Description: Click event for each bar

```js
/**
 * @param {Object} Event click event instance.
 * @param {Number} Index Index of the clicked bar.
 * @param {String} Color Clicked bar's background color.
 */
```

```js
// ...
render() {
    return (
        <RangeSlider onBarClick={somefunction(evt[, index, color])} />
    );
}
```

## License
MIT © [Anton Kuznetsov](http://github.com/isnifer)
