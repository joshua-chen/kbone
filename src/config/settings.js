/* eslint-disable eol-last */
// 应用配置信息

export default {
    env: process.env.name, // 默认当前环境, dev | prod | sit | uat
    dev: { // 开发环境
        debug: process.env.debug, // true | false 调试模式,发布时修改为-false
        serviceBaseUrl: 'https://test-zhzl.spacecig.com', // API服务基址
        fileServerUrl: 'https://test-zhzl.spacecig.com', // 文件服务器URL
        defaultImagePath: '/cigApi/common/getImages?id=b9826853-14e3-4504-bd9f-971fca48fd7c',
        handleErrCode: true,
        appKey: '',
        appSecret: '',
        permissionEnabled: true,
    },
    prod: { // 生产
        debug: process.env.debug, // 调试模式,发布时修改为-false
        defaultImagePath: '/cigApi/common/getImages?id=44639da5-4502-4222-bd02-0a7d4b6b36c9',
        handleErrCode: true,
        permissionEnabled: true,
    },
    sit: { // 集成测试
        debug: false,
        serviceBaseUrl: 'https://test-zhzl.spacecig.com',
        fileServerUrl: 'https://test-zhzl.spacecig.com',
        defaultImagePath: '/cigApi/common/getImages?id=b9826853-14e3-4504-bd9f-971fca48fd7c',
        handleErrCode: true,
        appKey: '',
        appSecret: '',
        permissionEnabled: true,
    },
    uat: {
        debug: false,
        serviceBaseUrl: 'https://test-zhzl.spacecig.com',
        fileServerUrl: 'https://test-zhzl.spacecig.com',
        defaultImagePath: '/cigApi/common/getImages?id=b9826853-14e3-4504-bd9f-971fca48fd7c',
        handleErrCode: true,
        appKey: '',
        appSecret: '',
        permissionEnabled: true
    }
};