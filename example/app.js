import React, { Component } from 'react';
import { render } from 'react-dom';
import RangeSlider from '../';

window.React = React;

class App extends Component {
    construtctor(props) {
        super(props);

        this.state = {};
    }

    afterChange() {
        console.log('after change called');
    }

    beforeChange() {
        console.log('before change called');
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>React Range Slider</h1>
                    <h4>A flexible Slider for reactjs</h4>
                </div>
                <div id="main">
                    <RangeSlider
                        onBeforeChange={this.beforeChange}
                        onAfterChange={this.afterChange}
                        value={['#42c6da','#3cb9ec','#42a5f5','#4a80df','#5c6bc0']}
                        range={[true]}
                        withBars
                        cursor
                    />
                </div>
            </div>
        );
    }
}

render(<App />, document.getElementById('react-range-example'));

