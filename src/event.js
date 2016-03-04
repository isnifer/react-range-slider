// @credits: https://github.com/mzabriskie/react-draggable/blob/master/lib/draggable.js#L51-L120

const event = {};

/* Conditional to fix node server side rendering of component */
const isTouchDevice = () => {
    let flag = false;

    // Check if is Browser
    if (typeof window !== 'undefined') {
        flag = 'ontouchstart' in window // works on most browsers
        || 'onmsgesturechange' in window; // works on ie10 on ms surface
    }

    return flag;
};

event.isTouchDevice = isTouchDevice;

/**
 * simple abstraction for dragging events names
 * */
event.dragEventFor = (() => {
    const eventsFor = {
        touch: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend',
        },
        mouse: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup',
        },
    };

    return eventsFor[isTouchDevice() ? 'touch' : 'mouse'];
})();

event.addEvent = (el, evt, handler) => {
    if (!el) {
        return;
    }

    if (el.attachEvent) {
        el.attachEvent(`on${evt}`, handler);
    } else if (el.addEventListener) {
        el.addEventListener(evt, handler, true);
    } else {
        /* eslint-disable no-param-reassign */
        el[`on${evt}`] = handler;
    }
};

event.removeEvent = (el, evt, handler) => {
    if (!el) {
        return;
    }

    if (el.detachEvent) {
        el.detachEvent(`on${evt}`, handler);
    } else if (el.removeEventListener) {
        el.removeEventListener(evt, handler, true);
    } else {
        /* eslint-disable no-param-reassign */
        el[`on${evt}`] = null;
    }
};

module.exports = event;
