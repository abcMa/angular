/**
 * 应用配置
 */

_.assign(window.APP_CONFIG, {
    // 应用 key
    appkey: undefined,

    // 系统类型： ['android', 'ios', 'weixin']
    os: undefined,

    // 系统版本
    osVersion: undefined,

    // 应用版本
    appVersion: '<<< version >>>',    // 该处使用一个占位符，在打包应用时由构建工具进行替换

    // 客户端唯一性标识，同一设备内唯一
    unique: undefined,

    // API 服务端根地址，由构建工具替换
    service: '<<< service >>>',

    // 分站 ID
    subsiteId: undefined,

    // 全球购分站 ID
    overseasShopId: '<<< overseasShopId >>>',

    // 是否在全球购页面中
    isInOverseasShopView: undefined,

    // 地区 ID
    regionId: undefined,

    // 地区 ID
    regionName: undefined,

    // 应用语言，支持 en, zh-CN，默认浏览器语言 navigator.language
    // language: 'zh-CN'
    language: 'zh-CN',

    // 应用渠道标记，由构建工具替换
    // 应用环境内使用 config.xml 中的设置替换
    channel: '<<< channel >>>',

    // At internet 统计 siteId
    atAnalyticSiteId: '<<< atAnalyticSiteId >>>',

    // 高德API的APPKEY
    amapAppKey: "<<< amapAppKey >>>",

    // 0 为 false, 1 为 true
    applePayDebugMode: "<<< applePayDebugMode >>>",

    // 静默热部署相关配置：若为 false，则不开启该功能；若为 true，则开启；若为对象，则开启，并以此为配置项。
    silentDeploy: {
        // 设置超时时间，毫秒，若热部署时间超过该设置时间，则将热部署操作转入后台执行，并且在更新文件准备完成后不会立即应用该更新，而是等待应用下次重启时加载。
        timeout: 0
    }
});
