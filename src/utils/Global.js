/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-tabs */


import Ajax from './Ajax';
import Util from './Util';

/*
	wx 全局扩展：
		扩展dd相关方法和对象
*/
const WX = {

    ajax: Ajax.ajax,

    showLoading: (msg) => {
        wx.hideLoading();
        wx.showLoading({
            content: msg || '加载中...'
        });
    },
    prompt: (options) => {
        const settings = {
            title: '',
            message: '',
            placeholder: '',
            okButtonText: '确定',
            cancelButtonText: '取消',
            success: (result) => {},
        };

        Object.assign(settings, options);
        wx.prompt(settings);
    },
    successToast: (msg, timeoutCallback, beforeCallback) => {
        const arg1 = arguments.length > 0 ? arguments[0] : null;
        const arg2 = arguments.length > 1 ? arguments[1] : null;
        const arg3 = arguments.length > 2 ? arguments[2] : null;

        if (typeof arg1 === 'string') {
            msg = arg1 || '操作成功';
        } else if (typeof arg1 === 'function') {
            timeoutCallback = arg1;
            if (typeof arg2 === 'function') {
                beforeCallback = arg2;
            }
        }

        WX.showToast({
            content: msg,
            type: 'success',
            success() {
                typeof beforeCallback === 'function' && beforeCallback();
            }
        }, timeoutCallback);
    },
    failToast: (msg, timeoutCallback) => {
        const arg1 = arguments.length > 0 ? arguments[0] : null;
        const arg2 = arguments.length > 1 ? arguments[1] : null;

        if (typeof arg1 === 'string') {
            msg = arg1 || '操作失败';
        } else if (typeof arg1 === 'function') {
            timeoutCallback = arg1;
        }
        WX.showToast({
            content: msg,
            type: 'fail'
        }, timeoutCallback);
    },
    showToast: (opts, timeoutCallback) => {
        // wx.hideLoading();
        const defaults = {
            type: 'none',
            content: '',
            duration: 3000,

        };
        const options = Object.assign({}, defaults);

        setTimeout(function () {
            let callbackTimeout = 0;
            // const platform = Auth.getGlobalData().lastDevice.platform;

            // console.log('platform', platform);


            const success = function () {};
            if (typeof opts === 'string') {
                // if (platform && platform.toUpperCase() == 'IOS') {
                //     callbackTimeout = options.duration;
                // }
                options.content = opts;
                console.log('callbackTimeout', callbackTimeout);
                options.success = function () {
                    if (callbackTimeout <= 0) {
                        typeof timeoutCallback === 'function' && timeoutCallback();
                        return;
                    }
                    setTimeout(() => {
                        typeof timeoutCallback === 'function' && timeoutCallback();
                    }, callbackTimeout);
                };
                wx.showToast(options);
            } else if (typeof opts === 'object') {
                // eslint-disable-next-line no-underscore-dangle
                let _success = function () {};
                if (typeof opts.success === 'function') {
                    _success = opts.success.bind(this);
                }

                Object.assign(options, opts);
                //  if (platform && platform.toUpperCase() == 'IOS') {
                //  callbackTimeout = options.duration;
                // }
                console.log('options', options);
                options.success = function () {
                    _success();
                    if (callbackTimeout <= 0) {
                        typeof timeoutCallback === 'function' && timeoutCallback();
                        return;
                    }
                    setTimeout(() => {
                        typeof timeoutCallback === 'function' && timeoutCallback();
                    }, callbackTimeout);
                };

                wx.showToast(options);
            }
        }, 1);
    },
    alert: (opts, successCallback) => {
        const defaults = {
            title: '',
            content: '',
            buttonText: '确定',
            success: () => {
                typeof successCallback === 'function' && successCallback();
            }
        };
        const options = Object.assign({}, defaults);
        if (typeof opts === 'string') {
            options.content = opts;
        } else if (typeof opts === 'object') {
            let _success = function () {};
            if (typeof opts.success === 'function') {
                _success = opts.success.bind(this);
            }
            Object.assign(options, opts);
            options.success = function success() {
                _success();
                typeof successCallback === 'function' && successCallback();
            };
        }
        wx.alert(options);
    },
    showNoneToast: (msg, arg2) => {
        wx.hideLoading();
        const duration = typeof arg2 === 'number' ? arg2 : 2000;
        const timeoutCallback = typeof arg2 === 'function' ? arg2 : null;
        wx.showToast({
            content: msg,
            duration
        });
        if (timeoutCallback) {
            setTimeout(() => {
                timeoutCallback();
            }, duration);
        }
    },

    showNoneToastTimeout: (msg, duration) => {
        wx.hideLoading();
        duration = duration || 2000;
        setTimeout(() => {
            wx.showToast({
                content: msg,
                duration
            });
        }, duration);
    },
    hideLoading: (withToast, duration) => {
        if (withToast) {
            setTimeout(() => {
                wx.hideLoading();
            }, duration || 2000);
        } else {
            wx.hideLoading();
        }
    },

};

const extensionsDD = () => {
    !wx && (wx = {});
    wx.x = wx.x || {};
    Util.extend(true, wx.x, WX);
    wx.ajax = Ajax.ajax;
    wx.ajax.requests = [];
};
export default {
    extensionsDD,
};