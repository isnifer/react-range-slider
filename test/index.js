import './utils/jsdom';
import React from 'react';
import { render } from 'enzyme';
import { spy } from 'sinon';
import test from 'tape';
import RangeSlider from '../src';

test('Init', t => {
    const value = ['#42c6da', '#3cb9ec', '#42a5f5', '#4a80df', '#5c6bc0'];
    const wrapper = render(
        <RangeSlider
            value={value}
            className="hello"
            withBars
            cursor
        />
    );

    const slider = wrapper[0].children[0];
    const bars = slider.children[0];
    const barsItems = bars.children;
    const cursors = slider.children.slice(1);

    t.equal(slider.attribs.class, 'hello hello_horizontal', `RangeSlider className is "${slider.attribs.class}"`);
    t.equal(bars.attribs.class, 'hello__bars', `Slider bars className is "${bars.attribs.class}"`);
    t.equal(barsItems.length, value.length, `There are ${value.length} bars`);
    barsItems.forEach((bar, index) => {
        t.equal(
            bar.attribs.class,
            `hello__bar hello__bar_${index}`,
            `Current bar className is "${bar.attribs.class}"`
        );
    });

    t.equal(cursors.length, value.length, `There are ${value.length} cursors`);
    cursors.forEach((cursor, index) => {
        t.equal(
            cursor.attribs.class,
            `hello__cursor hello__cursor_${index + 1}`,
            `Current cursor className is "${cursor.attribs.class}"`
        );
        t.equal(
            parseInt(cursor.attribs.value, 10),
            (index + 1) * 20,
            `Current cursor value is "${cursor.attribs.value}"`
        );
    });

    // console.log('SLIDER', slider);
    // console.log('BARS', bars);
    // console.log('BARS_ITEMS', barsItems);
    // console.log('CURSORS', cursors);

    t.end();
});
