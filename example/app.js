/* eslint-disable */
var React = require('react');
var ReactDOM = require('react-dom');
var RangeSlider = require('../lib');

window.React = React;

var App = React.createClass({
    getInitialState() {
        return {};
    },

    afterChange() {
        console.log('after change called');
    },

    beforeChange() {
        console.log('before change called');
    },

    render() {
        return (
            <div>
                <div className="header">
                    <h1>React Range Slider BEM</h1>
                    <h4>A flexible Slider for reactjs</h4>
                </div>
                <div id="main">
                    <RangeSlider
                        onBeforeChange={this.beforeChange}
                        onAfterChange={this.afterChange}
                        value={['#42c6da', '#3cb9ec', '#42a5f5', '#4a80df', '#5c6bc0']}
                        range={[true]}
                        withBars
                        cursor
                    />
                </div>
            </div>
        );
    },
});

ReactDOM.render(<App />, document.getElementById('react-range-example'));

