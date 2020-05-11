/* eslint-disable no-mixed-operators */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable no-multi-assign */
/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
/* eslint-disable vue/script-indent */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-tabs */


/**
 *	工具<JS>
 *	@author:	joshua<joshua_chen@qq.com>
 *	@date:		2019-07-17
 */
// import cloneDeep from 'lodash/cloneDeep'
// import find from 'lodash/find'
import {
    method
} from './Validator';


const $ = (function () {
    var copyIsArray,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Object]': 'object'
        },

        type = function (obj) {
            return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
        },

        isWindow = function (obj) {
            return obj && typeof obj === 'object' && 'setInterval' in obj;
        },

        isArray = Array.isArray || function (obj) {
            return type(obj) === 'array';
        },

        isPlainObject = function (obj) {
            if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
                return false;
            }

            if (obj.constructor && !hasOwn.call(obj, 'constructor') &&
                !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }

            let key;
            for (key in obj) {}

            return key === undefined || hasOwn.call(obj, key);
        },

        _extend = function (deep, target, options) {
            for (const name in options) {
                let src = target[name],
                    clone = null;
                const copy = options[name];

                if (target === copy) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                // eslint-disable-next-line no-cond-assign
                if (deep && copy &&
                    (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    // eslint-disable-next-line no-param-reassign
                    target[name] = _extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    // eslint-disable-next-line no-param-reassign
                    target[name] = copy;
                }
            }

            return target;
        };

    return {
        extend: _extend
    };
}());


const getTimeInterval = (d1, d2) => {
    // r date1 = '2015/05/01 00:00:00';  //开始时间
    const date1 = d1;
    const date2 = new Date(d2); // 结束时间
    const date3 = date2.getTime() - new Date(date1).getTime(); // 时间差的毫秒数

    // ------------------------------

    // 计算出相差天数
    const days = Math.floor(date3 / (24 * 3600 * 1000));

    // 计算出小时数

    const leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    const leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));
    // 计算相差秒数
    const leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    return {
        days,
        hours,
        minutes,
        seconds,
    };
    // alert(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
};


const clearObjProps = (obj, nullVal) => {
    const val = typeof nullVal === 'undefined' ? null : nullVal;
    for (const k in obj) {
        // console.log( obj[k])
        if (typeof obj[k] !== 'function') {
            obj[k] = val;
        }
    }
    return obj;
};
const isObj = val => Object.prototype.toString.call(val) === '[object Object]';

const hasProp = (val) => {
    if (!isObj(val)) {
        return false;
    }

    for (const key in val) {
        return true;
    }
    return false;
};

export const stringFormat = function (str) {
    const values = Object.assign([], arguments);
    values.splice(0, 1);
    if (Array.isArray(values[0])) {
        let value = '';
        for (const i in values[0]) {
            str = str.toString().replace(/\{(\d+)\}/g, (match, index) => {
                if (values[0].length > index) {
                    value = values[0][index];
                }
                return value;
            });
        }
        return str;
    }
    // let str = values[0];
    return str.toString().replace(/\{(\d+)\}/g, (match, index) => {
        let value = '';
        if (Array.isArray(values[index])) {
            value = values[index][0];
        }
        if (values.length > index) {
            value = values[index];
        }
        return value;
    });
};

// 获取命名空间形式的对象值
// @param {* src *} 源对象
// @param {* namespacePath *} 命名空间路径
export const getNsObject = (src, namespacePath) => {
    namespacePath = namespacePath.replace(/\[|\]./g, '.');
    const segments = namespacePath.split('.');
    let obj = src;
    for (const i in segments) {
        const seg = segments[i];
        if (typeof obj[seg] === 'undefined' || obj[seg] == null) {
            return null;
        }
        obj = obj[seg];
    }
    return obj;
};

export const namespace = (name, root, leafVal) => {
    name = name.trim();
    name = name.replace(/\//g, '.');
    const parts = name.split('.');
    let current = root;
    if (!root) {
        current = (window && window.$$miniprogram && window.$$miniprogram.window) || wx;
    }

    let nspath = '';
    for (const i in parts) {
        if (parts[i]) {
            if (i == 0) {
                nspath += parts[i];
            } else {
                nspath += `.${parts[i]}`;
            }

            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }

            if (i == parts.length - 1 && typeof leafVal === 'function') {
                current[parts[i]] = leafVal;
            }

            current = current[parts[i]];
            current.nspath = nspath;
        }
    }


    return current;
};

export const getParamsKey = type => (!type || type === 'get' || type === 'GET' ? 'params' : 'data');

export const getHeader = type => (!type || type === 'get' || type === 'GET' ? {
    'Content-Type': 'text/json'
} : {
    'Content-Type': 'application/json' // 'application/x-www-form-urlencoded'
});

export function getUUID(len, radix) {
    if (len && radix) {
        return _uuid(len, radix);
    }

    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');
    return uuid;
}

/*
		指定长度和基数
*/
function _uuid(len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}


// 创建查询url
export const createQueryUrl = (url, params) => {
    if (!params) {
        return url;
    }

    let i = 0;
    for (const key in params) {
        i++;
        break;
    }
    if (i == 0) {
        return url;
    }

    if (url) {
        if (url.lastIndexOf('?') < 0) {
            url += '?';
        }
    }

    const urlParams = createUrlParams(params);

    return url + urlParams;
};

export function createUrlParams(params) {
    let urlParams = '';
    let i = 0;
    for (const key in params) {
        if (typeof params[key] !== 'string' && typeof params[key] !== 'number') {
            continue;
        }
        if (i > 0) {
            urlParams += '&';
        }
        urlParams += `${key}=${params[key] || ''}`;
        i++;
    }
    return urlParams;
}

export const getUrlParams = (url) => {
    let hash = window.location.hash,
        _url = url;

    if (!_url) {
        _url = window.location.href;
    }

    const index = _url.indexOf('#');
    if (index >= 0) {
        hash = _url.slice(index, _url.length);
    }

    if (hash) {
        const beginIndex = _url.indexOf(hash);
        const endIndex = beginIndex + hash.length;
        hash = `&${hash}`;
        _url = _url.slice(0, beginIndex) + hash + _url.slice(endIndex, _url.length);
        // console.log('_url', _url)
    }

    const search = _url.substring(_url.indexOf('?') + 1);

    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;

        return rs;
    });

    return obj;
};


// 获取url参数
export const getQueryString = (name, query) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    if (query && query.indexOf('?') > 0) {
        query = query.split('?')[1];
    }
    if (query) {
        query = `?${query}`;
    }
    const search = query || window.location.search;
    const r = search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};


export const dateFormat = (date, fmt) => {
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
        }
    }
    return fmt;
};

export const setCookie = (name, value, seconds) => {
    seconds = seconds || 0; // seconds有值就直接赋值，没有为0，这个根php不一样。
    let expires = '';
    if (seconds != 0) { // 设置cookie生存时间
        const date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = `; expires=${date.toGMTString()}`;
    }
    document.cookie = `${name}=${escape(value)}${expires}; path=/`; // 转码并赋值
};

export const getCookie = (name) => {
    name = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
};
export const getType = obj => Object.prototype.toString.call(obj).split(' ')[1].slice(0, -1);

export const getFileExt = filename => (filename && !!~filename.indexOf('.') ? filename.split('.').pop().toLowerCase() : '');

export const getDomain = () => {
    let host = location.host;
    host = host.split(':')[0];
    if (host.match(/[0-9\\.]+$/)) {} else {
        const tmps = host.split('.');
        while (tmps.length > 2) {
            tmps.shift();
        }
        host = tmps.join('.');
    }
    return host;
};


export const strSplit = (str, symbol) => {
    const index = str && symbol ? str.indexOf(symbol) : -1;
    return ~index ? str.split(symbol) : [];
};


const SWIPE_DIRECTION = {
    Upper: -2, // 上滑
    Lower: 2, // 下滑
    Left: 1, // 左滑
    Right: -1, // 右滑
    None: 0,
};

const SWIPE_DIRECTION_TEXT = {
    '-2': '上滑', // 上滑
    2: '下滑', // 下滑
    1: '左滑', // 左滑
    '-1': '右滑', // 右滑
    0: '',
};


//
// 滑动工具类
//	在 touch事件中使用
// by joshua at 2020-01-16
//
class Swiper {
    constructor() {
        this.DIRECTION = SWIPE_DIRECTION; // 常量:滑动方向
        this.DIRECTION_TEXT = SWIPE_DIRECTION_TEXT; // 常量:滑动方向文本
        this.direction = SWIPE_DIRECTION.None; // 滑动方向：上下左右，默认none
        this.distance = 0; // 滑动距离
        this.angle = null; // 滑动角度
        this.touchObject = null; // 触摸操作对象
    }

    // 开始
    // touchStart事件调用
    start(e) {
        this.touchObject = {
            startX: e.touches[0].pageX,
            startY: e.touches[0].pageY
        };
    }

    // 滑动中..
    // touchMove事件调用
    move(e) {
        const touchePoint = e.touches[0];

        this.touching(touchePoint);
    }
    // 滑动结束
    // touchEnd事件调用
    end(e) {
        const touchePoint = e.changedTouches[0];
        this.touching(touchePoint);
    }

    touching(touchePoint) {
        if (!touchePoint) return;

        const touchObject = this.touchObject;

        this.setDirection(touchePoint);

        const distance = this.getDistance(); //
        touchObject.distance = distance;

        this.distance = distance;

        return {
            direction: touchObject.direction,
            distance: touchObject.distance,
            angle: touchObject.angle,
        };
    }

    setDirection(touchePoint) {
        const touchObject = this.touchObject;
        touchObject.endX = touchePoint.pageX;
        touchObject.endY = touchePoint.pageY;
        let direction = SWIPE_DIRECTION.None;
        const xDist = touchObject.startX - touchePoint.pageX || 0;
        const yDist = touchObject.startY - touchePoint.pageY || 0;
        const r = Math.atan2(yDist, xDist);
        let swipeAngle = Math.round(r * 180 / Math.PI); // 滑动角度

        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
            direction = SWIPE_DIRECTION.Left;
        }

        if (swipeAngle <= 360 && swipeAngle >= 315) {
            direction = SWIPE_DIRECTION.Left;
        }

        if (swipeAngle >= 135 && swipeAngle <= 225) {
            direction = SWIPE_DIRECTION.Right;
        }

        if (swipeAngle > 45 && swipeAngle <= 135) {
            direction = SWIPE_DIRECTION.Upper;
        }

        if (swipeAngle < 315 && swipeAngle > 225) {
            direction = SWIPE_DIRECTION.Lower;
        }

        touchObject.direction = direction;
        touchObject.angle = swipeAngle;
        this.angle = swipeAngle;
        this.direction = direction;
        console.log('swipeAngle', swipeAngle);
        console.log('direction', SWIPE_DIRECTION_TEXT[direction]);
    }
    // 获取滑动距离
    getDistance() {
        let touchObject = this.touchObject,
            distance = 0;
        if (touchObject.direction == SWIPE_DIRECTION.Upper || touchObject.direction == SWIPE_DIRECTION.Lower) {
            distance = touchObject.endY - touchObject.startY; //
        } else if (touchObject.direction == SWIPE_DIRECTION.Left || touchObject.direction == SWIPE_DIRECTION.Right) {
            distance = touchObject.endX - touchObject.startX;
        }
        return distance;
    }
}

export default {
    getUUID,
    getQueryString,
    namespace,
    getUrlParams,
    createQueryUrl,
    dateFormat,
    stringFormat,
    getNsObject,
    clearObjProps,
    isObj,
    isPlainObject: $.isPlainObject,
    isArray: $.isArray,
    getType: $.type,
    getTimeInterval,
    hasProp,
    extend: $.extend,
    Swiper: new Swiper(),
};