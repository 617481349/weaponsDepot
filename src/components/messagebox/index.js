import Vue from 'vue';
import msgboxVue from './index.vue';

const MessageBox = function(options, callback) {
    if (Vue.prototype.$isServer) return;
    if (typeof options === 'string' || isVNode(options)) {
        options = {
            message: options
        };
        if (typeof arguments[1] === 'string') {
            options.title = arguments[1];
        }
    } else if (options.callback && !callback) {
        callback = options.callback;
    }
  
    if (typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => { // eslint-disable-line
            msgQueue.push({
                options: merge({}, defaults, MessageBox.defaults, options),
                callback: callback,
                resolve: resolve,
                reject: reject
            });
  
            showNextMsg();
        });
    } else {
        msgQueue.push({
            options: merge({}, defaults, MessageBox.defaults, options),
            callback: callback
        });
  
        showNextMsg();
    }
};