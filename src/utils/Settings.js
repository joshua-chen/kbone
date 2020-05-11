/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable vue/script-indent */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable one-var */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import AppSettings from '../config/settings';
import Util from './Util';


/*
 *
 * 系统配置
 *
 */
let app = null;
const _getApp = () => {
    if (!app) {
        app = getApp();
    }
    return app;
};

//
//
const Settings = {
    envs: [
        'dev', // 开发测试：<基层测试>
        'prod', // 生产
        'sit', // 集成测试: <基层治理>
        'uat' // 用户体验
    ],
    dev: { // 开发测试

    },
    prod: { // 生产

    },
    sit: { // 集成测试

    },
    uat: { // 用户体验

    }
};

Util.extend(true, Settings, AppSettings);

// console.log(Settings);


//
//
//

let origin_config = Settings[Settings.env],
    config = Util.extend(true, {
        env: Settings.env
    }, origin_config);


if (config.envs && typeof config.envs === 'object') {
    if (config.env) {
        const _config = Util.extend(true, {}, config.envs[config.env]);
        Util.extend(true, config, _config);
    }
    delete config.envs;

    config.envPath = Settings.env;
    if (Settings.env != config.env) {
        config.envPath = config.env ? `${Settings.env}.${config.env}` : Settings.env;
        config.env = config.envPath;
    }
}

// config.appIds = appIds;
// config.configsWithAppId = configsWithAppId;
config.originSettings = Settings;
// console.log('config', config)


// =======================================================================================================
// 调试模式
//
const debug = config.debug;


// =======================================================================================================
// token过期标识
export const TOKEN_EXPIRED = 'tokenExpired';

// =======================================================================================================
// api的base url
const serviceBaseUrl = config.serviceBaseUrl;

export const SERVICE_URL = config.serviceBaseUrl;

// 登录URL
export const LoginUrl = '/pages/login/index/index';
// 首页URL
export const HomeUrl = '/pages/index/index';


//= =======================================================================================================
// 文件上传配置
//

const fileUploadServiceUrl = `${config.fileServerUrl}/zhzlApp/common/uploadFile`;
// const fileServerUrl = 'http://192.168.80.41:8000/common/uploadFile';
// 上传选择图片数量
const defaultImagePath = config.fileServerUrl + config.defaultImagePath;
//= =======================================================================================================


//
//
//
export default {
    serviceBaseUrl,
    LoginUrl,
    HomeUrl,
    debug,
    TOKEN_EXPIRED,
    fileServerUrl: config.fileServerUrl,
    fileUploadServiceUrl,
    env: config.env,
    defaultImagePath,
    defaultImageUrl: config.fileServerUrl + config.defaultImagePath,
    getImageUrl(id) {
        if (!id) {
            return '';
        }
        return `${config.fileServerUrl}/cigApi/common/getImages?id=${id}`;
    },
    uploadServiceUrl: `${config.fileServerUrl}/zhzlApp/common/uploadFile`,
};
