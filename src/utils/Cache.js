/* eslint-disable eqeqeq */
/* eslint-disable eol-last */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */

export default class Cache {
    static Shop = {};
    static constructor() {
        const root = (window && window.$$miniprogram && window.$$miniprogram.window);
        if (typeof root.Shop === 'undefined') {
            root.Shop = {};
        }

        Shop = root.Shop;
    }
    static clearAllGlobalData() {
        getApp().globalData.caches = null;
    }
    static clearGlobalData(pageUrl) {
        if (!pageUrl) {
            pageUrl = getCurrentPages().map(i => [i.route]).reverse()[0][0];
        }
        const root = getApp().globalData.caches;
        if (root && typeof root[pageUrl] !== 'undefined') {
            delete root[pageUrl];
        }
    }
    static getGlobalData(pageUrl) {
        if (!pageUrl) {
            pageUrl = getCurrentPages().map(i => [i.route]).reverse()[0][0];
        }

        !getApp().globalData.caches && (getApp().globalData.caches = {});

        const root = getApp().globalData.caches;

        const result = typeof root[pageUrl] === 'undefined' ? {} : root[pageUrl];
        return result;
    }
    static setGlobalData(data, pageUrl) {
        !getApp().globalData.caches && (getApp().globalData.caches = {});
        const root = getApp().globalData.caches;
        // console.log('----root-------', root)
        if (!pageUrl) {
            pageUrl = getCurrentPages().map(i => [i.route]).reverse()[0][0];
        }
        if (pageUrl.substr(0, 1) == '/') {
            pageUrl = pageUrl.substr(1, pageUrl.length);
        }

        root[pageUrl] = root[pageUrl] || {};
        for (const key in data) {
            root[pageUrl][key] = data[key];
        }
    }
    static getStorageKey(key) {
        const app = getApp();
        let prefix = '';
        if (app.globalData.launchOptions && app.globalData.launchOptions.referrerInfo) {
            prefix = `${app.globalData.launchOptions.referrerInfo.appId}_`;
        }
        key = prefix + key;
        return key;
    }
    static setStorageSync(key, data) {
        key = getStorageKey(key);
        wx.setStorageSync({
            key,
            data,
        });
    }
    static getStorageSync(key) {
        key = getStorageKey(key);
        const res = wx.getStorageSync({
            key
        });

        return res;
    }
}