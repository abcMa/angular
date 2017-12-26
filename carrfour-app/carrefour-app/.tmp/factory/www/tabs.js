/**
 * 关于 tab 项的配置
 * 因为 ionic 不支持使用 ng-repeat 动态创建 tab 项，因此如果有修改这里的配置，
 * 都请到 tabs.html 模板文件中手动更新一遍
 */
angular.module('app').constant('tabs', [
    {
        name: 'index'
    },
    {
        name: 'categories'
    },
    {
        name: 'cart'
    },
    {
        name: 'user'
    }
]);
