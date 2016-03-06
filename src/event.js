const addEvent = (el, evt, handler) => {
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

const removeEvent = (el, evt, handler) => {
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

module.exports = {addEvent, removeEvent};
