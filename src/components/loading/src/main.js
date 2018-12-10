import Vue from 'vue';
import loading from './index.vue';
import merge from 'utils/merge.js';

const LoadingConstructor = Vue.extend(loading);

let instance;
let options = {};
let queue = 0;

const initInstance = () => {
    instance = new LoadingConstructor({
        el: document.createElement('div')
    });
};

const showNextMsg = () => {
    if (!instance) {
        initInstance();
    }
    if (!instance.visible) {
        for (let prop in options) {
            if (options.hasOwnProperty(prop)) {
                instance[prop] = options[prop];
            }
        }

        document.body.appendChild(instance.$el);

        Vue.nextTick(() => {
            queue++;
            instance.visible = true;
        });
    }
};

const Loading = function(_options) {
    if (Vue.prototype.$isServer) return;
    options = merge({}, Loading.defaults, _options);
    showNextMsg();
};
Loading.open = function(tips) {
    if (!instance || !instance.visible) {
        options = { tips };
        return Loading();
    } else {
        queue++;
    }
};
Loading.close = function() {
    if (instance && queue > 0) {
        queue--;
        if (queue <= 0) {
            instance.visible = false;
            options = {};
        }
    }
};


Loading.defaults = {
    tips: ''
};
Loading.setDefaults = defaults => {
    Loading.defaults = defaults;
};

export default Loading;
export { Loading };
