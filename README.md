# React Range Slider BEM

> A flexible slider for reactjs

[Live Demo](http://isnifer.github.io/react-range-slider-bem)

## Getting Started

Install via [npm](http://npmjs.org/react-range-slider-bem)

```bash
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
> Min value for slider, default is 0.

```js
// ...
render() {
    return (
        <RangeSlider min={0} />
    );
}
```

#### max
> Max value for slider, default is 100.

```jsx
// ...
render() {
    return (
        <RangeSlider max={999} />
    );
}
```

#### value
> Define the value, can be string or array

```jsx
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
> Orientation for slider, must be horizontal or vertical, default is horizontal.

```jsx
// ...
render() {
    return (
        <RangeSlider orientation="vertical" />
    );
}
```

#### withBars
> Options is slider show the bars or not, default false.

#### cursor
> Options is slider show the cursors or not, default false.
> You can also set up a custom cursor and implement like ./Cursor.js

#### disabled
> Options disable slider, default false.
> If set diabled with true cursors in the slider will unable to drag.

#### range
> Range for slider, menas you can set header or tailer cursor or both, something like blow:
> -|-----------|-

```jsx
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
> Disable slider header cursor.

```jsx
// ...
render() {
    return (
        <RangeSlider range={[10]} disabledHeader />
    );
}
```

#### disabledTailer
> Disable slider tailer cursor.

```jsx
// ...
render() {
    return (
        <RangeSlider range={[null, 90]} disabledTailer />
    );
}
```
#### className
> Slider classname

```jsx
// ...
render() {
    return (
        <RangeSlider className="custom-slider" />
    );
}
```

#### modClassName
> Slider modifier classname

```jsx
// ...
render() {
    return (
        <RangeSlider className="custom-slider" modClassName="rating" />
    );
}
```
> It will transform to `custom-slider_rating` on root element

#### onMouseDown
> Hook event for when mouse down for each cursor.

```jsx
// ...
render() {
    return (
        <RangeSlider onMouseDown={somefunction} />
    );
}
```

#### onBeforeChange
> Hook function before cursor dragging

#### onChange
> Hook function when cursor dragging

#### onAfterChange
> Hook function after cursor dragging

#### onBarClick
> Click event for each bar

```jsx
// ...
render() {
    return (
        <RangeSlider onBarClick={somefunction(evt[, index, color])} />
    );
}
```
```js
/**
 * @param {Object} Event click event instance.
 * @param {Number} Index Index of the clicked bar.
 * @param {String} Color Clicked bar's background color.
 */
```

## License
MIT © [Anton Kuznetsov](http://github.com/isnifer)
