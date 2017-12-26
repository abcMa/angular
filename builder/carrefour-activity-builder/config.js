// 应用程序配置
window.APP_CONFIG = {
    language: 'en'
};

// 应用国际化配置
window.APP_LANG = {
    // language: 'zh-CN'
};

// 应用状态码配置
window.APP_STATE_CODE = {};

// 应用当前登录用户信息
window.APP_USER = {};

_.assign(window.APP_CONFIG, {
    // API 服务端根地址
    service: 'http://182.50.117.44:80/mobile/api', // 测试外网
    os: ionic.Platform.platform(),
    osVersion: ionic.Platform.version(),
    cityId: 250000200
});
