/* eslint-disable prefer-const */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable eqeqeq */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-redeclare */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
/* eslint-disable no-param-reassign */


/**
 *	工具<JS>
 *	@author:	joshua<joshua_chen@qq.com>
 *	@date:		2019-07-17
 */
// eslint-disable-next-line no-unused-vars
import Ajax from './Ajax';
import Filter from './Filter';
import Cache from './Cache';
import Auth from './Auth';
import Menu from './menu';
import Util from './util';
import Location from './location';
import Coord from './baidu2wgs';
import FormUtil from '/components/Form/FormUtil';
import FormValidator from '/components/Form/FormValidator';
import {
    FormWidgetType
} from '/components/Form/FormType';

// 注入组件实例
const injectComponent = ($component) => {
    const uuid = $component.is + $component.$id;
    $component.$uuid = uuid;
    $component.$page.components = $component.$page.components || {};
    $component.$page.components[uuid] = $component;
    $component.setData({
        $id: $component.$id
    });
    $component.setData({
        $uuid: uuid
    });
    $component.setData({
        FormWidgetType
    });
    if ($component.props.name) {
        var instName = $component.props.name;
        $component.$page.components[instName] = $component;
        $component.instName = instName;
        $component.name = instName;
    }

    if ($component.data.widgetType && $component.props.name) {
        var instName = `${$component.data.widgetType}-${$component.props.name}`;
        $component.$page.components[instName] = $component;
        $component.instName = instName;
        $component.setData({
            $instName: instName
        });
    }

    if ($component.data.widgetType) {
        $component.widgetType = $component.data.widgetType;
    }

    if ($component.props.parentInstName) {
        $component.parentInstName = $component.props.parentInstName;
    }
    if ($component.props.ref) {
        $component.$page.refs = $component.$page.refs || {};
        $component.$page.refs[$component.props.ref] = $component;
    }
    setPageUtil({}, $component.$page);
};


const setPageUtil = (params, page) => {
    page = page || getCurrPageObj();

    // console.log('setPageUtil.page')
    // console.log(page)
    // page.app = page.app || (page.app = getApp());

    typeof page.debug === 'undefined' && (page.debug = process.env.debug);


    typeof page.CompUtil === 'undefined' && (page.CompUtil = CompUtil);
    typeof page.updateFormFields === 'undefined' && (page.updateFormFields = updateFormFields);
    typeof page.getFormFieldIndex === 'undefined' && (page.getFormFieldIndex = getFormFieldIndex);
    typeof page.getFormField === 'undefined' && (page.getFormField = getFormField);
    typeof page.getFormFieldUpdateProps === 'undefined' && (page.getFormFieldUpdateProps = getFormFieldUpdateProps);

    typeof page.Filter === 'undefined' && (page.Filter = Filter);
    typeof page.Auth === 'undefined' && (page.Auth = Auth);
    typeof page.Cache === 'undefined' && (page.Cache = Cache);
    typeof page.Util === 'undefined' && (page.Util = Util);

    return page;
};
const getInjectComponents = ($page) => {
    let components = $page.components || ($page.$page ? $page.$page.components : null);

    if (!components) {
        components = {};
        const _components = getComponents($page);
        for (const idx in _components) {
            const component = _components[idx];
            const key = component.is + component.$id;
            components[key] = component;
        }
    }
    return components;
};

// 获取所有组件对象
const getComponents = ($page, cuuid) => {
    let _getComponentBy = function (by, config) {
        return [];
    };
    if (typeof $page.$getComponentBy === 'function') {
        _getComponentBy = $page.$getComponentBy;
    } else {
        _getComponentBy = $page.$page.$getComponentBy;
    }
    if (typeof _getComponentBy === 'function') {
        const _components = [];
        const components = _getComponentBy((inst) => {
            // console.log('component====>', inst);
            if (cuuid) {
                if (inst.is + inst.$id == cuuid ||
                    inst.$id == cuuid // 没有注入的，直接使用$id匹配
                ) {
                    _components.push(inst);
                    return true;
                }
            } else {
                _components.push(inst);
                return true;
            }
        }, {
            returnOnFirstMatch: false
        });
        return _components;
    }

    return [];
};

//
//
// @param {*cuuid*} 组件 <全局唯一ID > 或者 < $id >
const getComponent = ($page, cuuid) => {
    const comps = getInjectComponents($page);
    if (comps) {
        const c = comps[cuuid];
        if (c) {
            return c;
        }
    }


    const components = getComponents($page, cuuid);

    return components[0];
};


// 获取当前页面组件对象
// @param {*cuuid*} 组件 <全局唯一ID > 或者 < $id >
const getCurrPageComponent = (cuuid) => {
    const page = getCurrPageObj();

    return getComponent(page, cuuid);
};

// 获取前一个页面的组件对象
// @param {*cuuid*} 组件 <全局唯一ID > 或者 < $id >
const getPrevPageComponent = (cuuid) => {
    const page = getPrevPageObj();
    return getComponent(page, cuuid);
};

const getPageObjByPath = (url) => {
    const pages = getCurrentPages();
    let page = null;
    for (const key in pages) {
        const p = pages[key];
        if (url.indexOf(p.route) >= 0) {
            page = p;
            break;
        }
    }
    return page;
};

const getCurrPages = () => getCurrentPages();

const getCurrPageLevel = () => getCurrPages().length;

const getBackPageDelta = (currLevel) => {
    const count = getCurrPages().length;
    currLevel = currLevel || count;
    let delta = count - currLevel;
    delta <= 0 && (delta = 1);

    return delta;
};


// 根据层级获取页面对象，从0开始 往前推
const getPageObjByLevel = level => getCurrentPages()[level - 1];
// 前一个页面对象
// 从1开始 往前推，默认为1，前一个页面，依次+1 往前迭代； 如 1 、 2、 3等
const getPrevPageObj = (level) => {
    // console.log('---------getPrevPageObj------------')
    // console.log(getCurrentPages())
    level = typeof level !== 'undefined' ? level : 1;
    const page = getCurrentPages().reverse()[level];
    return page;
};
// 当前页面对象
const getCurrPageObj = () => {
    const pages = getCurrentPages();
    const page = pages.reverse()[0];
    page.level = pages.length;
    return page;
};

// 当前页面地址
const getCurrPageUrl = ($page) => {
    if ($page) {
        if ($page.$page) {
            return $page.$page.route;
        }
        return $page.route;
    }
    let url = getCurrentPages().map(i => [i.route]).reverse()[0][0];
    if (url.substr(0, 1) != '/') {
        url = `/${url}`;
    }
    return url;
};
// ajax请求
const ajax = ($this, ajaxOptions, callbacks) => {
    const self = $this;

    function success(res) {
        if (ajaxOptions.onSuccess && typeof self.$page[ajaxOptions.onSuccess] === 'function') {
            self.$page[ajaxOptions.onSuccess](res);
        }

        callbacks && typeof callbacks.success === 'function' && callbacks.success(res);
    }

    function complete(res) {
        callbacks && typeof callbacks.complete === 'function' && callbacks.complete(res);
    }

    function fail(res) {
        callbacks && typeof callbacks.fail === 'function' && callbacks.fail(res);
    }

    if (ajaxOptions.onBefore && typeof self.$page[ajaxOptions.onBefore] === 'function') {
        self.$page[ajaxOptions.onBefore](ajaxOptions);
    }

    if (ajaxOptions.getPostData && typeof self.$page[ajaxOptions.getPostData] === 'function') {
        const postData = self.$page[ajaxOptions.getPostData](ajaxOptions.data, ajaxOptions.parent);
        if (typeof postData !== 'undefined' && postData != null) {
            ajaxOptions.data = Object.assign({}, postData);
        }

        if (ajaxOptions.parent) {
            delete ajaxOptions.parent;
        }
    }
    let {
        url,
        data,
        method
    } = ajaxOptions;
    method = method || 'get';
    if (method.toLowerCase() === 'get') {
        Ajax.get({
            url,
            data,
            success: success.bind(this),
            fail: fail.bind(this),
            complete: complete.bind(this)
        }).catch((err) => {
            console.log('==============>>>> ', err);
            wx.x.hideLoading();
        });
    } else if (method.toLowerCase() === 'post') {
        Ajax.post({
            url,
            data,
            success: success.bind(this),
            fail: fail.bind(this),
            complete: complete.bind(this)
        }).catch((err) => {
            console.log('==============>>>> ', err);
            wx.x.hideLoading();
        });
    }
};

// 获取表单字段的索引
const getFormFieldIndex = ($form, fields, fieldName) => {
    let _fields = fields;
    if (typeof fields === 'string') {
        // _fields = $page.data[fields];
        _fields = Util.getNsObject($form.data, fields);
    }

    if (Array.isArray(_fields)) {
        const __fields = _fields.slice(0);
        const index = __fields.findIndex(x => x.name == fieldName);
        return index;
    }

    return -1;
};
// 获取表单字段待更新的属性集合
const getFormFieldUpdateProps = ($form, target, arg, props) => {
    const self = $form;
    let index = -1;
    if (typeof arg === 'number' || !isNaN(arg)) {
        index = parseInt(arg);
    } else if (typeof arg === 'string') {
        const fieldName = arg;
        index = getFormFieldIndex($form, target, fieldName);
    }

    const dataProps = {};
    /* if (Array.isArray(props)) {
		props.map((prop, idx) => {
			var str = target + '[' + index + '].' + prop.name;
			dataProps[str] = prop.value;
		});
	} else */
    if (typeof props === 'object') {
        for (const key in props) {
            const str = `${target}[${index}].${key}`;
            dataProps[str] = props[key];
        }
    } else if (typeof props === 'string') {

    }
    return dataProps;
};

// 更新单个表单字段
const updateFormField = ($form, fieldsPath, index, props) => {
    const self = $form;
    const updateProps = getFormFieldUpdateProps($form, fieldsPath, index, props);
    self.setData(updateProps);
};

const getFormField = ($form, fieldsPath, arg) => {
    const self = $form;
    let index = -1;
    if (typeof arg === 'number' || !isNaN(arg)) {
        index = parseInt(arg);
    } else if (typeof arg === 'string') {
        const fieldName = arg;
        index = getFormFieldIndex($form, fieldsPath, fieldName);
    }


    const fields = Util.getNsObject(self.data, fieldsPath);
    if (index >= 0 && fields && fields.length) {
        return fields[index];
    }
    return false;
};

// 更新表单字段信息
const updateFormFields = ($page, fieldsPath, arg, props) => {
    const self = $page;
    if (typeof fieldsPath === 'undefined') {
        console.error('fieldsPath为定义');
        return;
    }

    if (typeof arg === 'undefined') {
        console.error('arg为定义');
        return;
    }

    if (typeof arg === 'object') {
        const dataProps = {};
        for (const key in arg) {
            const _props = arg[key];
            var updateProps = getFormFieldUpdateProps($page, fieldsPath, key, _props);
            Object.assign(dataProps, updateProps);
        }
        self.setData(dataProps);
    } else {
        var updateProps = getFormFieldUpdateProps($page, fieldsPath, arg, props);
        self.setData(updateProps);
    }
};


// 更新组件的dataset ，即data-xxx属性
const updateDataSet = ($component) => {
    const self = $component;
    self.dataset = {};

    for (const key in self.props) {
        if (/data-/gi.test(key)) {
            const dsName = key.replace(/data-/gi, '');
            const segments = dsName.split('-');
            var name = '';
            segments.map((x, i) => {
                let firstChar = x.substr(0, 1);
                if (i > 0) {
                    firstChar = firstChar.toUpperCase();
                }
                name += firstChar + x.substr(1);
            });
            self.dataset[name] = self.props[key];
        }
    }
};


const CompUtil = {

    getCurrPageUrl,
    getPrevPageObj,
    getPageObjByLevel,
    getPrevPageComponent,
    getInjectComponents,
    getComponents,
    getComponent,
    getCurrPageComponent,
    getCurrPageObj,
    getCurrPages,
    getCurrPageLevel,
    getBackPageDelta,
    getPageObjByPath,
    injectComponent,
    setPageUtil,
    ajax,
    updateDataSet,
    updateFormFields,
    getFormFieldIndex,
    getFormField,
    getFormFieldUpdateProps,
};

export default CompUtil;
