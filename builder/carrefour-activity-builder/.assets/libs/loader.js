// 加载器
angular.module('app.services').provider('loader', ["$controllerProvider", "$injector", function (
    $controllerProvider, $injector
) {
    this.$get = function () {
        return {
            getActivityLoader: function (compile) {
                return function (fn) {
                    var args = $injector.annotate(fn);
                    $controllerProvider.register("tempActivity", args.concat(fn));
                    console.info("[register]: complete.");
                    compile();
                };
            }
        };
    };
}]);

// 保持和正常应用一样的使用方法
app.run(["loader", "$rootScope", "$compile", function (loader, $rootScope, $compile) {
    window._activityLoader = loader.getActivityLoader(function () {
        var $scope = $rootScope.$new();
        $compile($("body"))($scope);
        console.info("[compile]: complete.");
        $scope.$digest();
        console.info("[scope]: digging...");

    });
}]);

// 配置 api 服务
app.config(["$httpProvider", "apiProvider", function ($httpProvider, apiProvider) {
    // 配置服务器根路径
    apiProvider.serviceAddress = APP_CONFIG.service;

    // 自定义请求参数编码
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ?
            apiProvider.formatUrlParameter(data) : data;
    }];

    // 更加健壮的响应数据转换器，当响应数据为 json 字符串时，将按照 json 格式进行解析，否则直接当作字符串返回。
    var defaultJsonTransformResponse = $httpProvider.defaults.transformResponse[0];
    $httpProvider.defaults.transformResponse = [function (data, headers) {
        try {
            return defaultJsonTransformResponse(data, headers);
        } catch (e) {
            return data;
        }
    }];

    // 添加请求头部属性
    _.assign($httpProvider.defaults.headers.common, {
        appkey: function () {
            return APP_CONFIG.appkey;
        },
        os: function () {
            return APP_CONFIG.os;
        },
        osVersion: function () {
            return APP_CONFIG.osVersion;
        },
        appVersion: function () {
            return APP_CONFIG.appVersion;
        },
        unique: function () {
            return APP_CONFIG.unique;
        },
        subsiteId: function () {
            return APP_CONFIG.subsiteId;
        },
        language: function () {
            return APP_CONFIG.language;
        },
        userid: function () {
            return APP_USER.id;
        },
        userSession: function () {
            return APP_USER.userSession;
        }
    });
}]);
