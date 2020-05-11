/* eslint-disable no-undef */
/* eslint-disable eol-last */
/* eslint-disable array-callback-return */
/* eslint-disable func-names */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable eqeqeq */
/* eslint-disable vue/script-indent */
/* eslint-disable vars-on-top */
/* eslint-disable no-use-before-define */
/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
/* eslint-disable no-tabs */
/**
 // eslint-disable-next-line no-tabs
 *	钉钉 ajax <JS>
 *	@author:	joshua<joshua_chen@qq.com>
 *	@date:		2019-07-17
 */


import {
    getHeader,
    getAuthHeader
} from './Util.js';


import CompUtil from './Component.js';


function ddRequest(method = 'GET', url, data, complete, headers) {
    const global = window.$$global;
    let root = (window && window.$$miniprogram && window.$$miniprogram.window) || wx;

    if (url.indexOf(app.serviceBaseUrl) < 0) {
        if (url.substring(0, 1) != '/') {
            url = `/${url}`;
        }
        url = SERVICE_URL + url;
    }

    const defaultHeader = Auth.getAuthHeader(method);
    const _method = method.toUpperCase();
    switch (_method) {
        case 'GET': {
            defaultHeader['Content-Type'] = 'text/json;charset=UTF-8';
            break;
        }
        case 'POST': {
            defaultHeader['Content-Type'] = 'application/json;charset=UTF-8'; // application/x-www-form-urlencoded
            data = JSON.stringify(data);
            break;
        }
    }

    const _headers = Object.assign(defaultHeader, (headers || {}));

    console.log('%c%s%c%s',
        'color: #46a64d; font-size: 14px;', '[ajax.request.url]===>',
        'font-size: 14px;color: #ff6c00;', url);
    console.log('%c%s%c%s',
        'color: #46a64d; font-size: 14px;', '[ajax.request.headers]===>',
        'font-size: 14px;', JSON.stringify(_headers));
    console.log('%c%s%c%s',
        'color: #46a64d; font-size: 14px;', '[ajax.request.params]===>',
        'font-size: 14px;color: #ff6c00;', JSON.stringify(data));

    var promise = new Promise((resolve, reject) => {
        wx.request({
            url,
            method,
            data,
            dataType: 'json',
            header: _headers,
            success(res) {
                console.log('%c%s%c%s', 'color: #1B8DEE; background: yellow; font-size: 14px;', '[ajax.response.data]===>', 'font-size: 14px; color:#bc00fb;', JSON.stringify(res.data));


                resolve(res.data);
                promise.success = true;

                setTimeout(() => {
                    const pageUrl = CompUtil.getCurrPageUrl();
                    const cachedRequests = root.ajax.requests;
                    const pageRequests = cachedRequests.filter(x => x.pageUrl == pageUrl);
                    const completeRequests = pageRequests.filter(x => x.completed == true);

                    if (completeRequests.length == pageRequests.length) { // 当前页面的所有请求都完成
                        wx.x.hideLoading();
                    }
                }, 50);
            },
            fail(res) {
                promise.success = false;
                wx.x.hideLoading();
                console.log('%c%s%c%s', 'color: red; background: yellow; font-size: 14px;', '[ajax.response.fail]===>', 'color: red;font-size: 14px;', JSON.stringify(res));
                reject(res);
            },
            complete(res) {
                promise.completed = true;
                if (complete && typeof complete === 'function') {
                    complete(res);
                }
            }
        });
    });

    return promise;
}




export function get(opts) {
    let options = {};
    const arg0 = arguments[0];
    const arg1 = arguments[1];
    const arg2 = arguments[2];
    if (typeof arg0 === 'string') {
        options.url = arg0;
        if (typeof arg1 === 'object') {
            options.data = arg1;
        }

        if (typeof arg2 === 'function') {
            options.success = arg2;
        }
    } else if (typeof arg0 === 'object') {
        options = arg0;
    }


    const settings = {
        method: 'GET'
    };
    Object.assign(settings, options);
    const req = ajax(settings);

    return req;
}

/**
 *
 * @param {*} options
 * @example
 *  
 */
export function post(opts) {
    var options = {};
    const arg0 = arguments[0];
    const arg1 = arguments[1];
    const arg2 = arguments[2];
    if (typeof arg0 === 'string') {
        options.url = arg0;
        if (typeof arg1 === 'object') {
            options.data = arg1;
        }

        if (typeof arg2 === 'function') {
            options.success = arg2;
        }
    } else if (typeof arg0 === 'object') {
        options = arg0;
    }

    const settings = {
        method: 'POST'
    };
    Object.assign(settings, options);
    const req = ajax(settings);

    return req;
}

export const ajax = (options) => {
    const settings = {
        url: '',
        data: {},
    };
    Object.assign(settings, options);
    const method = settings.method || settings.type;
    const req = ddRequest(
        method,
        settings.url,
        settings.data,
        settings.complete,
        settings.headers
    );

    if ((settings.success && typeof settings.success === 'function') ||
        (settings.fail && typeof settings.fail === 'function')) {
        req.then((ok) => {
            typeof settings.success === 'function' && settings.success(ok);
        }, (fa) => {
            typeof settings.fail === 'function' && settings.fail(fa);
            wx.showToast({
                type: 'exception',
                content: '网络异常，请稍后重试'
            });
        });
    }

    req.catch((ex) => {
        console.log('%c%s%c%s', 'color: red; background: yellow; font-size: 14px;', '[ajax.response.error]===>', 'color: red;font-size: 14px;', JSON.stringify(ex));
        wx.hideLoading();
    });

    req.options = settings;
    const pageUrl = CompUtil.getCurrPageUrl();
    clearCacheRequest(pageUrl);
    setCacheRequest(pageUrl, req);

    return req;
};

ajax.get = get;
ajax.post = post;
ajax.clearRequests = function () {
    if (wx.ajax && wx.ajax.requests) {
        wx.ajax.requests.length = 0;
    }
};

export const clearCacheRequest = (pageUrl) => {
    if (!wx.ajax.requests || !wx.ajax.requests.length) return;

    pageUrl = pageUrl || CompUtil.getCurrPageUrl();

    const cachedRequests = wx.ajax.requests;
    cachedRequests.map((x, index) => {
        if (x.pageUrl != pageUrl) {
            cachedRequests.splice(index, 1);
        }
    });
};

export const setCacheRequest = (pageUrl, req) => {
    if (!wx.ajax.requests) {
        wx.ajax.requests = [];
    }

    pageUrl = pageUrl || CompUtil.getCurrPageUrl();

    const cachedRequests = wx.ajax.requests;

    const index = cachedRequests.findIndex((x) => {
        const isEqReq = x.request.options.url == req.options.url;
        return x.pageUrl == pageUrl && isEqReq;
    });
    if (index >= 0) {
        cachedRequests[index].request = req;
        cachedRequests[index].requestUrl = req.options.url;
    } else {
        cachedRequests.push({
            pageUrl,
            request: req,
            requestUrl: req.options.url,
        });
    }
};


export default {
    get,
    post,
    ajax,
    clearCacheRequest,
};