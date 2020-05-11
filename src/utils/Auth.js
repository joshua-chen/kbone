/* eslint-disable no-undef */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable one-var */
/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
// eslint-disable-next-line no-trailing-spaces
/** 
 *	鉴权<JS>
 *	@author:	joshua<joshua_chen@qq.com>
 *	@date:		2019-07-24
 */

import Util from './Util';
import CompUtil from './Component';
import Settings from './Settings';
import Ajax from './Ajax';
import Filter from './Filter';

import {
    login,
    logout,
    userTokenByAuthCode
} from '../api/user';

const USER_INFO_KEY_SUFFIX = '_userinfo';

const autoLoginConfig = {
    failTimes: -1, // 自动登录失败次数
    beginTime: null, // 自动登录开始时间
    retryInterval: 10, // 重试时间间隔（单位秒），10秒内重试次数超过RetryTimesLimit次
    retryTimesLimit: 5, // 自动登录重试次数，RetryInterval间隔时间内，超过该次数，跳转登录界面
};

const errCodes = [
    'XR_1', // 跳转到设备信任短信验证界面
    'MG_2', // 未设置敏感数据密码
    'MG_1', // 未校验敏感数据密码
    '40078' // 跳转到设备信任短信验证界面
];
//
// 鉴权对象
//
const Auth = {
    app: null,
    // 授权码
    getAuthCode(success) {
        const self = this;
        const app = self.getApp();
        wx.getAuthCode({
            success(res) {
                self.getApp().globalData.authCode = res.authCode;
                if (typeof success === 'function') {
                    success(res.authCode);
                }
            },
            fail(err) {}
        });
        return app.globalData.authCode;
    },
    getApp() {
        if (!Auth.app) {
            Auth.app = getApp();
        }
        return Auth.app;
    },

    getMacAddress() {
        const app = Auth.getApp();
        let prefix = '';
        if (app.globalData.launchOptions && app.globalData.launchOptions.referrerInfo) {
            prefix = `${app.globalData.launchOptions.referrerInfo.appId}_`;
        }
        return Util.getMacAddress(prefix);
    },
    // ajax请求鉴权的头部信息
    getAuthHeader(method) {
        const app = Auth.getApp();
        const globalData = app.globalData;
        // eslint-disable-next-line prefer-const
        let defaultHeaders = {};
        defaultHeaders.phonenum = globalData.systemInfo.system;
        defaultHeaders.phonetype = globalData.systemInfo.model;
        defaultHeaders.system = globalData.systemInfo.platform;
        defaultHeaders.macaddress = Auth.getMacAddress();


        let cigToken = '';
        if (!cigToken) {
            const userinfo = Auth.getUserInfo();
            if (userinfo) {
                cigToken = userinfo.token;
            }
        }
        if (cigToken) {
            defaultHeaders.cookie = `CIGToken=${cigToken}`;
        }

        return defaultHeaders;
    },
    // 返回指定栈的页面
    backPage: (backLevel) => {
        const page = CompUtil.getCurrPageObj();
        if (page.errCode && page.errCode in errCodes) {
            this.errCodeHandle.end();
        }
        Filter.navigateBackBeginLevel(backLevel);
        const app = Auth.getApp();
        app.startTimer();
    },
    // 跳转校验数据密码页面
    goCheckDataPwd: (params) => {
        wx.hideLoading();
        Filter.navigateTo(Settings.DATA_PWD_VALIDATE_URL, params || {});
        const app = Auth.getApp();
        app.stopTimer();
    },
    // 跳转数据密码设置页面
    goSetDataPwd: (params) => {
        wx.hideLoading();
        const self = this;
        const userinfo = Auth.getUserInfo();
        if (!params) {
            params = {
                phone: userinfo.phone,
                token: userinfo.token,
            };
        }
        params.userId = userinfo.userId;
        Filter.navigateTo(Settings.DATA_PWD_SETTINGS_URL, params || {});
        const app = Auth.getApp();
        app.stopTimer();
    },
    // 跳转主页
    goHome: () => {
        wx.hideLoading();
        wx.switchTab({
            url: Settings.HOME_URL
        });
        const app = Auth.getApp();
        app.startTimer();
    },
    // 跳转登录
    goLogin: (returnUrl, msg) => {
        wx.hideLoading();

        function _goLogin() {
            const currUrl = CompUtil.getCurrPageUrl();
            if (Settings.LOGIN_URL.indexOf(currUrl) >= 0) {
                return;
            }

            returnUrl = returnUrl || currUrl;
            if (Settings.LOGIN_URL.indexOf(returnUrl) >= 0) {
                returnUrl = '';
            }
            const app = Auth.getApp();
            returnUrl = Settings.HOME_URL;
            const url = Util.createQueryUrl(Settings.LOGIN_URL, {
                returnUrl
            });
            Filter.reLaunch(url);
        }

        if (msg) {
            wx.x.showToast(msg, () => {
                _goLogin();
            });
            return;
        }

        _goLogin();
    },


    // 退出登录
    logout() {
        const self = this;
        console.log('Settings', Settings);
        return logout().then((ok) => {
            if (ok.success == 1) {
                self.clearToken();
                self.goLogin(Settings.HOME_URL);
                const app = Auth.getApp();
                app.stopTimer();
            }
        }, (fail) => {

        });
    },


    //
    // 处理错误码
    //
    handleErrCode(errCode, data) {
        const self = this;

        if (!Settings.handleErrCode) {
            return;
        }

        if (self.errCodeHandle.isHandling()) {
            return;
        }

        errCode = errCode ? errCode.toString() : '';
        const userinfo = self.getUserInfo();
        const params = {
            phone: data.phone,
            token: data.token,
            userId: userinfo.userId,
            backLevel: CompUtil.getCurrPageLevel(), // 返回页面栈
            errmsg: encodeURIComponent(data.errmsg || ''),
            errCode,
        };


        switch (errCode) {
            case 'XR_1': // 跳转到设备信任短信验证界面
            {
                const app = Auth.getApp();
                app.stopTimer();
                Filter.navigateTo(Settings.DEVICE_TRUST_VALIDATE_URL, params);
                break;
            }
            case 'MG_2': // 未设置敏感数据密码
            {
                self.goSetDataPwd(params);
                break;
            }
            case 'MG_1': // 未校验敏感数据密码
            {
                self.goCheckDataPwd(params);
                break;
            }
            case '40078': // 不存在的临时授权码
            {
                self.goLogin('', data.errmsg || '');
                break;
            }
        }
        this.errCodeHandle.in();
    },
    autoLoginCompleted: false,
    //
    // 自动登录
    //
    autoLogin(params) {
        let successCallback = params ? params.success : '',
            failCallback = params ? params.fail : '',
            tokenExpired = params && typeof params.tokenExpired === 'boolean' ? params.tokenExpired : false;

        const self = this;


        // let userinfo = self.getUserInfo();
        self.clearToken();
    },
    // 鉴权
    auth(url) {
        if (!url) {
            url = CompUtil.getCurrPageUrl();
        }
        const self = this;
        if (!self.isAuthenticated() && !self.isAnonymousUrI(url)) {
            // console.log('isAuthenticated=false');
            self.autoLogin();
        }

        return true;
    },
    getGlobalData() {
        return Auth.getApp().globalData;
    },
    checkDevice() {
        const lastDevice = Auth.getApp().globalData.lastDevice;
        if (lastDevice) {
            const currDevice = wx.getSystemInfoSync();
            if (JSON.stringify(currDevice) != JSON.stringify(lastDevice)) {
                this.goLogin('', '其他设备已登录');
                return false;
            }
        }
        return true;
    },
    // 检查在线
    checkOnline(options) {
        const self = this;
        const time = null;

        // var deviceOk = self.checkDevice();
        // if (!deviceOk) {
        // return;
        // }
        self.online((res) => {
            if (res.success != 1) {
                self.auth();
            }
        }, options);
    },
    // 用户在线
    online(callback, options) {
        const self = this;
        const user = self.getUserInfo();

        if (!user || !user.token) {
            self.autoLogin();
            return;
        }

        const params = {
            csys: '3',
            lat: '',
            long: '',
            userId: user ? user.userId : '',
            userName: user ? user.userName : '',
        };

        function fetchOnline(params) {
            Ajax.get({
                url: '/zhzlApp/webIm/userOnline',
                data: params
            }).then((ok) => {
                if (ok.success == 0) {
                    // console.warn('userOnline.ok===>' + JSON.stringify(ok));
                }

                if (callback) {
                    callback(ok);
                }
            }, (fail) => {
                console.warn(`userOnline.fail===>${JSON.stringify(fail)}`);
            });
        }
    },
    // 是否通过授权
    isAuthenticated() {
        const self = this;
        const userinfo = self.getUserInfo();
        return userinfo && userinfo.token;
    },

    getUserInfoKey() {
        const app = Auth.getApp();
        let key = USER_INFO_KEY_SUFFIX;
        if (app.globalData.launchOptions && app.globalData.launchOptions.referrerInfo) {
            key = app.globalData.launchOptions.referrerInfo.appId + USER_INFO_KEY_SUFFIX;
        }

        return key;
    },
    setUserInfo(data) {
        const self = this;
        const app = Auth.getApp();
        let userinfo = app.globalData.userInfo || {};
        // app.globalData.userInfo = data;
        userinfo = Object.assign(userinfo, data);
        app.globalData.token = data.token;
        app.globalData.userId = data.userId;
        app.globalData.username = data.userName;
        app.globalData.userInfo = userinfo;
        wx.setStorageSync({
            key: Auth.getUserInfoKey(),
            data: userinfo,
        });
    },
    getUserInfo() {
        return this.current.user().info();
    },
    isAdmin() {
        return this.current.user().isAdmin();
    },
    getActionCodes() {
        return this.current.user().actionCodes();
    },
    // 清理token
    clearToken() {
        this.setToken('');
    },
    // 设置token
    setToken(token) {
        const app = Auth.getApp();

        const self = this;
        const userinfo = self.getUserInfo();
        if (userinfo) {
            userinfo.token = token;
            wx.setStorageSync({
                key: Auth.getUserInfoKey(),
                data: userinfo
            });
            app.globalData.userInfo = userinfo;
        }

        app.globalData.token = token;
    },
    current: {
        user() {
            let userinfo = null;
            return {
                info() {
                    if (!userinfo) {
                        const self = this;
                        const app = Auth.getApp();
                        if (app.globalData.userInfo) {
                            return app.globalData.userInfo;
                        }

                        const res = wx.getStorageSync({
                            key: Auth.getUserInfoKey()
                        });
                        userinfo = res.data;
                    }
                    return userinfo;
                },

            };
        }
    }
};
// console.log('Auth======================')

export default Auth;
