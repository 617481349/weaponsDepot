import Vue from 'vue';
import msgboxVue from './index.vue';
import merge from 'utils/merge.js';
import { isVNode } from 'utils/vdom.js';

const MessageBoxConstructor = Vue.extend(msgboxVue);

let currentMsg;
let instance;
// 通知队列
let msgQueue = [];

const defaultCallback = action => {
    if (currentMsg) {
        let callback = currentMsg.callback;
        if (typeof callback === 'function') {
            callback(action);
        }
        if (currentMsg.resolve) {
            if (action === 'confirm') {
                currentMsg.resolve(action);
            } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
                currentMsg.reject(action);
            }
        }
    }
};

const initInstance = () => {
    instance = new MessageBoxConstructor({
        el: document.createElement('div')
    });
  
    instance.callback = defaultCallback;
};

const showNextMsg = () => {
    if (!instance) {
        initInstance();
    }
    instance.action = '';
    if (!instance.visible) {
        if (msgQueue.length > 0) {
            currentMsg = msgQueue.shift();
            let options = currentMsg.options;
            for (let prop in options) {
                if (options.hasOwnProperty(prop)) {
                    instance[prop] = options[prop];
                }
            }
            if (typeof options.callback === 'undefined') {
                instance.callback = defaultCallback;
            }
  
            let oldCb = instance.callback;
            instance.callback = (action, instance) => {
                oldCb(action, instance);
                showNextMsg();
            };
            if (isVNode(instance.message)) {
                instance.$slots.default = [instance.message];
                instance.message = null;
            } else {
                delete instance.$slots.default;
            }
            // ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
            //     if (instance[prop] === undefined) {
            //         instance[prop] = true;
            //     }
            // });
            document.body.appendChild(instance.$el);
  
            Vue.nextTick(() => {
                instance.visible = true;
            });
        }
    }
};

const MessageBox = function(options, callback) {
    if (Vue.prototype.$isServer) return;
    if (options.callback && !callback) {
        callback = options.callback;
    }
    if (typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => { // eslint-disable-line
            msgQueue.push({
                options: merge({}, MessageBox.defaults, options),
                callback: callback,
                resolve: resolve,
                reject: reject
            });
  
            showNextMsg();
        });
    } else {
        msgQueue.push({
            options: merge({}, MessageBox.defaults, options),
            callback: callback
        });
  
        showNextMsg();
    }
};

MessageBox.confirm = (title, message, options) => {
    if (typeof title === 'object') {
        options = title;
        title = '';
    } else if (typeof title === 'undefined') {
        title = '';
    }
    return MessageBox(merge({
        title: title,
        message: message,
        $type: 'confirm',
        showCancelButton: true
    }, options));
};

MessageBox.alert = (title = '', message = '', options = {}) => {
    if (typeof title === 'object') {
        options = title;
        title = '';
    } else if (typeof title === 'string' && typeof message === 'number') {
        options.duration = message;
        message = '';
    }
    return MessageBox(merge({
        title: title,
        message: message,
        $type: 'alert',
    }, options));
};

MessageBox.defaults = {
    $type: '',
    title: '',
    message: '',
    duration: false,
    visible: false,
    showCancelButton: false,
    showConfirmButton: true,
    showClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    contentStyle: [{ 'text-align': 'center' }]
};
MessageBox.setDefaults = defaults => {
    MessageBox.defaults = defaults;
};

export default MessageBox;
export { MessageBox };