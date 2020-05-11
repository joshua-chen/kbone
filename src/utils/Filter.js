

import CompUtil from './Component';
import Settings from './Settings';
import Ajax from './Ajax';
import Cache from './Cache';
import Auth from './Auth';
import Util from './util';
import FormUtil from '/components/Form/FormUtil';
import FormValidator from '/components/Form/FormValidator';
import { FormWidgetType } from '/components/Form/FormType';

/**
 *	过滤器<JS>
 *	@author:	joshua<joshua_chen@qq.com>
 *	@date:		2019-07-17
 */

const setPageUtil = (params, page) => CompUtil.setPageUtil(params, page);

const setNavBar = (params) => {
    const title = params.pageTitle || params.text;
    title && dd.setNavigationBar({ title });
};

const switchTab = (p, callback) => {
    let params = {},
        url = '',
        type = typeof p;

    switch (type) {
    case 'object': {
        params = p.params || {};
        url = p.url || '';
        break;
    }
    case 'string': {
        url = p;
        break;
    }
    default:
        break;
    }

    url = Util.createQueryUrl(url, params);

    dd.switchTab({ url });

    if (typeof callback === 'function') {
        const page = CompUtil.getCurrPageObj();	// 切换tab后的当前页面
        setPageUtil(params, page);
        callback(page);
    }
};

// 返回指定开始栈的页面
const navigateBackBeginLevel = (beginLevel, callback) => {
    if (typeof beginLevel === 'undefined') {
        const urlParams = CompUtil.getCurrPageObj().UrlParams;
        beginLevel = urlParams ? urlParams.backLevel : null;
    }
    const delta = CompUtil.getBackPageDelta(beginLevel);
    navigateBack({
        delta,
        callback(backpage) {
            if (typeof callback === 'function') {
                callback(backpage);
                return;
            }
            backpage && typeof backpage.onLoad === 'function' && backpage.onLoad(backpage.UrlParams || {});
            backpage && typeof backpage.onReady === 'function' && backpage.onReady();
            backpage && typeof backpage.onShow === 'function' && backpage.onShow();
            backpage && typeof backpage.filter === 'function' && backpage.filter({});
            backpage && typeof backpage.reload === 'function' && backpage.reload({});
            backpage && dd.hideLoading();
        }
    });
};
// 返回指定栈的页面
const navigateBackByLevel = (backLevel, callback) => {
    if (typeof backLevel === 'undefined') {
        const urlParams = CompUtil.getCurrPageObj().UrlParams;
        backLevel = urlParams ? urlParams.backLevel : null;
    }

    const backpage = CompUtil.getPageObjByLevel(backLevel);
    let delta = 1;
    if (backpage.isIOS && !backpage.debug) {
        delta = CompUtil.getBackPageDelta(backLevel);
    }

    console.log('navigateBackByLevel.backLevel', backLevel);
    console.log('navigateBackByLevel.backpage', backpage.path);
    console.log('navigateBackByLevel.delta', delta);
    console.log('navigateBackByLevel.isIOS', backpage.isIOS);
    navigateBack({
        delta,
        backpage,
        callback() {
            if (typeof callback === 'function') {
                callback(backpage);
            }
        }
    });
};
const navigateBack = (arg) => {
    DDAjax.clearCacheRequest();

    const type = typeof arg;
    let delta = 1;
    let callback = null;
    let backpage = null;
    switch (type) {
    case 'function':
    {
        callback = arg;
        break;
    }
    case 'number':
    {
        delta = arg;
        callback = arguments[1];
        break;
    }
    case 'object': {
        delta = arg.delta;
        callback = arg.callback;
        backpage = arg.backpage;
        break;
    }
    }

    let isSwitchTab = false;
    if (!backpage) { backpage = CompUtil.getPrevPageObj(delta); }

    if (AFAppX && AFAppX.$global && AFAppX.$global.tabsConfig) {
        for (const key in win.$global.tabsConfig) {
            if (key == backpage.route) {
                isSwitchTab = true;
                break;
            }
        }
    }

    if (isSwitchTab) {
        dd.switchTab(backpage.route);
    } else {
        dd.navigateBack({
            delta
        });
    }

    typeof callback === 'function' && callback(backpage);
};

export const reLaunch = (url, params = {}, successCallback, failCallback, completeCallback) => {
    url = Util.createQueryUrl(url, params);
    console.log('%c%s%c%s', 'color:#dfc800; font-size: 14px;', '[reLaunch]===>', 'font-size: 14px; color:#912c2b;', url);

    const app = getApp();

    if (!Auth.isAuthenticated() && !Auth.isAnonymousUrI(url)) {
        Auth.autoLogin();
        return;
    }
    const page = null;
    dd.reLaunch({
        url,
        success(res) {
            setPageUtil(params, page);
            console.log('reLaunch.page');

            setTimeout(() => {
                setNavBar(params);
                typeof successCallback === 'function' && successCallback(res, page);
            }, 200);
        },
        fail(err) {
            typeof failCallback === 'function' && failCallback(err);
        },
        complete(res) {
            typeof completeCallback === 'function' && completeCallback(res);
        }

    });

    setPageUtil(params, page);
};


export const redirectTo = (url, params = {}, successCallback, failCallback, completeCallback) => {
    url = Util.createQueryUrl(url, params);
    console.log('%c%s%c%s', 'color:#dfc800; font-size: 14px;', '[redirectTo]===>', 'font-size: 14px; color:#912c2b;', url);
    const app = getApp();

    if (!Auth.isAuthenticated() && !Auth.isAnonymousUrI(url)) {
        Auth.autoLogin();
        return;
    }

    const page = null;
    dd.redirectTo({
        url,
        success(res) {
            setTimeout(() => {
                setNavBar(params);
                typeof successCallback === 'function' && successCallback(res, page);
            }, 200);
        },
        fail(err) {
            typeof failCallback === 'function' && failCallback(err, page);
        },
        complete(res) {
            typeof completeCallback === 'function' && completeCallback(res, page);
        }

    });
    setPageUtil(params, page);
};

export const navigateTo = (url, params = {}, successCallback, failCallback, completeCallback) => {
    $navigateTo(url, params, successCallback, failCallback, completeCallback);
};

/**
 * @param {*跳转地址值 string} url 必填
 * @param {*跳转参数 json} params 选填
 * @param {*成功回调 func} successCallback  选填
 * @param {*失败回调 func} failCallback 选填
 * @param {*每次都回发生的回调 func} completeCallback  选填
 */
export const $navigateTo = (url, params = {}, successCallback, failCallback, completeCallback) => {
    const app = getApp();
    params = params || {};
    url = Util.createQueryUrl(url, params);
    console.log('%c%s%c%s', 'color:#dfc800; font-size: 14px;', '[navigateTo]===>', 'font-size: 14px; color:#912c2b;', url);
    if (!Auth.isAuthenticated() && !Auth.isAnonymousUrI(url)) {
        Auth.autoLogin();
        return;
    }

    const page = null;
    dd.navigateTo({
        url,
        success(res) {
            setPageUtil(params, page);
            setTimeout(() => {
                setNavBar(params);
                typeof successCallback === 'function' && successCallback(res, page);
            }, 200);
        },
        fail(err) {
            typeof failCallback === 'function' && failCallback(err, page);
        },
        complete(res) {
            typeof completeCallback === 'function' && completeCallback(res, page);
        }

    });
    setPageUtil(params, page);
};


/**
 * @description参数是否是其中之一
 * @param {*string} value
 * @param {*array} validList
 * @returns {*boolean}
 */
export function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value == validList[i]) {
            return true;
        }
    }
    return false;
}

/**
 * js数组排序 支持数字和字符串
 * @param params
 * @param arrObj   obj     必填  数组对象
 * @param keyName  string  必填  要排序的属性名称
 * @param type     int     选填  默认type:0 正顺  type:1反顺
 * @description
 *  使用示例：
      var temp = [
        {"name":"zjf","score":50,"age":10},
        {"name":"lyy","score":90,"age":5},
        {"name":"zzx","score":90,"age":12}
      ];
      //根据age排序
      var temp1 = arrItemSort(temp,"age",1);
 */
export function arrItemSort(arrObj, keyName, type = 0, isDate = 0) {
    // 这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
    // 表示把对象复制给另一个对象，两者间互不影响
    if (!arrObj) {
        return [];
    }
    const tempArrObj = arrObj.slice(0);
    const compare = function (keyName, type) {
        return function (obj1, obj2) {
            let val1 = obj1[keyName];
            let val2 = obj2[keyName];
            if (isDate) {
                val1 = new Date(obj1[keyName]).getTime();
                val2 = new Date(obj2[keyName]).getTime();
            }
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            // 如果值为空的，放在最后
            if (val1 == null && val2 == null) {
                return 0;
            } else if (val1 == null && val2 != null) {
                return type == 1 ? -1 : 1;
            } else if (val2 == null && val1 != null) {
                return type == 1 ? 1 : -1;
            }
            // 排序
            if (val1 < val2) {
                return type == 1 ? 1 : -1;
            } else if (val1 > val2) {
                return type == 1 ? -1 : 1;
            }
            return 0;
        };
    };
    return tempArrObj.sort(compare(keyName, type));
}

const Filter = {
    navigateTo,
    $navigateTo,
    redirectTo,
    reLaunch,
    navigateBack,
    navigateBackBeginLevel,
    navigateBackByLevel,
    switchTab,
};

export default Filter;
