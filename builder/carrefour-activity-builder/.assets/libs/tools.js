/**
 * 一些简单的辅助函数
 */
angular.module('app').factory('utils', function() {
    return {
        /**
         * 清空一个数组或对象
         */
        empty: function(target) {
            if (!target) { return; }

            if (Object.prototype.toString.call(target) === '[object Array]') {
                target.splice(0, target.length);
            }
            else if (typeof target === 'object') {
                var _hasown = Object.prototype.hasOwnProperty;
                for (var name in target) {
                    if (_hasown.call(target, name)) {
                        delete target[name];
                    }
                }
            }

            return target;
        },

        /**
         * 代理函数
         */
        proxy: function(object, name) {
            var args = Array.prototype.slice.call(arguments, 2);
            return function() {
                return object[name].apply(object, args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };
});

/**
 * API 服务封装了 $http 服务，用于访问后台接口，
 * 它除了可以出发网络异常导致的错误外，还能识别业务异错误。
 */
angular.module('app.services').provider('api', function apiProvider() {
    var provider = this;

    // API 服务器根地址
    provider.serviceAddress = '';

    // 请求超时时间，默认一分钟
    provider.timeout = 1000 * 60;

    // 以 url 编码方式序列化对象
    provider.formatUrlParameter = function(obj) {
        var result = '',
            jsonstr = JSON.stringify(obj);

        if ( jsonstr && jsonstr !== '""' && jsonstr !== '{}' && jsonstr !== '[]' && jsonstr !== 'null' ) {
            result = 'param=' + encodeURIComponent(jsonstr);
        }

        return result;
    };

    // 扩展 promise，为其添加 success 及 error 两个方法
    provider.extendPromise = function(promise, deferred) {
        promise._then = promise.then;

        promise.then = function() {
            var newPromise = this._then.apply(this, arguments);
            provider.extendPromise(newPromise, deferred);
            return newPromise;
        };

        promise.success = function(callback) {
            return this.then(function(response) {
                callback(response && response.data, response && response.status, response && response.headers, response && response.config);
                return response;
            });
        };

        promise.error = function(callback) {
            return this.then(null, function(response) {
                callback(response && response.data, response && response.status, response && response.headers, response && response.config);
                throw response;
            });
        };

        promise.cancel = function() {
            deferred && deferred.abort && deferred.abort('cancel');
        };

        return promise;
    };

    provider.$get = ['$http', '$q', function($http, $q) {
        var api = function(config) {
            var deferred  = api.defer(),
                canceller = $q.defer(),
                timeout   = config.timeout || provider.timeout,

                abortTimer;

            config.url = provider.serviceAddress + config.url;
            config.timeout = canceller.promise;

            $http(config).then(
                function(response) {
                    response.config = config;

                    // if stateCode is undefined, null or 0, is success.
                    if (response.data && response.data.stateCode) {
                        deferred.reject(response);
                    }
                    else {
                        response.originalData = response.data;
                        response.data = response.originalData.data;
                        deferred.resolve(response);
                    }
                },
                function(response) {
                    response.config = config;
                    deferred.reject(response);
                }
            )
            .finally(function() {
                abortTimer && clearTimeout(abortTimer);
            });

            // 中止请求
            deferred.abort = function(reason) {
                canceller.resolve(reason);
            };

            if (typeof timeout === 'number') {
                abortTimer = setTimeout(function() {
                    deferred.abort('timeout');
                }, timeout);
            }
            else if (typeof timeout.then === 'function') {
                timeout.then(deferred.abort);
            }

            return deferred.promise;
        };

        api.get = function(url, data, config) {
            var paramsIndex, dataStr;

            if (data) {
                dataStr = provider.formatUrlParameter(data);
                url += '?' + dataStr;
            }

            return api(angular.extend(config || {}, {
                method: 'get',
                url: url
            }));
        };

        api.post = function(url, data, config) {
            return api(angular.extend(config || {}, {
                method: 'post',
                url: url,
                data: data
            }));
        };

        api.reject = function(code, message) {
            var response;

            if (code && typeof code === 'object') {
                response = code;
            }
            else {
                response = {
                    data: {
                        stateCode: code,
                        message: message
                    },
                    status: 200
                };
            }

            return api.extendPromise($q.reject(response));
        };

        api.when = function(data) {
            return api.extendPromise($q.when({
                data: data
            }));
        };

        /**
         * 构建一个 deferred 对象，该对象的 promise 已经过扩展，具有和 api 服务所返回的 promise 相同的使用方式。
         * 另外该 deferred 的 reject 方法可接收三个参数，分别是错误编码，错误信息及建议的错误显示方式。
         *
         * 建议：为了和由 $q 所创建的 deferred 区分开，建议使用如下命名：
         *
         *     var apiDeferred = api.defer();
         */
        api.defer = function() {
            var deferred = $q.defer();

            deferred.promise = api.extendPromise(deferred.promise, deferred);

            deferred._resolve = deferred.resolve;
            deferred.resolve = function(response) {
                response = response || {
                    data: {},
                    status: 200
                };

                return this._resolve(response);
            };

            deferred._reject = deferred.reject;
            deferred.reject = function(code, message) {
                var response;

                if (code && typeof code === 'object') {
                    response = code;
                }
                else {
                    response = {
                        data: {
                            stateCode: code,
                            message: message
                        },
                        status: 200
                    };
                }

                this._reject(response);
            };

            return deferred;
        };

        api.all = function(promises) {
            var promise = $q.all(promises);
            return api.extendPromise(promise);
        };

        api.extendPromise = provider.extendPromise;

        return api;
    }];
});

angular.module('app.services').factory('unique',["localStorage", function(
    localStorage
) {

    if (window.device) {
        return window.device.platform.toLowerCase() + '-' + window.device.uuid;
    }
    else {
        var unique = localStorage.get('unique');

        if (unique) {
            return unique;
        }
        else {
            unique = createUnique();
            localStorage.set('unique', unique);
            return unique;
        }
    }

    // 创建一个标识码
    function createUnique() {
        var now = new Date();

        return 'custom-'
            + now.getFullYear()
            + fill((now.getMonth() + 1), 2)
            + fill(now.getDate(), 2)
            + fill(now.getHours(), 2)
            + fill(now.getMinutes(), 2)
            + fill(now.getSeconds(), 2)
            + fill(now.getMilliseconds(), 3)
            + Math.random().toFixed(20).substring(2);  // 20 位随机码
    }

    // 将所传入的数字转换为字符串，若字符串的长度小于所指定的长度，则在起始位置以数字 「0」 补足长度。
    // 最多支持 5 位补足长度。
    function fill(number, length) {
        var str = number.toString(),
            filler = '00000';

        if (str.length < length) {
            str = filler.substring(0, length - str.length) + str;
        }

        return str;
    }
}]);

/**
 * toast - 显示一个消息提示框
 *
 * - 支持一定时间后自动隐藏
 * - 支持手动隐藏
 *
 *
 * ## 配置对象
 *
 * - template    {String|Element|jQuery}  模板
 * - templateUrl {String}                 模板 URL
 * - customClass {String}                 自定义类名，多个类名之间使用空格字符进行区分
 * - duration    {Integer}                显示持续时间，到时间后自动隐藏；如果为 0，则根据显示内容自动计算一个时间，如果为 -1，则不自动隐藏。
 * - delay       {Integer}                延迟显示时间，当调用 open 方法时会延迟该指定时间才会显示，若在这段时间之内调用了 close 方法，则不再显示。
 * - position    {"center"|"bottom"}      显示位置
 * - offset      {Integer}                位置偏移
 * - penetrate   {Boolean}                指针是否穿透 toast；如果设置为 false，则在 toast 显示时，用户不能进行任何操作，直到 toast 被隐藏。
 * - callbacks   {Object}                 回调函数
 *   - close     {Function}               关闭时的回调函数
 */
angular.module('app.services').factory('toast', ["$ionicTemplateLoader", "$ionicBody", "$q", "$timeout", "$compile", function(
    $ionicTemplateLoader, $ionicBody, $q, $timeout, $compile
) {

    var

    DURATIONS = {
        short: 2000,
        long: 6000
    },

    // toast 的 HTML 模板
    TOAST_TPL =
        '<div class="toast-container">' +
        '<div class="toast"></div>' +
        '</div>',

    // 定位设置
    OFFSET = {
        bottom: function(element, offset) {
            element.data('toast-original-bottom', element.css('bottom'));
            element.css('bottom', offset);
        },
        center: _.noop
    },

    // 清除定位设置
    CLEAR_OFFSET = {
        bottom: function(element, offset) {
            element.css('bottom', element.data('toast-original-bottom'));
            element.removeData('toast-original-bottom');
        },
        center: _.noop
    },

    // 默认配置
    DEFAULT_OPTIONS = {
        template: 'toast',
        position: 'bottom',
        offset: 80,
        penetrate: true
    };


    function Toast(options) {
        this._setOptions.apply(this, arguments);
        this._defaultOptions = this._options;
    }

    _.assign(Toast.prototype, {
        // 是否创建
        isCreate: false,

        // 是否打开
        isOpen: false,

        // 是否关闭
        isClose: true,

        // 当前配置
        _options: undefined,

        // 上一次打开时的配置
        _lastOptions: undefined,

        // 在创建对象时指定的默认配置
        _defaultOptions: undefined,

        // 自动关闭倒计时
        _durationTimer: undefined,

        // 延迟显示倒计时
        _delayTimer: undefined,

        _promise: undefined,

        /**
         * 设置 options 对象
         */
        _setOptions: function() {
            var options = this.processingOptions.apply(this, arguments) || angular.extend({}, DEFAULT_OPTIONS);

            this._lastOptions = this._options;
            this._options = options;

            return this._options;
        },

        /**
         * 根据所传入的内容，生成一个合法的配置对象
         * * 该方法提供给 toast 的扩展组件使用
         */
        processingOptions: function() {
            var options = [];

            angular.forEach(Array.prototype.slice.call(arguments, 0), function(option) {
                if (option == null) { return; }

                // "toast.open('toast text')"  equals "toast.open({ template: 'toast text' })"
                if ( _.isString(option) ) {
                    option = { template: option };
                }

                // 处理显示持续时间，若指定模板内容，则根据模板内容自动计算该时间
                if (!option.duration && option.template) {
                    option.duration = computationReadTime(option.template, DURATIONS.short, DURATIONS.long);
                }

                options.push(option);
            });

            if (options.length) {
                options.unshift({}, DEFAULT_OPTIONS, this._defaultOptions);
                return angular.extend.apply(angular, options);
            }
            else {
                return undefined;
            }
        },

        /**
         * 创建 toast 结构
         */
        _create: function() {
            var self = this;

            if (self._toastContainer) {
                return $q.when(self._toastContainer);
            }
            else if (this._promise) {
                return this._promise;
            }
            else {
                return this._promise = $ionicTemplateLoader.compile({
                    template: TOAST_TPL,
                    appendTo: $ionicBody.get()
                })
                .then(function(toastContainer) {
                    self.isCreate = true;
                    self._toastContainer = toastContainer;
                    toastContainer.toastElement = toastContainer.element.children();

                    return toastContainer;
                });
            }
        },

        /**
         * 基于当前的 options 对象，更新 toast
         */
        _update: function(toastContainer) {
            var lastOptions = this._lastOptions,
                options     = this._options,

                container   = toastContainer.element,
                toast       = toastContainer.toastElement,

                templatePromise;

            if (lastOptions) {
                container.removeClass(lastOptions.customClass);
                container.removeClass(lastOptions.position);
                CLEAR_OFFSET[lastOptions.position](toast, lastOptions.offset);
            }

            container.addClass(options.customClass);
            container.addClass(options.position);
            OFFSET[options.position](toast, options.offset);

            templatePromise = options.templateUrl ?
                $ionicTemplateLoader.load(options.templateUrl) :
                $q.when(options.template || '');

            return this._promise = templatePromise.then(function(template) {
                if (template) {
                    toast.empty().append(template);
                    $compile(toast.contents())(toastContainer.scope);
                }

                return toastContainer;
            });
        },

        /**
         * 显示 toast，toast 支持重复打开，并在每次打开时传入不同的配置。
         * options* {String|Object} 若为字符串，则视为显示内容；可传入多个配置参数，后传入的会覆盖前面的。
         *
         * @example
         *
         *     // 显示一条提示信息，并在一定时间后关闭
         *     toast.open('toast text');
         *
         *     // 显示一条提示信息，并在 1 秒后关闭
         *     toast.open('toast text', { duration: 1000 });
         *
         *     // 与上面相同
         *     toast.open({
         *         template: 'toast text',
         *         duration: 1000
         *     });
         */
        open: function(options) {
            var self = this;

            options = self._setOptions.apply(self, arguments);

            self._clearDelayTimer();
            self._clearDurationTimer();

            self.isOpen = true;
            self.isClose = false;

            self._create()
                .then(angular.bind(self, self._update))
                .then(function(toastContainer) {
                    if (self.isClose) { return; }

                    if (options.delay > 0) {
                        self._delayShow(options.delay, toastContainer);
                    }
                    else {
                        self._show(toastContainer);
                    }
                });
        },

        _delayShow: function(delay, toastContainer) {
            var self = this;

            self._delayTimer = $timeout(function() {
                self._show(toastContainer);
                self._delayTimer = undefined;
            }, delay);
        },

        _show: function(toastContainer) {
            var self = this,
                options = this._options;

            if (self.isClose) { return; }

            ionic.requestAnimationFrame(function() {
                if (self.isClose) { return; }

                toastContainer.element.addClass('visible');
                toastContainer.element.toggleClass('toast-container-penetrate', options.penetrate);
                toastContainer.toastElement.addClass('active');
            });

            if (options.duration !== -1) {
                self._durationTimer = $timeout(function() {
                    self.close();
                    self._durationTimer = undefined;
                }, options.duration);
            }
        },

        /**
         * 关闭 toast
         */
        close: function() {
            var self = this,
                options = this._options;

            if (self.isClose) { return; }

            self.isOpen = false;
            self.isClose = true;

            self._clearDelayTimer();
            self._clearDurationTimer();

            self._promise.then(function(toastContainer) {
                ionic.requestAnimationFrame(function() {
                    if (self.isClose) {
                        toastContainer.toastElement.removeClass('active');

                        var duration = parseCSSTimeValue(toastContainer.toastElement.css('animation-duration')) ||
                                parseCSSTimeValue(toastContainer.toastElement.css('transition-duration'));

                        setTimeout(function() {
                            self.isClose && toastContainer.element.removeClass('visible');
                        }, duration);
                    }
                });
            });

            if (options.callbacks && options.callbacks.close) {
                options.callbacks.close();
            }
        },

        _clearDurationTimer: function() {
            if (this._durationTimer) {
                $timeout.cancel(this._durationTimer);
                this._durationTimer = undefined;
            }
        },

        _clearDelayTimer: function() {
            if (this._delayTimer) {
                $timeout.cancel(this._delayTimer);
                this._delayTimer = undefined;
            }
        }
    });

    var defaultToast = new Toast();

    _.forEach(['open', 'close'], function(methodName) {
        Toast[methodName] = function() {
            defaultToast[methodName].apply(defaultToast, arguments);
        };
    });

    /**
     * 预估一段文本内容的阅读时间
     * 规则： 按照一秒内阅读 6 个字进行预估
     * Note: 适用于中文环境
     * @param str {String} 待预估的中文文本内容
     * @param minTime {Integer} 最小时间
     * @param maxTime {Integer} 最大时间
     * @return {Number} 毫秒值
     */
    function computationReadTime(str, minTime, maxTime) {
        str = str || '';
        minTime = parseInt(minTime, 10) || -Infinity;
        maxTime = parseInt(maxTime, 10) || Infinity;

        return Math.min(Math.max(minTime, (str.length / 6) * 1000), maxTime);
    }

    /**
     * 解析 CSS 的时间属性值
     */
    function parseCSSTimeValue(timeValue) {
        var time;

        if (timeValue.indexOf('ms') !== -1) {
            time = parseInt(timeValue);
        }
        else {
            time = parseFloat(timeValue) * 1000;
        }

        return time;
    }

    return Toast;
}]);

/**
 * 等待消息的提示框
 */
angular.module('app.services').factory('loading', ["toast", function(
    toast
) {
    var LOADING_ICON = '<ion-spinner icon="ios"></ion-spinner>',

        loadingToast = new toast();

    return {
        /**
         * 打开等待提示框
         *
         * @param text {String} 提示文本
         */
        open: function(customOptions) {
            customOptions = loadingToast.processingOptions.apply(loadingToast, arguments);

            var template = angular.element('<div class="toast-loading"></div>');

            // add loading icon
            template.append('<div class="toast-loading-icon">' + LOADING_ICON + '</div>');

            // add text
            if (customOptions && customOptions.template) {
                template.append('<div class="toast-loading-text">' + customOptions.template + '</div>');
            }

            var loadingOptions = {
                template: template,
                position: 'center',
                offset: 0,
                duration: -1,
                penetrate: false
            };

            loadingToast.open(customOptions, loadingOptions);
        },

        /**
         * 关闭等待提示框
         */
        close: function() {
            loadingToast.close();
        }
    };
}]);

/**
 * 一个通用的历史记录器
 *
 * ## 历史节点
 *
 * 历史记录器内维护一组历史节点对象，
 * 节点对象内包含一个 `$id` 属性，表示该节点的 ID，该 ID 值为常量，永不可变。
 * 并包含 `$nextNode` 及 `$prevNode` 两个属性，分别表示当前节点的下一个节点及上一个节点，
 * 通过这两个属性以形成一个链表结构。若 `$nextNode` 为空，则表示该节点为最后一个节点，
 * 同样，若 `$prevNode` 为空则表示该节点为第一个节点。
 *
 * 另外，节点对象内包含一个隐藏属性 `$__history__`，指向该节点所在的历史记录器，该属性不可被外部调用。
 *
 * 在历史记录器内部，会维护一个索引表 `indexList`，该索引表中以节点的 ID 为索引值存储当前历史记录器内所维护的所有历史节点。
 * 并有一个 `firstNode` 属性存放节点链表中的第一个节点，以及一个 `lastNode` 属性存放最后一个节点。
 *
 * @example
 *
 *     function(History) {
 *         var history = new History();
 *     }
 */
angular.module('app.services').service('History', function() {
    // 一个计数器，用于生成历史节点的 ID，因为 count 是全局的，因此历史节点的 ID 也是全局唯一的。
    var count = 0;

    function History() {
        // 一个查询表，记录所有的历史节点，以历史节点的 id 为索引值
        this.indexList = {};

        // 历史节点链中的第一个节点
        this.firstNode = undefined;

        // 历史节点链中的最后一个节点
        this.lastNode = undefined;

        // 当前节点
        this.currentNode = undefined;
    }

    _.assign(History.prototype, {

        /**
         * 从当前历史记录中移除所传入的节点
         * @param flag {*} 节点标记；若为数字，则视为节点 ID，否则一律视为节点对象
         */
        remove: function(flag) {
            var node = this._getNode(flag);

            var history = node.$__history__,
                prevNode = node.$prevNode,
                nextNode = node.$nextNode;

            node.$prevNode = undefined;
            node.$nextNode = undefined;
            node.$__history__ = undefined;
            delete history.indexList[node.$id];

            if (prevNode) {
                prevNode.$nextNode = nextNode;
            }
            else {
                history.firstNode = nextNode;
            }

            if (nextNode) {
                nextNode.$prevNode = prevNode;
            }
            else {
                history.lastNode = prevNode;
            }

            if (history.currentNode === node) {
                // TODO: 这里修改了当前节点，但却没有发出通知
                history.currentNode = nextNode || prevNode || undefined;
            }
        },

        /**
         * 插入历史节点
         */
        insertBefore: function(node, referenceNodeFlag) {
            node = createNode(node);

            // 获取参照节点
            var referenceNode = this._getNode(referenceNodeFlag);

            if (!referenceNode) {
                throw '参照节点不在该历史记录器中';
            }

            // 如果待插入的节点不归当前历史记录器所管理，则先将其从其所在的历史记录器中删除
            if (!this.indexList[node.$id]) {
                node.$__history__ && node.$__history__.remove(node);
            }

            // 将待插入节点放入当前历史记录器中
            node.$__history__ = this;
            this.indexList[node.id] = node;

            // 插入历史节点
            var prevNode = referenceNode.prevNode;

            if (prevNode) {
                prevNode.$nextNode = node;
                node.$prevNode = prevNode;
            }
            else {
                this.firstNode = node;
            }

            referenceNode.$prevNode = node;
            node.$nextNode = referenceNode;
        },

        /**
         * 将某个节点插入到当前历史记录链的末尾，作为最后一个节点
         * @param node {Object} 待插入的节点
         */
        appendNode: function(node) {
            node = createNode(node);

            // 如果待插入的节点不归当前历史记录器所管理，则先将其从其所在的历史记录器中删除
            if (!this.indexList[node.$id]) {
                node.$__history__ && node.$__history__.remove(node);
            }

            // 将待插入节点放入当前历史记录器中
            node.$__history__ = this;
            this.indexList[node.$id] = node;

            // 将当前的最后一个节点作为待插入节点的上一个节点
            var prevNode = this.lastNode;

            if (prevNode) {
                prevNode.$nextNode = node;
                node.$prevNode = prevNode;
            }
            else {
                this.firstNode = node;
            }

            // 将待插入节点作为新的最后一个节点
            this.lastNode = node;
        },

        /**
         * 获取历史节点
         * @param flag {*} 节点标记；若为数字，则视为节点 ID，否则一律视为节点对象
         * @return 若能从当前历史记录链中找到所传入标记代表的节点，则返回该节点，否则返回 undefined。
         */
        _getNode: function(flag) {
            var id, node;

            if (typeof flag === 'object' && flag.$isHistoryNode) {
                node = flag;
                return this.indexList[node.$id] === node ? node : undefined;
            }
            else if (typeof flag === 'number') {
                id = flag;
                return this.indexList[id];
            }
            else if (flag === 'last') {
                return this.lastNode;
            }
            else if (flag === 'first') {
                return this.firstNode;
            }
            else {
                return undefined;
            }
        }
    });

    /**
     * 创建历史节点
     */
    function createNode(node) {
        if (node && node.$isHistoryNode) {
            return node;
        }

        var node = node || {},
            id = count++;

        node.$id = id;              // 节点 ID
        node.$isHistoryNode = true; // 节点标记，用于识别是否是一个历史节点

        return node;
    }

    return History;

});

angular.module('app.services').provider('viewHistory', function() {
    var provider = this;

    /**
     * 最多存储多少个商品，当超出该指定数量时若继续添加，则会移除最早添加的商品
     * 若为 undefined, 则不做限制
     * 默认为 200
     */
    provider.maxStorageNumber = 200;

    // @ngInject
    provider.$get = function(localStorage, api) {
        var LOCAL_STORAGE_KEY = 'history-view-product',
            productList = localStorage.get(LOCAL_STORAGE_KEY, [], true);

        return {
            /**
             * 获取所有本地存储的历史浏览商品
             */
            getAll: function() {
                return productList;
            },

            /**
             * 存储的记录数量
             */
            getCount: function() {
                return productList.length;
            },

            /**
             * 分页加载
             */
            getPage: function(page, pageCount) {
                // -1 因为计数是从1开始的而不是0
                var startIndex = (page - 1) * pageCount;
                var items = _.slice(productList, startIndex, startIndex + pageCount);
                var result = {
                    pageIndex: page,
                    totalItems: productList.length,
                    items: items
                };
                return api.when(result);
            },

            /**
             * 存储一个浏览商品
             */
            add: function(product) {
                if (!product) return;

                // 若待添加的商品已存在，则视为修改其顺序，将其放到最上面
                for (var index in productList) {
                    if (productList[index].productId == product.productId) {
                        productList.splice(index, 1);
                        break;
                    }
                }

                // 若为新添加商品，且当前已超出最大存储数量，则移除最早添加的商品
                if (provider.maxStorageNumber && productList.length >= provider.maxStorageNumber) {
                    productList.pop();
                }

                productList.unshift(product);
                this._storage();
            },

            /**
             * 更新一个商品
             */
            update: function(product) {
                if (!product) return;

                // 找到对应的商品，更新数据
                for (var index in productList) {
                    if (productList[index].productId == product.productId) {
                        productList[index] = product;
                        break;
                    }
                }

                this._storage();
            },

            /**
             * 清空浏览历史记录
             */
                clear: function() {
                productList.splice(0, productList.length);
                this._storage();
            },

            /**
             * 存储当前所有浏览商品
             */
            _storage: function() {
                localStorage.set(LOCAL_STORAGE_KEY, productList);
            }
        };
    };
    provider.$get.$inject = ["localStorage", "api"];
});

/**
 * 本地数据存储操作服务
 *
 * 1. 以 key-value 方式存储
 * 2. 不支持时间等扩展对象
 * 3. 当某个 key 对应的 value 为 undefined 时（不包括 null），视为该条数据不存在。
 */
angular.module('app.services').provider('localStorage', function() {
    var provider = this;

    provider.prefix = 'app-';

    // @ngInject
    provider.$get = function($window) {
        var localStorage = {
            /**
             * 判断数据是否存在
             */
            has: function(key) {
                return !!$window.localStorage[provider.prefix + key];
            },

            /**
             * 设置数据
             */
            set: function(key, value) {
                var uKey = provider.prefix + key;

                if (value !== undefined) {
                    value = JSON.stringify(value);
                    $window.localStorage[uKey] = value;
                }
                else {
                    localStorage.remove(key);
                }

                return this;
            },

            /**
             * 从本地仓库中获取对应的值
             * @param key {String} 要获取的数据的 key
             * @param defVal? {*}  如果所获取的数据不存在，所返回的默认值
             * @param storeDefVal? {*} 如果指定了默认值，是否将其存储到本地仓库中
             */
            get: function(key, defVal, storeDefVal) {
                var uKey = provider.prefix + key,
                    value = $window.localStorage[uKey];

                return value ? JSON.parse(value) :
                    ((storeDefVal && defVal !== undefined && localStorage.set(key, defVal)), defVal);
            },

            /**
             * 移除数据
             */
            remove: function(key) {
                var uKey = provider.prefix + key;
                delete $window.localStorage[uKey];
                return this;
            }
        };

        return localStorage;
    };
    provider.$get.$inject = ["$window"];
});

/**
 * 消息中心，提供一个全消息注册及广播服务，作为各模块之间通信使用，可作为混入类混入 controller 中，
 * 当某一个事件发生后，可使用该消息中心向其它模块广播该消息。
 *
 * @example
 *
 * // 发布消息
 * messageCenter.publishMessage('login', { id: 5277, name: 'biossun' });
 *
 * // 订阅消息
 * messageCenter.subscribeMessage('login', function(event, userData) {
 *     // your codeing in this
 * }, $scope);
 *
 * // 将事件中心混入 controller （或 $scope） 中并订阅消息
 * angular.extend(controller, messageCenter, {
 *     init: function() {
 *         this.subscribeMessage('login', function(event, userData) {
 *             // your coding in this
 *         });
 *     }
 * });
 *
 * controller.init();
 */
angular.module('app.services').factory('messageCenter', ["$rootScope", function($rootScope) {
    return {
        /**
         * 发布消息
         * @param {String} msgName 消息名称
         * @param {String} data* 消息相关数据
         */
        publishMessage: function(msgName, data) {
            $rootScope.$emit(msgName, data);
        },

        /**
         * 订阅消息
         * @param {String|Array<String>} msgName 一个或多个消息名称
         * @param {Function} callback 回调函数
         * @param {Scope} scope 订阅该消息的作用域
         */
        subscribeMessage: function(messageNames, callback, $scope) {
            if (typeof messageNames === 'string') {
                messageNames = [messageNames];
            }

            if ( !($scope && $scope.$on) ) {
                if (this.$on) {
                    $scope = this;
                }
                else if (this.$scope) {
                    $scope = this.$scope;
                }
                else {
                    $scope = $rootScope;
                }
            }

            if ($scope.$$destroyed) {
                return;
            }

            var h = [];

            for (var i = 0; i < messageNames.length; i++) {
                h.push($rootScope.$on(messageNames[i], callback));
            }

            $scope.$on('$destroy', function() {
                for (var i = 0; i < h.length; i++) {
                    h[i]();
                }
            });
        }
    };
}]);

/**
 * 默认的业务操作失败时的处理行为
 */
angular.module('app.services').provider('errorHandling', function() {

    var provider = this;

    /**
     * 根据接口响应的错误信息调用对应的错误处理器，并返回处理器所返回的内容。
     */
    provider.errorAssign = function(data, status, headers, config, designees) {
        function runDesignee(name) {
            return designees[name] && designees[name](data, status, headers, config);
        }

        // 请求终止
        if (status === 0) {
            // 中止标识
            var reason = config.timeout.$$state.value;

            // 取消请求
            if (reason === 'cancel') {
                return runDesignee('cancel');
            }
            // 超时
            else if (reason === 'timeout') {
                return runDesignee('timeout');
            }
            // 网络异常
            else {
                return runDesignee('network');
            }
        }
        // 请求异常
        else if (status < 200 || status >= 300) {
                return runDesignee('http');
        }
        // 业务异常
        else if (data && data.stateCode) {
            // 用户未登录
            if (data.stateCode == APP_STATE_CODE.notLogin) {
                return runDesignee('notLogin');
            }
            // 其它异常
            else {
                return runDesignee('other');
            }
        }
        // 其它异常
        else {
            return runDesignee('other');
        }
    };

    // @ngInject
    provider.$get = function(toast, modals, $translate) {

        function openToast(text) {
            text && toast.open(text);
        }

        // 默认的错误处理操作
        var defaultErrorHandlers = {
            // 处理请求被放弃
            cancel: function(data, status, headers, config, designees) {
                ;
            },

            // 处理网络异常
            network: function(data, status, headers, config, designees) {
                $translate('stateTexts.networkAnomaly').then(function(text) {
                    openToast(text);
                });
            },

            // 请求超时
            timeout: function(data, status, headers, config, designees) {
                $translate('stateTexts.networkAnomaly').then(function(text) {
                    openToast(text);
                });
            },

            // 处理 HTTP 异常
            http: function(data, status, headers, config, designees) {
                $translate('stateTexts.serviceException').then(function(text) {
                    openToast(text);
                });
            },

            // 处理用户未登陆异常
            notLogin: function(data, status, headers, config, designees) {
                modals.login.open();
                openToast(data.message);
            },

            // 处理其它异常操作
            other: function(data, status, headers, config, designees) {
                openToast(data.message);
            }
        };

        // 默认错误处理器
        function errorHandling(data, status, headers, config) {
            provider.errorAssign(data, status, headers, config, defaultErrorHandlers);
        }

        // 自定义错误处理器
        errorHandling.custom = function(errorHandlers) {
            errorHandlers = _.merge({}, defaultErrorHandlers, errorHandlers);

            return function errorHandling(data, status, headers, config) {
                provider.errorAssign(data, status, headers, config, errorHandlers);
            };
        };

        return errorHandling;
    };
    provider.$get.$inject = ["toast", "modals", "$translate"];
});

/**
 * 一个通用的数据加载混入模块，支持分页功能。
 *
 * 所混入的目标对象中应提供一个 loadData 方法用于加载所需数据，
 * 而如果需要支持分页，则请提供一个 loadPage 方法；如果 loadData 及 loadPage 同时存在，则优先使用 loadPage 方法。
 *
 * 无论 loadData 还是 loadPage，都应在调用后返回一个 promise 对象。
 * 其中，loadPage 需要接收两个参数：pageIndex 及 itemsPerPage，
 * pageIndex 表示需要加载的分页的页码（第一页为 1），而 itemsPerPage 表示分页的大小（默认为 10）；
 * 同时，loadPage 方法应保证所返回的数据中具有如下几个属性：
 *
 *   {
 *       totalItems: 总条目数，Integer
 *       pageIndex: 所返回分页的页码，第一页为 1，Integer
 *       items: 分页数据，Array
 *   }
 *
 * 另外，loadData 及 loadPage 都可接收一个额外的参数：attrs。
 * 该参数为一个配置对象，用于为加载操作提供一些数据。
 *
 * 最后，如果该混入模块所混入的对象不是 $scope，则该对象中需要提供一个 $scope 属性。
 *
 *
 * ## 加载事件
 *
 * 可以在被混入对象中提供一个 loadBefore 方法，该方法会在每一次进行数据加载之前执行，如果该方法返回 false，
 * 则取消加载。
 *
 * 对应的，还可以提供一个 loadAfter 方法，该方法会在数据加载完成并将其放到 data 属性中之后被执行，
 * 可以在该方法中进行一些后续的处理操作。
 *
 * 以上两个方法在被执行时都可以接收一个 configs 参数，其值为进行加载操作时的设置对象。
 *
 *
 * ## abort
 *
 * loadDataMixin 有可能会抛弃当前已发出的请求，比如在数据加载中时执行了 clear 方法。
 * 当请求被抛弃时，promise 会切换为 reject 状态，并只提供一个错误对象 { $aborted: [true|Any for true] }  作为响应，
 * 而并非正常的 "{ data: { error: { code: '01' } } }" 结构。
 * 因此在使用 loadDataMixin 并处理 rejected 状态时，请务必注意这一点。
 *
 * @example:
 *   angular.extend(target, loadDataMixin, {
 *     $scope: $scope,
 *
 *     // 加载数据
 *     loadData: function() {},
 *
 *     // 加载分页，若该方法存在，则忽略 loadData 方法，改为使用该方法加载数据。
 *     loadPage: function(pageIndex, itemsPerPage) {}
 *   });
 */
angular.module('app.services').factory('loadDataMixin', ["$timeout", "$ionicScrollDelegate", "loading", "errorHandling", "utils", function(
    $timeout, $ionicScrollDelegate, loading, errorHandling, utils
) {

    /**
     * 加载器，用于执行加载操作。
     */
    function Loader(target) {
        if (this.constructor !== Loader) {
            return new Loader(target);
        }
        else {
            this.target = target;
        }
    }

    Loader.prototype = {
        constructor: Loader,

        // 数据加载对象
        target: undefined,

        // 该加载器是否已被销毁
        isDestroy: false,

        // 获取数据操作对应的 promise
        promise: undefined,

        // 在加载数据时显示的提示框
        cmLoading: undefined,

        /**
         * 执行加载器
         *
         * @params
         * @param configs {Object} 加载配置对象
         *
         *   - sign {String}
         *         执行标记，一般为如下几个值：[init, refresh, loadNextPage]，默认为 undefined。
         *
         *   - getPromiseAfterCallback {Function}
         *         该回调函数会在从 loadData 或 loadPage 等数据加载方法中获取到 promise 之后进行调用，
         *         并传入获取到的 promise，该函数应返回一个新的 promise 以供后续使用，若不返回，则继续使用所传入的 promise。
         *
         *   - showLoading {Boolean}
         *         在加载时是否显示加载中标记，默认为 true
         *
         *   - loadAttrs {Object}
         *         传递给数据加载方法的配置对象
         *
         * @params
         * @param getPromiseAfterCallback {Function} _参照 configs 中的 getPromiseAfterCallback 属性的相关说明_
         */
        run: function(param) {
            if (this.isDestroy) return false;

            var self = this,
                target = self.target,
                configs = {
                    showLoading: true,
                    loadAttrs: {}
                },
                result;

            if (typeof param === 'function') {
                configs.getPromiseAfterCallback = param;
            }
            else if (typeof param === 'object') {
                _.merge(configs, param);
            }

            // 调用加载前回调函数，如果回调函数返回 false，则取消加载。
            if (_.isFunction(target.loadBefore)) {
                result = target.loadBefore(configs);

                if (result === false) {
                    return result;
                }
            }

            target.isLoading = configs.type || true;

            // 显示加载中标记
            if (configs.showLoading) {
                loading.open();
            }

            var fulfilled = _.bind(self.fulfilled, self, configs),
                rejected = _.bind(self.rejected, self, configs),
                fin = _.bind(self.finally, self, configs),
                promise;

            // 如果是分页，则加载下一页
            if (target.isPaging) {
                promise = target.loadPage(target.nextPageIndex, target.itemsPerPage, configs.loadAttrs);
            }
            // 否则按照普通数据进行加载
            else {
                promise = target.loadData(configs.loadAttrs);
            }

            // 修改是否加载失败的状态
            promise = promise.success(function() {
                target.isFailed = false;
            }).error(function() {
                target.isFailed = configs.type;
            });

            if (configs.getPromiseAfterCallback) {
                promise = configs.getPromiseAfterCallback(promise) || promise;
            }

            self.promise = promise = promise.then(fulfilled, rejected).finally(fin);

            return promise;
        },

        // 加载成功
        fulfilled: function(configs, response) {
            if (this.isDestroy) return response;

            // 预先取出之后需要用到的数据
            var self   = this,
                target = self.target,
                data   = response.data;

            if (target.isPaging) {
                fulfilledPage();
            }
            else {
                fulfilledData();
            }

            // 待页面刷新完成后，刷新状态
            $timeout(function() {
                $ionicScrollDelegate.resize();
                if (self.target) {
                    self.target.isLoading = false;
                    self.target._canLoadNextPage();
                }
            }, 400);

            return response;

            // 处理分页数据
            function fulfilledPage() {
                // 每一次分页加载完成后，都重置并重新计算当前分页的相关信息
                target.isFirstPage = false;
                target.isLastPage = false;

                target.data = target.data || {};
                data = data || {};

                if (data.pageIndex == null) {
                    // TODO: 应该有一个警告器
                    window.console && console.warn('[loadDataMixin] 所返回分页数据中没有 pageIndex 属性，已默认视为第一页。');
                    data.pageIndex = 1;
                }

                if (data.totalItems == null) {
                    // TODO: 应该有一个警告器
                    window.console && console.warn('[loadDataMixin] 所返回分页数据中没有 totalItems 属性。');
                }

                if (data.items == null) {
                    // TODO: 应该有一个警告器
                    window.console && console.warn('[loadDataMixin] 所返回分页数据中没有 items 属性。');
                }

                // 如果页码为 1，或没有提供页码，则视为第一页
                if (data.pageIndex === 1) {
                    target.isFirstPage = true;
                }

                // 如果 items 不存在，或者 items 里的条目数量小于分页指定条目数时，则视为已加载至最后一页
                // 修正 增加条件 data.items.length == data.total  解决上面的问题
                if (!data.items || data.items.length < target.itemsPerPage || data.items.length == data.total) {
                    target.isLastPage = true;
                }

                target.totalItems = data.totalItems;
                target.pageIndex = data.pageIndex;
                target.nextPageIndex = (target.pageIndex - 0) + 1;

                var nowItems = target.data.items,
                    newItems = _.union(nowItems, data.items);

                _.assign(target.data, data, {
                    items: newItems
                });
            }

            // 处理普通数据
            function fulfilledData() {
                target.data = data;
            }
        },

        rejected: function(configs, response) {
            if (!this.isDestroy) {
                errorHandling(response);
                this.target.isLoading = false;
                this.target.canLoadNextPage = false;
            }

            throw response;
        },

        finally: function(configs) {
            if (this.isDestroy) return;

            var self = this,
                target = self.target;

            loading.close();

            // 调用加载完成后的回调函数
            if (_.isFunction(this.target.loadAfter)) {
                target.loadAfter(configs);
            }

            this.promise = undefined;
        },

        destroy: function() {
            if (this.promise) {
                this.promise.cancel();
            }

            loading.close();

            this.target = undefined;
            this.isDestroy = true;
        }
    };

    var mixin = {
        // 对对应的 $scope
        $scope: undefined,

        // 加载器
        loader: undefined,

        // 存放数据
        data: undefined,

        // 是否支持分页
        isPaging: false,

        // 是否加载中，如果在执行加载器时传入的配置对象中有一个 type 属性，且其值等于 true，则 isLoading 为该属性值，
        // 否则 isLoading 为 true，当数据加载完成后，该值为 false。
        isLoading: false,

        // 最近一次的数据加载操作是否失败，如果在执行加载器时传入的配置对象中有一个 type 属性，且其值等于 true，则 isFailed 为该属性值，
        // 否则 isLoading 为 true，当最近一次的数据加载成功后，该值为 false。
        isFailed: false,

        // 是否可加载下一页
        canLoadNextPage: false,

        // 当前结果集中的条目数
        currentItemCount: undefined,
        // 总条目数
        totalItems: undefined,

        // 总页数
        totalPages: undefined,
        // 每一页的设定大小
        itemsPerPage: 12,
        // 当前页页码，第一页为 1
        pageIndex: undefined,
        // 下一页页码
        nextPageIndex: 1,

        // 是否是第一页
        isFirstPage: undefined,
        // 是否是最后一页
        isLastPage: undefined,

        /**
         * 初始化，第一次加载时使用；
         * 该方法可以重复调用，但和 refresh 不同的是，重复调用 init 方法会立刻清除当前所有的数据及已发出的请求，
         * 另外它也不支持页面的刷新功能如 ion-refresher 指令。
         */
        init: function(options) {
            var self = this;

            self.clear();

            if (typeof self.$new === 'function' && typeof self.$destroy === 'function') {
                this.$scope = self;
            } else if(self.$scope === undefined) {
                window.console && console.warn('[loadDataMixin] 初始化数据中未包含$scope。');
            }

            if (typeof self.loadPage === 'function') {
                self.isPaging = true;
            }

            self.data = undefined;
            self.loader = Loader(self);

            options = _.merge( { type: 'init' }, options );

            self.loader.run(options).finally(function() {
            });

            self.$scope && self.$scope.$on("$destroy", function() {
                self.clear();
                self.$scope = undefined;
            });

            // 调用 start 方法，执行被混入对象自己的初始化操作
            if (typeof self.start === 'function') {
                self.start();
            }
        },

        /**
         * 每一次执行数据加载操作前的回调函数，如果该函数返回 false，则取消加载。
         */
        loadBefore: _.noop,

        /**
         * 每一次完成数据加载后都会调用该方法。
         */
        loadAfter: _.noop,

        /**
         * 加载下一页的数据
         */
        loadNextPage: function(options) {
            var self = this;

            if (self.canLoadNextPage) {
                self.loader.run({
                    showLoading: false
                })
                .finally(function() {
                    clear();
                });
            }
            else {
                clear();
            }

            function clear() {
                self.$scope && self.$scope.$broadcast('scroll.infiniteScrollComplete');
            }
        },

        /**
         * 判断是否可加载下一页
         */
        _canLoadNextPage: function() {
            this.canLoadNextPage = !this.isLoading && this.data && this.isPaging && !this.isLastPage;
        },

        /**
         * 刷新数据， 重新加载数据
         */
        refresh: function(options) {
            var self = this;

            if (this.isLoading) { clear(); }

            options = _.merge({
                type: 'refresh',
                emptyData: true,
                getPromiseAfterCallback: function(promise) {
                    return promise.finally(function() {
                        if (options.emptyData) {
                            utils.empty(self.data);
                        };
                        clear();
                    });
                }
            }, options);

            self.nextPageIndex = 1;

            this.loader.run(options);

            function clear() {
                self.$scope && self.$scope.$broadcast('scroll.refreshComplete');
            }
        },

        /**
         * 是否有有效数据
         * - 当为 undefined 时，尚未进行加载操作，
         * - 当为 true 时，具有有效数据，
         * - 当为 false 时，已进行数据加载，但所返回数据为空。
         * TODO: 现在有可能在使用 loadData 方式加载数据时，有可能后台返回 undefined。
         */
        hasData: function() {
            if (this.data == undefined) {
                return undefined;
            }
            else {
                if (this.isPaging) {
                    return !!(this.data.items && this.data.items.length);
                }
                else {
                    return !( _.isEmpty(this.data) );
                }
            }
        },

        /**
         * 清除数据，当调用该方法后，必须再次调用 init 方法以加载数据。
         */
        clear: function() {
            this.loader && this.loader.destroy();

            _.assign(this, {
                loader: undefined,
                data: undefined,
                isPaging: false,
                isLoading: false,
                isFailed: false,
                canLoadNextPage: false,
                currentItemCount: undefined,
                totalItems: undefined,
                totalPages: undefined,
                pageIndex: undefined,
                nextPageIndex: 1,
                isFirstPage: undefined,
                isLastPage: undefined
            });
        }
    };

    return mixin;
}]);

angular.module('app.services').provider('searchHistory', function() {
    var provider = this;

    /**
     * 最多存储多少个关键字，当超出该指定数量时若继续添加，则会移除最早添加的关键字
     * 若为 undefined, 则不做限制
     * 默认为 200
     */
    provider.maxStorageNumber = 200;

    // @ngInject
    provider.$get = function(localStorage) {
        var LOCAL_STORAGE_KEY = 'history-search-keywords',
            keywords = localStorage.get(LOCAL_STORAGE_KEY, [], true);

        return {
            /**
             * 获取所有本地存储的历史搜索关键字
             */
            getAll: function() {
                return keywords;
            },

            /**
             * 存储一个搜索关键字
             */
            add: function(keyword) {
                keyword = _.trim(keyword);

                if (!keyword) return;

                var index = _.indexOf(keywords, keyword);

                // 若待添加的关键字已存在，则视为修改其顺序，将其放到最上面
                if (index !== -1) {
                    keywords.splice(index, 1);
                }
                // 若为新添加关键字，且当前已超出最大存储数量，则移除最早添加的关键字
                else if (provider.maxStorageNumber && keywords.length >= provider.maxStorageNumber) {
                    keywords.pop();
                }

                keywords.unshift(keyword);
                this._storage();
            },

            /**
             * 清空搜索历史记录
             */
            clear: function() {
                keywords.splice(0, keywords.length);
                this._storage();
            },

            /**
             * 存储当前所有搜索关键字
             */
            _storage: function() {
                localStorage.set(LOCAL_STORAGE_KEY, keywords);
            }
        };
    };
    provider.$get.$inject = ["localStorage"];
});

/**
 * 提供常用的文本校验方法
 */
angular.module("app.services").factory("validator",function() {

	return {

		// 是否为邮箱
		isEmail:function(text) {
			//邮箱正则
        	var emailReg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        	return  emailReg.test(text);
		},

		// 是否为手机
		isMobile:function(text) {
			//手机正则
        	var mobileReg = /^1\d{10}$/i;
        	return mobileReg.test(text);
		},

		// 非法字符检测
		isSecurity: function(text) {
			var reg= /select|update|delete|exec|count|’|'|"|=|;|>|<|%/i;
			return !reg.test(text);
		}
	}
});

/**
 * resize、scroll等频繁触发页面回流的操作要进行函数节流
 * fn               Function        需要节流的方法
 * delay            Integer         方法调用延迟，在延迟内的重复调用会清除前一次调用
 * mustRunDelay     Integer         初次调用延迟多少毫秒后方法必定被调用
 */

 angular.module('app.services').factory('throttle', ["$ionicPopup", "$translate", function(
     $ionicPopup, $translate
 ) {
     return {
         // 生成包装方法
         createHandler: function throttle(fn, delay, mustRunDelay){
             var timer = null,
                 start = null;
             return function() {
                 var context = this,
                     current = +new Date(),
                     _arguments = arguments;
                 clearTimeout(timer);

                 if(!start){
                     start = current;
                 }
                 if(current - start >= mustRunDelay){
                     fn.apply(context, _arguments);
                     start = current;
                 }
                 else {
                     timer = setTimeout(function() {
                         fn.apply(context, _arguments);
                         start = null;
                     }, delay);
                 }
             };
         }
     };
 }]);

/**
 * 通用提示框和确认对话框
 */
angular.module('app.services').factory('popup', ["$ionicPopup", "$translate", function (
    $ionicPopup, $translate
) {
    return {
        // 提示框
        alert: function (content) {
            return $ionicPopup.alert({
                title: $translate.instant('popup.title'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.ok')
            });
        },

        // 确认对话框
        confirm: function (content) {
            return $ionicPopup.confirm({
                title: $translate.instant('popup.title'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.confirm'),
                cancelText: $translate.instant('popup.cancel')
            });
        },

        // 版本更新确认对话框
        updateConfirm: function (content) {
            return $ionicPopup.confirm({
                title: $translate.instant('popup.updateTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.updateConfirm'),
                cancelText: $translate.instant('popup.cancel')
            });
        },
        // 提示框
        updateAlert: function (content, url) {
            return $ionicPopup.alert({
                title: $translate.instant('popup.updateTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.updateConfirm'),
                okType: 'button-primary'
            });
        },

        // 输入框
        input: function ($scope, title, subTitle) {
            $scope.popupData = {};
            return $ionicPopup.show({
                template: '<input type="text" class="tc" autofocus="autofocus" ng-model="popupData.content">',
                title: title,
                subTitle: subTitle,
                scope: $scope,
                buttons: [{
                    text: $translate.instant('popup.cancel'),
                    type: 'button-default',
                    onTap: function (e) {

                    }
                }, {
                    text: $translate.instant('popup.confirm'),
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.popupData.content) {
                            return false;
                        } else {
                            return $scope.popupData.content;
                        }
                    }
                }]
            });
        },

        // 推送消息提示
        notificationAlert: function (content) {
            return $ionicPopup.alert({
                title: $translate.instant('popup.notificationTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.ok'),
                okType: 'button-primary',
            });
        },

        // 推送消息确认
        notificationConfirm: function (content) {
            return $ionicPopup.confirm({
                title: $translate.instant('popup.notificationTitle'),
                template: $translate.instant(content),
                okText: $translate.instant('popup.check'),
                okType: 'button-primary',
                cancelText: $translate.instant('popup.cancel')
            });
        },
    };
}]);

/**
 * ================== angular-ios9-uiwebview.patch.js v1.1.1 ==================
 *
 * This patch works around iOS9 UIWebView regression that causes infinite digest
 * errors in Angular.
 *
 * The patch can be applied to Angular 1.2.0 – 1.4.5. Newer versions of Angular
 * have the workaround baked in.
 *
 * To apply this patch load/bundle this file with your application and add a
 * dependency on the "ngIOS9UIWebViewPatch" module to your main app module.
 *
 * For example:
 *
 * ```
 * angular.module('myApp', ['ngRoute'])`
 * ```
 *
 * becomes
 *
 * ```
 * angular.module('myApp', ['ngRoute', 'ngIOS9UIWebViewPatch'])
 * ```
 *
 *
 * More info:
 * - https://openradar.appspot.com/22186109
 * - https://github.com/angular/angular.js/issues/12241
 * - https://github.com/driftyco/ionic/issues/4082
 *
 *
 * @license AngularJS
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */
angular.module('ngIOS9UIWebViewPatch', ['ng']).config(["$provide", function($provide) {
    'use strict';
    $provide.decorator('$browser', ["$delegate", "$window", function($delegate, $window) {
        if (isIOS9UIWebView($window.navigator.userAgent)) {
            return applyIOS9Shim($delegate);
        }
        return $delegate;

        function isIOS9UIWebView(userAgent) {
            return /(iPhone|iPad|iPod).* OS 9_\d/.test(userAgent) && !/Version\/9\./.test(userAgent);
        }

        function applyIOS9Shim(browser) {
            var pendingLocationUrl = null;
            var originalUrlFn = browser.url;
            browser.url = function() {
                if (arguments.length) {
                    pendingLocationUrl = arguments[0];
                    return originalUrlFn.apply(browser, arguments);
                }
                return pendingLocationUrl || originalUrlFn.apply(browser, arguments);
            };
            window.addEventListener('popstate', clearPendingLocationUrl, false);
            window.addEventListener('hashchange', clearPendingLocationUrl, false);

            function clearPendingLocationUrl() {
                pendingLocationUrl = null;
            }
            return browser;
        }
    }]);
}]);

/**
 * 摄像头辅助
 * 返回的图片都是base64 DATA_URL
 * 因为这样可以兼容所有设备
 */
angular.module('app.services')
    .factory('camera', ["api", "$ionicActionSheet", "$translate", function (api, $ionicActionSheet, $translate) {

        return {
            // 上传用户头像
            getPicture: function (width, height) {
                if (!navigator.camera) {
                    return api.reject(false, $translate.instant("camera.openCameraFailure"));
                }
                var deferred = api.defer();
                var buttons = [{
                    type: Camera.PictureSourceType.CAMERA,
                    text: '<span class="action-sheet-text">' +
                        $translate.instant("camera.shoot") +
                        '</span>'
                }, {
                    type: Camera.PictureSourceType.PHOTOLIBRARY,
                    text: '<span class="action-sheet-text">' +
                        $translate.instant("camera.uploadByPhoto") +
                        '</span>'
                }];
                $ionicActionSheet.show({
                    buttons: buttons,
                    titleText: $translate.instant('camera.title'),
                    cancelText: $translate.instant('camera.cancel'),
                    buttonClicked: function (index) {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: width,
                            targetHeight: height,
                            correctOrientation: true,
                            allowEdit: true,
                            sourceType: buttons[index].type
                        };
                        navigator.camera.getPicture(onSuccess, onError, options);

                        function onSuccess(imageData) {
                            var imageDataURI = "data:image/jpeg;base64," + imageData;
                            deferred.resolve({
                                data: imageDataURI
                            });
                        }

                        function onError(data) {
                            deferred.reject(false, data);
                        }

                        return true;
                    }
                });

                return deferred.promise;
            }
        };
    }]);

/**
 * 上传图片
 * 支持本地文件路径和DATA_URI
 */
angular.module('app.services')
    .factory('uploadImage', ["api", function (api) {

        return {

            // 选择图片 返回base64数据
            upload: function (serviceUrl, imageDataURI, params) {
                if (!FileTransfer) {
                    return api.reject(false, "FileTransfer is undefined");
                }
                var deferred = api.defer();
                var transfer = new FileTransfer();
                var options = new FileUploadOptions();
                options.fileKey = 'file';
                options.fileName = 'upload.jpg';
                options.mimeType = 'image/jpeg';
                options.params = params || {};
                options.headers = {
                    appkey: APP_CONFIG.appkey,
                    os: APP_CONFIG.os,
                    osVersion: APP_CONFIG.osVersion,
                    appVersion: APP_CONFIG.appVersion,
                    unique: APP_CONFIG.unique,
                    channel: APP_CONFIG.channel,
                    subsiteId: APP_CONFIG.subsiteId,
                    language: APP_CONFIG.language,
                    userid: APP_USER.id,
                    userSession: APP_USER.userSession
                };

                transfer.upload(imageDataURI, serviceUrl,
                    function (data) {
                        var response = JSON.parse(data.response);
                        if (response.stateCode !== 0) {
                            deferred.reject(false, response);
                        } else {
                            deferred.resolve(response);
                        }
                    },
                    function (data) {
                        var response = JSON.parse(data.response);
                        deferred.reject(false, response);
                    }, options);

                return deferred.promise;
            }
        };
    }]);

/**
 * 极光推送
 */
angular.module('app.services')
    .factory('jPushService', ["$ionicPlatform", "$rootScope", "stateUtils", "messageCenter", "popup", function($ionicPlatform, $rootScope, stateUtils, messageCenter, popup) {


        var tagsArray = resetTags();

        var info = {
            tags: tagsArray,
            alias: APP_USER.id
        };


        var jPush = null;

        // 处理打开通知数据
        function handleOpenNotificationData(event) {
            if (ionic.Platform.isAndroid()) {
                return handleAndroidData(window.plugins.jPushPlugin.openNotification);
            }
            if (ionic.Platform.isIOS()) {
                return handleiOSData(event);
            }
        }

        // 处理android推送信息数据
        function handleAndroidData (data) {
            var result = {alert: data.alert};
            if (data.extras) {
                result.params = data.extras['cn.jpush.android.EXTRA'];
            }
            return result;
        }

        // 处理ios推送信息数据
        function handleiOSData (data) {
            console.log(data);
            return {
                alert: data.aps ? data.aps.alert : undefined,
                params: data
            };
        }

        // 处理状态转换
        function handleStateChange (data) {
            var params = data ? data.params : {};

            if (params.state) {
                switch (params.state.toLowerCase()) {
                    case 'productinfo':
                        if (params.id && !params.productId) {
                            params.productId = params.id;
                        }
                        stateUtils.goProductInfo(params.productId, params.goodsId, params.title);
                        break;
                    case 'productlist':
                        stateUtils.goProductList({url:params.url}, params.title);
                        break;
                    case 'flashsale':
                        stateUtils.goFlashSale();
                        break;
                    case 'article':
                        stateUtils.goAdvRedirect(params.id, params.title);
                        break;
                    case 'activity':
                        if (params.id && !params.articleId) {
                            params.articleId = params.id;
                        }
                        stateUtils.goActivity(params.articleId, params.title);
                        break;
                    case 'index':
                        stateUtils.goIndex();
                        break;
                }
            }
        }

        // 初始化极光推送
        function init() {
            $ionicPlatform.ready(function() {
                jPush = window.plugins ? window.plugins.jPushPlugin : null;

                if (jPush) {
                    // 处理打开通知
                    document.addEventListener("jpush.openNotification", function(event) {
                        var data = handleOpenNotificationData(event);
                        handleStateChange(data);
                    }, false);

                    if (ionic.Platform.isIOS()) {
                        document.addEventListener("jpush.receiveNotification", function(event) {
                            var data = handleOpenNotificationData(event);
                            if (data.params.state) {
                                popup.notificationConfirm(data.alert)
                                    .then(function(response) {
                                        console.log(response);
                                        if (response) {
                                            handleStateChange(data);
                                        }
                                    });
                            } else {
                                popup.notificationAlert(data.alert);
                            }
                        }, false);
                    }
                    //
                    // document.addEventListener("jpush.receiveMessage", function(event) {
                    // }, false);

                    jPush.setDebugMode(true);
                    jPush.init();
                    var tagsAr = resetTags();
                    jPush.setTags(tagsAr);
                    if (info.alias) {
                        jPush.setAlias(info.alias);
                    }
                    jPush.resetBadge();
                }
            });
        }

        // 重新获得tags信息
        function resetTags() {

            var language = APP_CONFIG.language.replace('-','');

            var tagsArray = [language];
            if (APP_USER && APP_USER.id && APP_USER.cityName) {
                var cityName = APP_USER.cityName.toLowerCase();
                tagsArray.push(cityName);
            }

            return tagsArray;
        }

        messageCenter.subscribeMessage('login', function(event) {
            setTimeout(function() {
                jpushService.setAlias(APP_USER.id);
                var tagsAr = resetTags();
                jpushService.addTag(tagsAr);
            });
        }, $rootScope);

        messageCenter.subscribeMessage('logout', function(event) {
            setTimeout(function() {
                jpushService.setAlias('');
            });
        }, $rootScope);

        messageCenter.subscribeMessage('language.change', function(event) {
            setTimeout(function() {
                resetTags();
                var tagsAr = resetTags();
                jpushService.addTag(tagsAr);
            });
        }, $rootScope);

        var jpushService =  {
            init: init,
            // 设置用户名
            setAlias: function (alias) {
                if (jPush) {
                    info.alias = alias;
                    jPush.setAlias(info.alias);
                }
            },
            // 添加标签
            addTag: function (tags) {
                if (jPush) {
                    // info.tags.push(tag);
                    // jPush.setTags(info.tags);
                    jPush.setTags(tags);
                }
            }
        };
        return jpushService;
    }]);

/**
 * 封装全局通用业务操作
 */
angular.module('app.services').factory('globalService', ["$http", "api", "$translate", "localStorage", "messageCenter", function (
    $http, api, $translate, localStorage, messageCenter
) {
    return {
        /**
         * 获取图片验证码
         */
        imageVerifyCode: function () {
            return api.post('/global/createImageVerifyCode');
        },

        /**
         * 验证图片验证码
         */
        validateImageVerifyCode: function (imageVerifyCode) {
            return api.post('/global/validateImageVerifyCode', {
                imageVerifyCode: imageVerifyCode
            });
        },
        /**
         * 验证图片验证码
         */
        validateExitsUserAndImageVerifyCode: function (imageVerifyCode, loginName) {
            return api.post('/global/validateExitsUserAndImageVerifyCode', {
                imageVerifyCode: imageVerifyCode,
                loginName: loginName
            });
        },

        /**
         * 发送手机短信验证码
         * @param phoneNumber {string} 需要接收短信的验证码
         * @param type {integer} 短信类型
         */
        sendSMSVerifyCode: function (phoneNumber, type) {
            return api.post('/global/sendSMSVerifyCode', {
                phoneNumber: phoneNumber,
                type: type
            });
        },

        /**
         * 验证码短信验证码是否跟手机号码匹配
         */
        validateSMSVerifyCode: function (phoneNumber, smsVerifyCode) {
            return api.post('/global/validateSMSVerifyCode', {
                phoneNumber: phoneNumber,
                smsVerifyCode: smsVerifyCode
            });
        },

        /**
         * 发送邮件
         */
        sendMail: function (email, type) {
            return api.post('/global/sendEmail', {
                email: email,
                type: type
            });
        },

        /**
         * 获取分站信息
         */
        getRegionInfo: function (cache) {
            if (cache == undefined) {
                cache = true;
            }
            return api.get('/global/getRegionInfo', undefined, {
                cache: cache
            });
        },

        /**
        * 获取分站信息 new
        */

        getRegionInfoList: function(cache) {
            if (cache == undefined) {
                cache = true;
            }
            return api.get('/global/getRegionInfoList', undefined, {
                cache: cache
            });
        },

        /**
         * 获取文章
         */
        getArticleInfo: function (type) {
            return api.post('/global/getArticleInfo', {
                type: type
            });
        },

        /**
         * 获取网站结构配置的文章
         */
        getArticleByStructure: function (type) {
            return api.post('/global/getArticleByStructureId', {
                type: type
            });
        },

        /**
         * 获取搜索热词
         */
        getKeywords: function (count) {
            return api.post('/keyword/list', {
                count: count
            }, {
                cache: true
            });
        },

        /**
         * 切换语言
         * @param  {[type]} langKey 语言key
         */
        toggleLanguage: function (langKey) {

            // 无需切换
            if (langKey == APP_CONFIG.language) {
                return;
            }
            //切换界面语言
            $translate.use(langKey);

            //切换header语言
            APP_CONFIG.language = langKey;

            // 存入缓存 记录选择的语言
            localStorage.set('language', langKey);

            // 切换语言 body检测class
            // $('.toggle-language').trigger('click');

            // 获取当前已选中的地区
            var selection = localStorage.get('subsite');

            // 如果已选地区 则重新获取名称
            if (selection && selection.regionId) {
                api.post('/global/getRegionNameById', {
                    id: selection.regionId
                }).success(function (data) {
                    // 设置名称
                    selection.regionName = data.regionName;

                    // 更新全局名称
                    _.assign(APP_CONFIG, selection);

                    // 更新本地缓存
                    localStorage.set('subsite', selection);

                }).finally(function () {
                    // 广播消息
                    messageCenter.publishMessage('language.change');
                });
            }

        },
        // 检查更新
        checkUpdate: function () {
            return api.get('/global/checkUpdate');
        }
    };
}]);

angular.module('app.services').factory('indexService', ["api", function(api) {

    return {
        /**
         * app商城·获取欢迎页中所使用的轮播图片数据
         * @param times {number<1,2>} 是否是第一次打开应用
         */
        getComeIndex: function(times) {
            return api.get('/index/getComeIndex', {
                times: times
            });
        },

        /**
         * app商城·获取首页轮播和频道信息
         * @param type 终端类型
         */
        getInfo: function(type) {
            return api.get('/index/getIndexInfo', {
                type: type
            });
        },

        /**
         * app商城·获取单品推荐类型
         */
        getRecType: function() {
            return api.get('/index/recType');
        },

        /**
         * app商城·根据单品推荐类型获取商品
         * 他API里的参数名就叫structureId
         * 可接口里叫ByTypeId
         */
        getRecProductsByTypeId: function(type) {
            return api.get('/index/getRecProductsByTypeId', {
                structureId: type
            });
        },

        /**
         * 微信商城·获取首页频道信息
         */
        getChannelInfo: function() {
            return api.post('/index/getChannelInfo',{});
        },

        /**
         * 微信商城·根据频道Id获取首页展示数据
         * @param channelId 频道Id
         * @param type 终端类型
         */
        getIndexInfoByChannel: function(channelId,type) {
            var params = {
                channelId: channelId,
                type: type
            };
            return api.post('/index/getIndexInfo', params );
        }
    }
}]);

/**
 * 封装用户相关业务操作
 */
angular.module('app.services').factory('userService',["$http", "api", "messageCenter", "localStorage", function(
    $http, api, messageCenter, localStorage
){
    return {
        /**
         * 获取当前用户的信息
         */
        info: function() {
            return api.get('/user/info')
                .success(function(data) {
                    messageCenter.publishMessage('user.info', data);
                });
        },

        /**
         * 修改用户信息
         *
         * ## 接口参数
         * - sex {integer} 性别
         * - birthday {string} 生日
         * - nickname {string} 昵称
         * - pic {string} 图片地址
         */
        update: function(params) {
            return api.post('/user/update', params);
        },

        /**
         * 获取用户服务信息
         */
        serviceInfo: function() {
            return api.get('/user/service');
        },

        /**
         * 登录操作
         *
         * ## 接口参数
         * - loginName {String} 帐号登录名称
         * - password {String} 密码
         * - imageVerifyCode(?) {String} 图片验证码
         *
         * @param params {Object} 接口参数
         */
        login: function(params) {
            return api.post('/user/login', params)
                .success(function(data) {
                    messageCenter.publishMessage('login', data);
                });
        },

        /**
         * 登出操作
         */
        logout: function() {
            return api.post('/user/logout')
                .success(function(data) {
                    messageCenter.publishMessage('logout');
                });
        },

        /**
         * 注册
         *
         * ## 接口参数
         * - loginName {String} 帐号登录名称，必须为手机号码
         * - password {String} 密码
         * - smsVerifyCode(?) {String} 短信验证码
         */
        register: function(params) {
            return api.post('/user/register', params)
                .success(function(data) {
                    messageCenter.publishMessage('register', data);
                    messageCenter.publishMessage('login', data);
                });
        },

        /**
         * 验证登录名是否已被注册使用
         * @param loginName {String} 待验证的登录名
         */
        verifyUniqueUser: function(loginName) {
            return api.get('/user/verifyUniqueUser', {
                loginName: loginName
            });
        },

        /**
         * 用户是否登录
         */
        hasLogined: function() {
            return !!APP_USER.id;
        },
        /**
         * 验证用户名称是否存在
         */
        validateLoginName: function(loginName) {
            return api.post('/user/verifyExitsUser',{
                 loginName: loginName
            });
        },
        /**
         * 找回密码-修改密码
         */
        changePassword: function(phoneNumber, smsVerifyCode, newPassword) {
            return api.post('/user/changePassword',{
                phoneNumber: phoneNumber,
                smsVerifyCode: smsVerifyCode,
                newPassword: newPassword,
                changeWay: 'find'
            });
        }
    };
}]);

/**
 * 分类接口封装服务
 */
angular.module('app.services').factory('categoryService',["api", function(
    api
) {
    var categoryService = {

        /**
         * 获取分类数据
         * @categoryId: 分类 ID，如果不指定，则为根分类节点
         * @depth: 深度，如果传入 0，则返回 categoryId 下的所有分类节点
         */
        list: function(categoryId, depth) {
            return api.get('/category/list', {
                id: categoryId,
                depth: depth
            });
        }

    };

    return  categoryService;
}]);

/**
 * 封装购物车接口
 * 其中，添加，修改及删除购物项接口支持批量处理，
 * 而选择及取消选择接口一次只能操作一个购物项，
 * 不过额外的提供了购物篮内的全部购物项的选择及取消选择接口。
 */
angular.module('app.services').factory('cartService', ["$rootScope", "api", "messageCenter", "utils", function(
    $rootScope, api, messageCenter, utils
) {

    var cartService = {
        initPromise: undefined,
        refreshPromise: undefined,

        /**
         * 购物车数据
         */
        data: undefined,

        /**
         * 清空购物车
         */
        clean: function() {
            return api.post('/cart/clean')
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 购物车初始化
         */
        init: function() {
            var self = this;

            messageCenter.publishMessage('cart.initBefore');

            this.initPromise = this.info()
                .success(function(data) {
                    self.data = data;

                    // 当用户登录登出时，会修改购物车内容，此时需要刷新购物车
                    messageCenter.subscribeMessage('login', function() {
                        self.refresh();
                    }, $rootScope);
                    messageCenter.subscribeMessage('logout', function() {
                        self.refresh();
                    }, $rootScope);

                    messageCenter.publishMessage('cart.init');
                })
            .finally(function(data) {
                self.initPromise = undefined;
            });

            return this.initPromise;
        },

        /**
         * 刷新购物车数据
         */
        refresh: function() {
            var self = this;

            // 如果已完成购物车数据初始化
            if (self.data) {
                // 取消已经在执行的刷新操作
                if (self.refreshPromise) {
                    self.refreshPromise.cancel();
                }

                // 并开启一个新的刷新操作
                // messageCenter.publishMessage('cart.refreshBefore');
                self.refreshPromise = self.info()
                    .then(function(response) {
                        utils.empty(self.data);
                        _.merge(self.data, response.data);
                        response.data = self.data;
                        // messageCenter.publishMessage('cart.refresh');
                        return response;
                    })
                    .finally(function() {
                        self.refreshPromise = undefined;
                    });

                return self.refreshPromise;
            }
            // 如果还未完成数据初始化操作，则执行初始化操作
            else {
                if (self.initPromise) {
                    return self.initPromise;
                }
                else {
                    return self.init();
                }
            }
        },

        /**
         * 获取购物车信息
         */
        info: function() {
            var self = this;
            return api.post('/cart/info').then((function(response) {
                response.data = this.processingCartData(response.data);
                return response;
            }).bind(this));
        },

        /**
         * 添加货品到购物车中，支持一次添加多个，每一个添加项需要提供如下数据：
         *
         * - goodsId {String} 货品 ID
         * - flashSaleId {String} 促销 ID
         * - number {Integer} 添加数量，如果有提供 flashSaleId 时，该参数无效，后台不使用该参数
         *
         * @params
         * @param infos {Array<Object>} 多条添加项信息
         *
         * @params
         * @param info {Object} 一条添加项信息
         *
         * @params
         * @param goodsId {String} 需添加到购物车中的货品 ID
         * @param flashSaleId {String} 如果该货品正在促销，则需要提供促销 ID，否则传入 undefined
         * @param number {Integer} 添加数量
         */
        addGoods: function(goodsId, flashSaleId, number) {
            var infos, params;

            if (typeof goodsId === 'string' || typeof goodsId === 'number') {
                infos = [{
                    goodsId: goodsId,
                    flashSaleId: flashSaleId,
                    number: number
                }];
            }
            else if (angular.isArray(goodsId)) {
                infos = goodsId;
            }
            else {
                infos = [goodsId];
            }

            return api.post('/cart/addGoods', infos)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 修改购物车中的购物项的购买数量，支持一次修改多个，每一个修改项需要提供如下数据：
         *
         * - basketId {String} 购物篮 ID
         * - basketItemId {String} 购物项 ID
         * - goodsId {String} 货品 ID
         * - number {Integer} 修改的数量
         *
         * @params
         * @param infos {Array<Object>} 多条修改项信息
         *
         * @params
         * @param info {Object} 一条修改项信息
         *
         * @params
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         * @param goodsId {String} 货品 ID
         * @param number {Integer} 修改的数量
         */
        editGoods: function(basketId, basketItemId, goodsId, number) {
            var infos;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                infos = [{
                    basketId: basketId,
                    basketItemId: basketItemId,
                    goodsId: goodsId,
                    number: number
                }];
            }
            else if (angular.isArray(basketId)) {
                infos = basketId;
            }
            else {
                infos = [basketId];
            }

            return api.post('/cart/changeGoodsNumber', infos)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**

         * 删除购物车中的购物项，支持一次删除多个，每一个删除项需要提供如下数据：
         *
         * - basketId {String} 购物篮 ID [UNUSED]
         * - basketItemId {String} 购物项 ID
         *
         * @params
         * @param infos {Array<Object>} 多条删除项信息
         *
         * @params
         * @param info {Object} 一条删除项信息
         *
         * @params
         * @param basketId {String} 购物篮 ID [UNUSED]
         * @param basketItemId {String} 购物项 ID
         * @param goodsId {String} 购物项内的货品的 ID [UNUSED]
         */
        removeGoods: function(basketItemId) {
            // var infos;
            //
            // if (typeof basketId === 'string' || typeof basketId === 'number') {
            //     infos = [{
            //         basketId: basketId,
            //         basketItemId: basketItemId
            //     }];
            // }
            // else if (angular.isArray(basketId)) {
            //     infos = basketId;
            // }
            // else {
            //     infos = [basketId];
            // }


            var itemIds = [];
            if (typeof basketItemId === 'string' || typeof basketItemId === 'number'){
                itemIds = [{
                    basketItemId: basketItemId
                }];
            }
            else if (angular.isArray(basketItemId)) {
                angular.forEach(basketItemId, function(data, index, array){
                    itemIds.push({
                        basketItemId: data
                    });
                });
            }

            return api.post('/cart/removeGoods', itemIds)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 选择购物项
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         */
        select: function(basketId, basketItemId) {
            var params = {
                basketId: basketId,
                basketItemId: basketItemId
            };

            return api.post('/cart/select', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 取消选择购物项
         * @param basketId {String} 购物篮 ID
         * @param basketItemId {String} 购物项 ID
         */
        unselect: function(basketId, basketItemId) {
            var params = {
                basketId: basketId,
                basketItemId: basketItemId
            };

            return api.post('/cart/unselect', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },


        /**
         * 选择一个或多个购物篮内的所有购物项
         *
         * @params
         * @param basketIds {Array<String>} 多个购物篮 ID
         *
         * @params
         * @param basketId {String} 一个购物篮 ID
         */
        selectAll: function(basketIds) {
            var params;

            if (typeof basketIds === 'string' || typeof basketIds === 'number') {
                basketIds = [basketIds];
            }

            params = {
                baskets: basketIds
            };

            return api.post('/cart/selectAll', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },


        /**
         * 取消选择一个或多个购物篮内的所有购物项
         *
         * @params
         * @param basketIds {Array<String>} 多个购物篮 ID
         *
         * @params
         * @param basketId {String} 一个购物篮 ID
         */
        unselectAll: function(basketIds) {
            var params;

            if (typeof basketIds === 'string' || typeof basketIds === 'number') {
                basketIds = [basketIds];
            }

            params = {
                baskets: basketIds
            };

            return api.post('/cart/unselectAll')
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 添加赠品
         */
        addPresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/addPresent', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 编辑赠品
         */
        editPresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/changePresent', [params])
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 删除赠品
         */
        removePresent: function(basketId, basketItemId, ruleId, presents) {
            var params;

            if (typeof basketId === 'string' || typeof basketId === 'number') {
                if (arguments.length === 3) {
                    presents = ruleId;
                    ruleId = basketItemId;
                    basketItemId = undefined;
                }

                params = {
                    basketId: basketId,
                    basketItemId: basketItemId,
                    ruleId: ruleId,
                    presents: presents
                };
            }
            else {
                params = basketId;
            }

            // presents 可以传入单个对象，或一个数组
            if (!_.isArray(params.presents)) {
                params.presents = [params.presents];
            }

            return api.post('/cart/removePresent', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },

        /**
         * 加工购物车数据
         */
        processingCartData: function(cart) {

            // 首先默认购物车为全选状态
            cart.selected = true;

            if (cart.basket) {
                var basket = this.processingBasketData(cart.basket);

                // 如果有一个购物篮为未选中状态，则整个购物车为非全选状态
                if (!basket.selected) {
                    cart.selected = false;
                }

                // 如果购物篮有限时抢购商品，则将所有购物篮中最早加入的限购项放入购物车
                if (basket.limitItem &&
                    (!cart.limitItem || basket.limitItem.secondTime < cart.limitItem.secondTime)) {
                    cart.limitItem = basket.limitItem;
                }
            }

            // 给购物车添加一个用于存放编辑模式下使用的数据集合
            cart.editMode = {};
            console.info('购物车数据', cart);
            return cart;
        },

        /**
         * 加工购物篮数据
         */
        processingBasketData: function(basket) {
            // 首先默认购物篮为选中状态
            // basket.selected = true;
            basket.selectedAll = true;
            // 默认购物篮中不包含不支持七天无理由退货的商品
            basket.hasNoSeven = false;

            // 购物篮内将有如下四种购物项
            var commons = basket.items,         // 普通商品
                limits = basket.limits,         // 限时抢购商品
                promotions = basket.promotions, // 促销商品
                presents = basket.presents;     // 赠品

            // 收集所有主购物项（普通商品，限时抢购，促销）
            var

            // 组合后的所有购物项
            mainItems = [],

            // 组合后的所有购物项集合，key 为购物项 ID，方便后续使用
            mainItemsMap = {},

            // 所有主购物项的购买数量
            mainItemsNumber = 0;

            _.forEach(promotions, function(item) {
                item.salesPrice.type = 1;
            });

            _.forEach(limits, function(item) {
                item.salesPrice.type = 2;
            });

            // 遍历所有的主购物项
            _.forEach(_.union(commons, limits, promotions), (function(item) {
                mainItems.push(item);
                mainItemsMap[item.id] = item;

                mainItemsNumber += item.number;

                // 如果有一个主购物项为未选中状态，则整个购物篮都是未选中状态
                // if (!item.selected) {
                //     basket.selected = false;
                // }
                if (!item.selected) {
                    basket.selectedAll = false;
                }

                // 给购物项添加一个用于存放编辑模式下使用的数据集合
                // item.editMode = {};

                // 把商品的重量转为公斤,保留两位小数
                item.weightKG = (item.weight / 1000).toFixed(3);

                // 加工购物项中的促销规则
                // this.processingBasketItemRuleData(basket, item);

                if (!item.isSupportSevenDayRefund) {
                    basket.hasNoSeven = true;
                }
            }).bind(this));

            basket.mainItems = mainItems;
            basket.mainItemsMap = mainItemsMap;
            basket.mainItemsNumber = mainItemsNumber;

            // 如果有限时抢购，则在购物篮中放置最早加入购物篮的抢购购物项
            if (limits && limits.length) {
                _.forEach(limits, function(item) {
                    if (item.secondTime &&
                        (!basket.limitItem || item.secondTime < basket.limitItem.secondTime)) {
                        basket.limitItem = item;
                    }
                });
            }

            // 统计赠品数量
            var presentsNumber = 0;
            _.forEach(presents, function(presentItem) {
                presentsNumber += presentItem.numbe || 1;
            });
            _.forEach(basket.mainItems, function(item) {
                _.forEach(item.presents, function(presentItem) {
                    presentsNumber += presentItem.number || 1;
                });
            });
            basket.presentsNumber = presentsNumber;

            // 统计所有购物项的数量，包括主购物项及赠品数量
            basket.allItemsNumber = basket.mainItemsNumber + basket.presentsNumber;

            // 给购物篮添加一个用于存放编辑模式下使用的数据集合
            // basket.editMode = {};

            // 处理购物篮主线促销规则
            this.processingBasketMainRuleData(basket);
            // 处理购物篮非主线促销规则
            // this.processingBasketNotMainRuleData(basket);

            return basket;
        },

        /**
         * 加工购物篮中的主线促销规则数据
         */
        processingBasketMainRuleData: function(basket) {
            var mainRules = basket.mainRules;

            _.forEach(mainRules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                // if (rule.rewardType == 1 || rule.rewardType == 2) {
                //     this.processingPresentRuleData(basket, undefined, rule);
                // }

                if ( _.isEmpty(rule.basketItemId) ) { return; }

                // 获取到该主线规则中匹配的第一个购物车项的位置
                var firstItemId = _.first(rule.basketItemId),
                    firstItemIndex = _.findIndex(basket.items, 'id', firstItemId),
                    firstItem = basket.items[firstItemIndex];

                if (firstItemIndex === -1) { return; }

                // 创建一个主线规则类型的购物车项分组数据
                var itemsGroup = {
                    type: 'groupByMainRule',
                    items: [firstItem],
                    rule: rule
                };

                // 将主线规则匹配的剩余购物项从 items 中取出并放入分组中
                _.forEach(_.rest(rule.basketItemId), function(itemId) {
                    var item = _.remove(basket.items, 'id', itemId)[0];
                    itemsGroup.items.push(item);
                });

                // 将分组数据放入原先第一个购物车项的位置
                basket.items.splice(firstItemIndex, 1, itemsGroup);
            }).bind(this));
        },

        /**
         * 加工购物篮中的非主线促销规则数据
         */
        processingBasketNotMainRuleData: function(basket) {
            var notMainRules = basket.notMainRules;

            _.forEach(notMainRules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                if (rule.rewardType == 1 || rule.rewardType == 2) {
                    this.processingPresentRuleData(basket, undefined, rule);
                }
            }).bind(this));
        },

        /**
         * 加工购物项中的单品促销规则数据
         */
        processingBasketItemRuleData: function(basket, basketItem) {
            var rules = basketItem.rules;

            _.forEach(rules, (function(rule, ruleId) {
                // 处理加价购和赠赠品促销规则
                if (rule.rewardType == 1 || rule.rewardType == 2) {
                    this.processingPresentRuleData(basket, basketItem, rule);
                }
            }).bind(this));
        },

        /**
         * 加工赠品或加价购促销规则数据
         */
        processingPresentRuleData: function(presents, rule) {
            var rewardType = rule.rewardType,
                presentBasketItems;

            _.forEach(presents, function(present) {
                // 将库存量的属性名改为 count
                if (!present.count) {
                    present.count = present.number;
                }

                // 将选择数量改为默认值 1
                present.number = 1;
                present.origin = 0;

                // 根据赠品的库存数量判断赠品是否有效
                present.valid = !!present.count;
            });

            _.forEach(presents, function(present) {
                var presentBasketItem = _.find(rule.presentBasketItems, function(item) {
                        return present.presentId == item.goodsId;
                    });

                present.rewardType = rewardType;

                if (presentBasketItem) {
                    present.selected = true;
                    present.number = presentBasketItem.number;
                    present.origin = presentBasketItem.number;
                    present.presentItemId = presentBasketItem.id;
                }
            });
        },

        /**
         * 获取规则对应的赠品集合
         * @param ruleId {Integer} 规则 ID
         */
        getPresents: function(ruleId) {
            var params = { ruleId: ruleId };
            return api.post('/cart/getPresentByRule',params);
        },

        /**
         * 根据订单Id将订单中的货品重新加入购物车
         * @param id {Integer} 订单ID
         */
        rebuy: function(id) {
            var params = { orderId: id };

            return api.post('/cart/rebuy', params)
                .then((function() {
                    return this.refresh();
                }).bind(this));
        },
        /**
         * 获取购物车中选中的总数量 只有详情页会加载一次
         */
        getTotalQuantity: function() {
            return api.post('/cart/getSelectNum');
        }
    };


    return cartService;
}]);

/**
 * 封装订单接口
 */
angular.module('app.services').factory('orderService', ["api", function(
    api
) {
    return {
        /** 订单类型 */
        ORDER_TYPES: {
            ALL: 0, //  全部
            WAITING_PAYMENT: 1, // 待支付
            WAITING_DELIVERY: 2, // 待收货
            COMPLETE: 3, // 已完成
            CANCELED: 4 // 已取消
        },

        /**
         * 获取订单列表数据
         * @param type      {Integer} 订单类型
         * @param page      {Integer} 页码，从 1 开始
         * @param pageCount {Integer} 每页数据的数量
         */
        list: function(userId, type, page, pageCount) {
            var params = {
                type: type,
                page: page,
                pageCount: pageCount
            };

            return api.get('/order/list', params).success(function(data) {
                data.totalItems = data.total;
                data.pageIndex = page;
            });
        },

        /**
         * 获取订单详细信息
         * @param id {String} 订单 ID
         */
        info: function(id) {
            var params = {
                orderId: id
            };
            return api.get('/order/info', params);
        },

        /**
         * 取消订单
         * @param reasonId {Integer} 原因 ID
         * @param orderId {Integer} 订单 ID
         */
        cancel: function(reasonId, orderId) {
            var params = {
                reasonId: reasonId,
                orderId: orderId
            };
            return api.get('/order/cancel', params);
        },

        /**
         *  获取取消订单原因列表
         */
        findReason: function() {
            return api.get('/order/findReason');
        }
    };
}]);

angular.module('app.services').factory('productService', ["api", function(
    api
) {
    var productService = {
        /**
         * 搜索商品
         *
         * 可设定检索条件及排序规则如下：
         *
         * - categoryId(?)   <String>  分类ID
         * - brandId(?)      <String>  品牌ID
         * - keyword(?)      <String>  搜索关键字
         * - beginPrice(?)   <String>  价格筛选起始价格
         * - endPrice(?)     <String>  价格筛选结束价格
         * - attributes(?)   [<属性>]   属性筛选条件
         *
         * @param config {Object} 检索条件
         * @param order {Integer} 排序方式
         * @param page {String} 分页
         * @param pageCount {Integer} 分页大小
         *
         */
        search: function(filterRule, order, page, pageCount) {
            var params = _.assign({}, filterRule, {
                order: order,
                page: page,
                pageCount: pageCount
            });

            return api.post('/product/search', params)
                .success(function(data) {
                    data.totalItems = data.total;
                    data.pageIndex = page;
                });
        },

        /**
         * 获取商品促销信息
         * goodsIds     <String>    货品id字符串（格式如下）：250001-250003-250006-250115
         *
         * return:
         * map  key: goodsId, value: <促销信息>
         *
         * <促销信息>
         * {
         *     description	<String>	促销具体描述
         *     type         <int>	    1:赠品,
         *                              2:加价购,
         *                              3:返券,
         *                              4:赠积分,
         *                              5:满减,
         *                              6:减运费,
         *                              7:多件折扣,
         *                              8:抢购
         *     typeName     <String>	促销信息
         * }
         */

        findListTagByGoodsId: function(goodsIdsArray) {
            var params = {
                goodsIds: goodsIdsArray.join('-')
            };

            return api.get('/product/findListTagByGoodsId', params);
        },

        /**
         * 获取商品筛选条件
         */
        filterCondition: function(filterRule) {
            return api.post('/product/filterCondition', filterRule);
        },

        /**
         * 获取商品详情
         * @param goodsId {String} 货品 ID，当提供该参数时，将忽略其余参数
         * @param productId {String} 商品 ID
         * @param styleId {String} 款式 ID，可选值，如果不提供，则返回默认款式
         */
        info: function(goodsId, productId, styleId) {
            var params = {
                // goodsId: goodsId || undefined,
                // 后端goodsid代码未调整
                // 暂时不用goodsid
                productId: productId || undefined,
                styleId: styleId || undefined
            };

            return api.get('/product/info', params);
        },

        /**
         * 根据条码编码获取对应的商品 ID 及样式 ID
         * @param barCode {String} 条码编码
         */
        getProductIdByBarCode: function(barCode) {
            var params = {
                barCode: barCode
            };

            return api.get('/product/getProductIdByBarCode', params);
        },

        /**
         * 已废弃
         * 获取商品列表数据，基于商品 ID
         * @params ids {Array<String>}  多个商品 ID
         */
        // listByProductIds: function(ids) {
        //     var params = {
        //         products: ids
        //     };
        //     return api.get('/product/list', params);
        // },

        /** 获取商品评论 */
        discuss: function(productId, type, count, page) {
            return api.get('/product/discuss', {
                pid: productId,
                type: type,
                count: count,
                page: page
            });
        },

        // 商品排序常量
        productOrders: {
            DEFAULT: 0, // 默认
            PRICE: 3, // 价格
            PRICE_DESC: 4, // 价格降序
            SALE: 1, // 销量
            COMMENT: 2, // 评论数量

            is: function(name, val) {
                name = name.toUpperCase();
                var descName = name + '_DESC';
                return this[val] === name || this[val] === descName;
            },

            get: function(name) {
                return this[name.toUpperCase()];
            },

            isDesc: function(val) {
                return this[val].indexOf('DESC') !== -1;
            },

            getAntitone: function(val) {
                var name = this[val],
                    descTextIndex = name.indexOf('_DESC');

                if (descTextIndex === -1) {
                    name += '_DESC';
                } else {
                    name = name.substring(0, descTextIndex);
                }

                return this[name];
            }
        },

        //获取推荐商品
        getGoodsMatch: function(goodsId, productId) {
            var params = {
                goodsId: goodsId,
                productId: productId
            };
            return api.post('/product/getGoodsMatch', params);
        },

        /** 搜索商品二维码 */
        scancode: function(code) {
            return api.post('/scancode', {
                scancode: code
            });
        }

    };


    _.forEach(productService.productOrders, function(value, key) {
        if (typeof value === 'number') {
            productService.productOrders[value] = key;
        }
    });

    return productService;
}]);

/**
 * 结算服务
 */
angular.module('app.services').factory('checkoutService', ["api", "userService", "cartService", "couponService", function(
    api, userService, cartService, couponService
) {

    return {
        // 当前在处理的订单数据
        order: undefined,

        // 提交订单的返回结果
        submitOrderResult: undefined,

        // 设置需共享的订单数据
        setOrder: function(order) {
            this.order = order;
        },

        // 基于当前的购物车获取结算信息
        checkoutInfoByCart: function() {
            return api.post('/checkout/info')
                .success(function(data) {
                    // 北京站版本兼容
                    if(data.consignee){
                        var fullAddress = data.consignee.address.allDeliveryName;
                        data.consignee.address = fullAddress;
                    }
                    couponService.processingCoupons(data.avalaibleCoupons);
                    couponService.processingCoupons(data.unavalaibleCoupons);
                });
        },

        // 刷新结算信息
        update: function(params) {
            return api.post('/checkout/update', params)
                .success(function(data) {
                    couponService.processingCoupons(data.avalaibleCoupons);
                    couponService.processingCoupons(data.unavalaibleCoupons);
                });
        },

        // 获取配送方式
        getDeliverys: function(consigneeId, paymentModeType) {
            var params = {
                consigneeId: consigneeId,
                paymentModeType: paymentModeType
            };
            return api.post('/checkout/getDeliverys', params);
        },

        // 获取自提点
        getPickupes: function() {
            return api.post('/checkout/findOwnDeliverylist', {});
        },

        /**
         * 获取准时达（或生鲜达）信息
         *
         * @param {number} consigneeId - 收货人地址 ID
         * @param {number} ownDeliveryAddrId? - 自提点 ID
         */
        findDeliveryOntimes: function(consigneeId, ownDeliveryAddrId) {
            var params = {
                consigneeId: consigneeId,
                ownDeliveryAddrId: ownDeliveryAddrId
            };

            return api.post('/checkout/findDeliveryOntimes', params);
        },

        // 提交结算信息
        submit: function(config) {
            var params = _.merge({}, config, 'origin');
            return api.post('/checkout/createOrder', params)
                .success(function(data) {
                    // 如果结算信息是来自购物车，则需要刷新购物车数据
                    if (config.origin === 'cart') {
                        cartService.refresh();
                    }
                });
        }
    };
}]);

/**
 * 封装收货人信息相关接口
 */
angular.module('app.services').factory('consigneeService', ["api", "$rootScope", "messageCenter", function (
    api, $rootScope, messageCenter) {

    var localData = null;

    var consigneeService = {
        /**
         * 获取所有提货人信息
         */
        all: function () {
            return api.get('/consignee/list').success(function (response) {
                if (_.isUndefined(response.validAddress)) {
                    response.validAddress = [];
                }
                if (_.isUndefined(response.invalidAddress)) {
                    response.invalidAddress = [];
                }
                var valid = response.validAddress.map(function (item) {
                    item.valid = true;
                    return item;
                });
                var invalid = response.invalidAddress.map(function (item) {
                    item.valid = false;
                    return item;
                });

                response.allAddress = valid.concat(invalid);
            });
        },

        /**
         * 保存或修改一条提货人信息
         *
         * @param id {String} 提货人信息 ID，如果是修改一条信息，则传入
         * @param data {String} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         *
         * @example
         * // 添加一条提货人信息
         * consigneeService.addOrEdit({
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息
         * consigneeService.addOrEdit("108377", {
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息，与上面的修改操作相同，只是将 id 放在了数据集合中
         * consigneeService.addOrEdit({
         *     id: "108377",
         *     name: "Bios Sun"
         * });
         */
        addOrEdit: function (id, data) {
            if (typeof id === 'object') {
                data = id;
                id = undefined;
            }
            if (id) {
                data = angular.extend({}, data, {
                    id: id
                });
            }
            // 北京站版本兼容
            // 克隆一份避免对视图造成影响
            var dataClone = _.cloneDeep(data);
            var fullAddress = dataClone.address;
            dataClone.address = {
                road: fullAddress
            };
            return !dataClone.id ? consigneeService.add(dataClone) : consigneeService.edit(dataClone);
        },

        /**
         * 添加一条提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        add: function (data) {
            return api.post('/consignee/add', data)
                .success(function (data) {
                    messageCenter.publishMessage('consignee.add');
                });
        },

        /**
         * 更新提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - id        {String}  收货人信息 ID
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        edit: function (data) {
            return api.post('/consignee/update', data)
                .success(function () {
                    messageCenter.publishMessage('consignee.edit');
                });
        },

        /**
         * 删除某条收货人信息
         * @param id {String} 收货人信息 ID
         */
        remove: function (id) {
            var params = {
                id: id
            };

            return api.post('/consignee/remove', params)
                .success(function () {
                    messageCenter.publishMessage('consignee.remove', id);
                });
        },

        /**
         * 获取所选择的地址数据
         * @param id {String} 地区信息 ID
         */
        region: function (id) {
            return api.get('/consignee/region', {
                id: id || 0
            });
        }
    };

    return consigneeService;
}]);

/**
 * 封装收货人信息相关接口
 */
angular.module('app.services').factory('memberConsigneeService', ["api", "$rootScope", "messageCenter", function (
    api, $rootScope, messageCenter) {

    var localData = null;

    var consigneeService = {
        /**
         * 获取所有提货人信息
         */
        all: function () {
            return api.get('/user/userAddressList');
        },

        /**
         * 保存或修改一条提货人信息
         *
         * @param id {String} 提货人信息 ID，如果是修改一条信息，则传入
         * @param data {String} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         *
         * @example
         * // 添加一条提货人信息
         * consigneeService.addOrEdit({
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息
         * consigneeService.addOrEdit("108377", {
         *     name: "Bios Sun"
         * });
         *
         * // 修改一条提货人信息，与上面的修改操作相同，只是将 id 放在了数据集合中
         * consigneeService.addOrEdit({
         *     id: "108377",
         *     name: "Bios Sun"
         * });
         */
        addOrEdit: function (id, data) {
            if (typeof id === 'object') {
                data = id;
                id = undefined;
            }
            if (id) {
                data = angular.extend({}, data, {
                    id: id
                });
            }
            // 北京站版本兼容
            // 克隆一份避免对视图造成影响
            var dataClone = _.cloneDeep(data);
            var fullAddress = dataClone.address;
            dataClone.address = {
                road: fullAddress
            };
            return !dataClone.id ? consigneeService.add(dataClone) : consigneeService.edit(dataClone);
        },

        /**
         * 添加一条提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        add: function (data) {
            return api.post('/user/userAddressAdd', data)
                .success(function (data) {
                    messageCenter.publishMessage('consignee.add');
                });
        },

        /**
         * 更新提货人信息
         *
         * @param data {Object} 提货人信息
         *
         *   - id        {String}  收货人信息 ID
         *   - name      {String}  收货人姓名
         *   - address   {String}  收货人地址
         *   - mobile    {String}  收货人手机
         *   - regionId  {String}  地区ID
         *   - postcode  {String}  邮政编码
         *   - phone     {String}  固定电话
         */
        edit: function (data) {
            return api.post('/user/userAddressUpdate', data)
                .success(function () {
                    messageCenter.publishMessage('consignee.edit');
                });
        },

        /**
         * 删除某条收货人信息
         * @param id {String} 收货人信息 ID
         */
        remove: function (id) {
            var params = {
                id: id
            };

            return api.post('/user/userAddressRemove', params)
                .success(function () {
                    messageCenter.publishMessage('consignee.remove', id);
                });
        },

        /**
         * 获取所选择的地址数据
         * @param id {String} 地区信息 ID
         */
        region: function (id) {
            return api.get('/user/region', {
                id: id || 0
            });
        },

        /**
        * 会员中心，用户默认地址修改
        * @param id {String} 收货人信息ID
        * @param isDefault {bool} 是否为默认地址
        */
        editDefault: function(id, isDefault){
            var params = {
                id: id,
                isDefault: isDefault
            };

            return api.post('/user/userDefaultAddressUpdate', params)
                .success(function(){
                    messageCenter.publishMessage('consignee.isDefault');
                });
        }


    };

    return consigneeService;
}]);

/**
 * 卡券相关接口
 */
angular.module('app.services').factory('couponService', ["api", "$q", "$rootScope", function(
    api, $q, $rootScope
) {

    var

        couponService = {

        /**
         * 获取当前用户的优惠券列表
         */
        list: function(status, page, pageCount) {
            var params = {
                status: status,
                page: page,
                pageCount: pageCount
            };

            return api.get('/coupon/list', params)
                .success(function(data) {
                    // 整理数据以符合分页数据标准
                    data.pageIndex = page; // 页码
                    data.totalItems = data.total; // 总条目数量

                    // couponService.processingCoupons(data.items);
                });
        },

        /**
         * 选择优惠券
         */
        selectedCoupon: function(consigneeId, couponIds, deliveryModeId, paymentModeType, ownDeliveryAddrId, deliveryOntimeId) {
            var params = {
                consigneeId: consigneeId,
                couponIds: couponIds,
                deliveryModeId: deliveryModeId,
                paymentModeType: paymentModeType,
                ownDeliveryAddrId: ownDeliveryAddrId,
                deliveryOntimeId: deliveryOntimeId
            };
            return api.post('/checkout/selectedCoupon', params);
        },

        /**
         * 处理优惠券数据
         */
            processingCoupons: function(coupons) {
            // 处理数据
            _.forEach(coupons, function(coupon) {
                coupon.beginTime = moment(coupon.beginTime);
                coupon.endTime = moment(coupon.endTime);

                coupon.remainingTime = CM.durationHumanize(
                    moment.duration(Math.max(coupon.endTime.diff(moment()), 0))
                );
            });
        }
    };

    return couponService;
}]);

/**
 * 支付相关接口
 */
angular.module('app.services').factory('payService', ["api", "$q", "$rootScope", "$ionicPopover", "toast", "loading", "$sce", "errorHandling", "messageCenter", "$translate", function(
    api, $q, $rootScope, $ionicPopover, toast, loading, $sce,errorHandling,messageCenter,$translate
) {
    var

    WECHAT_PAY_METHOD_ID = '4',

    /**
     * 定义所有支持的支付操作
     */
    paymentMethods = {
        /**
         * 支付宝支付
         */
        2: function(payInfo) {
            var apiDeferred = api.defer();

            window.alipay.check(function(isInstalled) {
                if (isInstalled === 'true') {
                    window.alipay.pay(
                        payInfo,

                        function sucess() {
                            apiDeferred.resolve();
                        },

                        function error(code) {
                            // 支付宝错误码映射
                            var errorMsgs = {
                                '4000': $translate.instant('pay.payError'),   // 支付失败
                                '6001': $translate.instant('pay.payCancel'),  // 支付取消
                                '6002': $translate.instant('pay.payError')    // 网络异常导致无法支付
                            };

                            var message = errorMsgs[code];

                            if(!message) {
                                message = $translate.instant('pay.payError');
                            }

                            apiDeferred.reject(APP_STATE_CODE.unknownException, message);
                        }
                    );
                }
                else {
                    apiDeferred.reject(APP_STATE_CODE.unknownException, $translate.instant('pay.missAlipay'));
                }
            });

            return apiDeferred.promise;
        },

        /**
         * 微信支付
         */
        4: function(payInfo) {
            var apiDeferred = api.defer();

            // 三只松鼠接口所返回的支付数据集合中的 key 与插件中所规定的不一样，因此这里需要转换一下
            payInfo = (function(data) {
                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }

                data.timeStamp    = data.timeStamp    || data.timestamp;
                data.partnerId    = data.partnerId    || data.partnerid;
                data.prepayId     = data.prepayId     || data.prepayid;
                data.packageValue = data.packageValue || data.package;
                data.nonceStr     = data.nonceStr     || data.noncestr;
                // data.sign

                return JSON.stringify(data);
            })(payInfo);

            window.wechatPay.checkAppInstalled(function(isInstallWechatApp) {
                if (isInstallWechatApp === 'true') {
                    window.wechatPay.pay(
                        payInfo,

                        function sucess() {
                            apiDeferred.resolve();
                        },

                        function error(message) {
                            apiDeferred.reject(APP_STATE_CODE.unknownException, message);
                        }
                    );
                }
                else {
                    apiDeferred.reject(APP_STATE_CODE.notInstalledWechat, $translate.instant('pay.missWechat'));
                }
            });

            return apiDeferred.promise;
        },

        /**
         * 银联支付
         */
        10: function(payInfo) {
            var deferred = api.defer();
            var inAppBrowser = cordova.InAppBrowser.open(payInfo, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=返回,disallowoverscroll=yes,toolbarposition=top');
            inAppBrowser.addEventListener('loadstart', function(event) {
                var url = event.url;
                if (/.*\/paysuccess/.test(url)) {
                    inAppBrowser.close();
                    deferred.resolve();
                }
                if (/.*\/payerror/.test(url)) {
                    inAppBrowser.close();
                    var index = url.indexOf('?msg=');
                    deferred.reject(APP_STATE_CODE.unknownException,
                        decodeURIComponent(url.substr(index + 5)));
                }
            });
            inAppBrowser.addEventListener('exit', function(event) {
                deferred.reject();
                inAppBrowser = undefined;
            });
            return deferred.promise;
        },

        /**
         * 北京站 银联支付
         */
        11: function(payInfo) {
            var deferred = api.defer();
            var inAppBrowser = cordova.InAppBrowser.open(payInfo, '_blank', 'location=no,enableViewportScale=no,suppressesIncrementalRendering=yes,closebuttoncaption=返回,disallowoverscroll=yes,toolbarposition=top');
            inAppBrowser.addEventListener('loadstart', function(event) {
                var url = event.url;
                if (/.*\/paysuccess/.test(url)) {
                    inAppBrowser.close();
                    deferred.resolve();
                }
                if (/.*\/payerror/.test(url)) {
                    inAppBrowser.close();
                    var index = url.indexOf('?msg=');
                    deferred.reject(APP_STATE_CODE.unknownException,
                        decodeURIComponent(url.substr(index + 5)));
                }
            });
            inAppBrowser.addEventListener('exit', function(event) {
                deferred.reject();
                inAppBrowser = undefined;
            });
            return deferred.promise;
        }
    },

    payService = {

        /**
         * 进行微信 js-api 支付操作
         */
        wechatPay: function(orderId, orderNo, price) {

            loading.open();
            var params = {
                orderId: _.trim(orderId),
                paymentModeId: WECHAT_PAY_METHOD_ID
            },

            //请求支付数据
            promise = api.post('/pay/topay', params)
                .then(function(response) {
                    var data = response.data;
                    var apiDeferred = api.defer();

                    data = $.parseJSON(data);

                    //调起微信支付
                    wx.chooseWXPay({
                        timestamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,

                        success: function(res) {
                            apiDeferred.resolve();
                        },

                        fail: function(res) {
                            apiDeferred.reject('C10');
                        },

                        cancel: function(res) {
                            apiDeferred.reject('C18');
                        }
                    });

                    return apiDeferred.promise;
                })
                .finally(function() {
                    loading.close();
                }).then(function() {
                    //广播消息 支付完成
                    messageCenter.publishMessage('pay.success');
                });

            return promise;
        },

        /**
         * 进行支付
         */
        pay: function(orderId, paymentModeId) {

            loading.open();

            var params = {
                orderId: _.trim(orderId),
                paymentModeId: paymentModeId
            };

            //请求支付数据
            return api.post('/pay/topay', params)
                .finally(function() {
                    loading.close();
                })
                .then(function(response) {
                    var data = response.data;
                    return paymentMethods[paymentModeId](data);
                })
                .then(function() {
                    //广播消息 支付完成
                    messageCenter.publishMessage('pay.success');
                });

        },

        // 获取启用的支付方式列表
        getPaymentList: function(orderId) {
            loading.open();

            var params = {
                orderId: _.trim(orderId)
            };
            return api.post('/pay/info', params)
                .finally(function(){
                    loading.close();
                });
        }
    };

    return payService;
}]);

/**
 * 条形码、二维码扫描服务
 */
angular.module('app.services').factory('scanService', ["$rootScope", "$q", "$state", "api", "loading", "stateUtils", "toast", "productService", "errorHandling", "$translate", function(
    $rootScope, $q, $state, api, loading,stateUtils, toast, productService, errorHandling, $translate
) {
    function qrCodeHandler(resultStr) {
        var productId;

        loading.open();

        resultStr = resultStr.substring(resultStr.lastIndexOf('?') + 1).split('=');

        if(!resultStr || resultStr[0] != 'productId') {
            toast.open($translate.instant('scan.invalidQRCode'));
            loading.close();
            return;
        }

        productId = resultStr[1];
        goProductInfo(productId);

        loading.close();
    }

    function barCodeHandler(barCode) {
        loading.open();

        productService.getProductIdByBarCode(barCode)
            .success(function(data) {
                if (data) {
                    goProductInfo(data.productId, data.styleId, undefined, data.title);
                }
                else {
                    toast.open($translate.instant('scan.invalidBarCode'));
                }
            })
            .error(function() {
                toast.open($translate.instant('scan.invalidBarCode'));
            })
            .finally(function() {
                loading.close();
            });
    }

    function goProductInfo(productId, styleId, goodsId, title) {
        title = title || '';

        var stateName = stateUtils.getStateNameByCurrentTab('productInfo',$state);

        if (stateName) {
            $state.go(stateName, {
                productId: productId,
                goodsId: goodsId,
                styleId: styleId,
                title: title
            });
        }
    }

    var scanService = {
        scan: function () {
            // 微信商城扫描
            if (window.wx) {
                wx.scanQRCode({
                    needResult: 1,
                    success: function(res) {
                        // 扫描结果
                        var code = res.resultStr;
                        // 判断类型  条形码 or 二维码
                        if(/^http/.test(code)) {
                            qrCodeHandler(code);
                        }else{
                            barCodeHandler(code);
                        }

                    },
                    fail: function() {
                        toast.open($translate.instant('scan.parseFailure'));
                    }
                });
            }
            // 应用内扫描
            else if (window.cordova && cordova.plugins && cordova.plugins.barcodeScanner) {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                        // toast.open(result.text);
                        if (!result.text) {
                            // toast.open($translate.instant('scan.none'));
                            return;
                        }

                        if(/^http/.test(result.text)) {
                            qrCodeHandler(result.text);
                        }else{
                            barCodeHandler(result.text);
                        }
                    },

                    function () {
                        toast.open($translate.instant('scan.parseFailure'));
                    }
                );
            }
            else {
                toast.open($translate.instant('scan.notSupport'));
            }
        }
    };

    return scanService;
}]);

/**
 * 商品收藏服务
 */
angular.module('app.services').factory('collectService', ["api", function(api) {

    return {

        /**
         * 获取用户收藏商品列表
         * @param  page      分页标识
         * @param  pageCount 每页数量
         */
        list: function(page, pageCount) {
            var params = {
                page: page,
                pageCount: pageCount
            };
            return api.get('/collect/list', params).success(function (response) {
                response.pageIndex = response.page;
                response.totalItems = response.total;
                response.items = response.collections;

            })
        },

        /**
         * 收藏列表页，通过id删除商品收藏
         */
        remove: function(id) {
            return api.post('/collect/delete', {
                id: id
            });
        },

        /**
         * 商品详情页，通过goodsId删除商品收藏
         */
        removeByGoodsId: function(goodsId) {
            return api.post('/collect/deleteByGoodsId', {
                goodsId: goodsId
            });
        },

        /**
         * 添加商品收藏
         */
        add: function(goodsId) {
            return api.post('/collect/add', {
                goodsId: goodsId
            });
        },

        /**
         * 批量添加收藏
         */
        addList: function(goodsIdArray) {
            return api.get('/collect/addList', {
                goodsIds: goodsIdArray.join("-")
            })

        }
    };
}]);

angular.module('app.services').factory('commentService', ["api", function(
    api
) {
    return {

        /**
         * 获取商品评论列表
         *
         * productId    <String>    商品ID，获取商品详情页评论列表
         * 支持loadDataMixin标准分页模式
         *
         * return:
         * [<评价>]
         */
        list: function(productId, queryType, page, pageCount) {
            var params = _.assign({}, {
                productId: productId,
                queryType: queryType,
                page: page,
                pageCount: pageCount
            });

            return api.get('/remark/list', params)
                .success(function(data) {
                    data.totalItems = data.total;
                    data.pageIndex = data.page;
                });
        },

        /**
         * 添加评论
         *
         * content  <String>    评论内容
         * score    <Integer>   评分
         * isAnonymously    <Boolean>   是否匿名评论
         * product2RemarkId <Integer>   商品&评论关系ID
         * productId    <string>    商品ID
         *
         * return:
         * integral <Integer>   赠送积分，如果是已评论的，则有该属性
         */
        add: function(content, score, isAnonymously, product2RemarkId, productId) {
            var params = {
                content: content,
                score: score,
                isAnonymously: isAnonymously,
                product2RemarkId: product2RemarkId,
                productId:productId
            };

            return api.post('/remark/add', params);
        },

        /**
         * 获取订单购物项评论情况
         *
         * orderId  <String>    订单ID
         *
         * return:
         * [<购物项>]
         */
        reviewProduct: function(orderId) {
            return api.get('/remark/reviewProduct', {
                orderId: orderId
            });
        }
    };
}]);

angular.module('app.services').factory('articleService', ["api", function(
    api
) {
    return {

        /**
         * 根据 id 获取文章
         */
        getArticleById: function(id) {
            return api.post('/global/getArticleById', {
                id: id
            });
        },
    };
}]);

angular.module('app.services').factory('activityService', ["api", function(
    api
) {
    return {

        /**
         * 根据文章ID获取内容
         *
         * articleId    <String>    文章ID
         *
         * return:
         * content      <String>    文章内容
         */
        getActivityInfo: function(articleId) {
            var params = _.assign({}, {
                articleId: articleId
            });

            return api.get('/activity/getActivityInfo', params);
        }
    };
}]);

/**
 * 延迟图片加载，图片进入可视区时才进行加载
 * preLoadTop  <Integer>  控制预加载高度，默认 50
 * preLoadLeft  <Integer>  控制预加载宽度，默认 30
 * loadImmediate  <Boolean>  不检测是否在可视范围内直接开始加载，默认 false
 * animation      <Bollean>  是否启用动画效果，默认 true
 */
angular.module('app.directives')

.directive('cmLazyload', ["$document", "throttle", function($document, throttle) {
    // 延迟加载样式类
    var CLASS_LAZY_LOAD = 'lazyload';
    // 延迟加载样式类
    var CLASS_LOADED = 'lazyload-loaded';
    // 占位图片
    var SPACER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=';

    // 指令自增索引
    var count = 0;

    // 所有需要监听的滚动区
    var scrollMap = {};

    var clientHeight = $document[0].documentElement.clientHeight;
    var clientWidth = $document[0].documentElement.clientWidth;
    window.addEventListener('resize', function() {
        clientHeight = $document[0].documentElement.clientHeight;
        clientWidth = $document[0].documentElement.clientWidth;
    });

    // 添加滚动监听
    function addScrollHandler(scrollPanel, image) {
        var key = scrollPanel[0].$$hashKey;
        var scrollDelegate = scrollMap[key];
        if (scrollDelegate) {
            scrollDelegate.images[image.id] = image;
            scrollDelegate.length++;
        } else {
            // 滚动处理
            var scrollHandler = function() {
                for (var id in scrollDelegate.images) {
                    var image = scrollDelegate.images[id];
                    if (isVerticalInView(image.$element, image.preLoadTop, image.preLoadLeft)) {
                        delete scrollDelegate.images[id];
                        scrollDelegate.length--;
                        loadImage(image.$element, image.src, image.animation);

                        // 滚动区内所有图片已加载时，不再监听滚动
                        if (scrollDelegate.length === 0) {
                            scrollPanel.off('scroll', scrollDelegate.handler);
                            delete scrollMap[key];
                        }
                    }
                }
            };

            scrollDelegate = {
                scrollPanel: scrollPanel,
                images: [image],
                length: 1,
                handler: throttle.createHandler(scrollHandler, 100, 200)
            };
            scrollPanel.on('scroll', scrollDelegate.handler);
            scrollMap[key] = scrollDelegate;
        }
    }

    // 检查元素是否在可视区内
    function isInView($element, preLoadTop, preLoadLeft) {
        var imageRect = $element[0].getBoundingClientRect();
        return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt(preLoadTop)) &&
            (imageRect.left >= 0 && imageRect.left <= clientWidth + parseInt(preLoadLeft));
    }

    // 检查元素是否在可视区垂直高度内
    function isVerticalInView($element, preLoadTop) {
        var imageRect = $element[0].getBoundingClientRect();
        return (imageRect.top >= 0 && imageRect.top <= clientHeight + parseInt(preLoadTop));
    }

    // 加载图片
    function loadImage($element, src, animation) {
        var img = $document[0].createElement('img');
        img.onload = function() {
            if(animation){
                $element.removeClass(CLASS_LAZY_LOAD).addClass(CLASS_LOADED);
            }
            $element[0].src = this.src;
        };
        img.src = src;
    }

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attr) {
            var scrollPanel = $element.parents('.scroll-content').eq(0);
            var preLoadTop = $attr.preLoadTop || 50;
            var preLoadLeft = $attr.preLoadLeft || 30;
            var loadImmediate = $attr.loadImmediate;
            var animation = $attr.animation;

            // 初始化延迟加载
            function init() {
                var src = $scope.$eval($attr.cmLazyload);
                if (!src) {
                    return;
                }
                if(animation){
                    $element.removeClass(CLASS_LOADED).addClass(CLASS_LAZY_LOAD);
                }
                $element[0].src = SPACER;
                if (loadImmediate || isVerticalInView($element, preLoadTop, preLoadLeft)) {
                    loadImage($element, src);
                } else {
                    addScrollHandler(scrollPanel, {
                        id: count++,
                        $element: $element,
                        src: src,
                        preLoadTop: preLoadTop,
                        preLoadLeft: preLoadLeft,
                        animation: animation
                    });
                }
            }

            var listener = $scope.$watch($attr.cmLazyload, init);
            $scope.$on('$destroy', listener);
        }
    };
}]);

/**
 * 获取购物车内商品数量
 */
angular.module('app.directives').directive('cmCartNumber', ["cartService", function(
    cartService
) {
    return {
        restrict: 'A',
        priority: 1,
        link: function($scope, $el, $attrs) {

            try {
                if (cartService.data) {
                    $el[0].innerHTML = cartService.data.basket.info.totalQuantity;
                }
                else {
                    cartService.refresh().success(function() {
                        $el[0].innerHTML = cartService.data.basket.info.totalQuantity;
                    });
                }
            }
            catch (e) {
                $el[0].innerHTML = '0';
            }

            $scope.$watch(function() {
                var number = 0;

                try {
                    number = cartService.data.basket.info.totalQuantity;
                }
                catch(e) { ; }

                return number;
            }, function(value) {
                $el[0].innerHTML = value;
            });
        }
    };
}]);

/**
 * 切换器，用于实现多面板的切换操作
 */
angular.module('app.directives').directive('cmSwitcher', function() {
    return {
        scope: {
            onSwitch: '&'
        },

        // @ngInject
        controller: ["$scope", "$element", "$attrs", "cmSwitcherDelegate", "History", function($scope, $element, $attrs, cmSwitcherDelegate, History) {
            var self = this,

                // 存放切换器内的所有面板元素
                panels = $element.find('> .panel'),

                // 存放切换历史
                history = new History();

            _.assign(self, {
                /**
                 * 当前面板元素
                 */
                current: null,

                /**
                 * 当前面板索引
                 */
                currentIndex: null,

                /**
                 * 是否已经切换到第一个面板
                 */
                isFirst: false,

                /**
                 * 是否已经切换到最后一个面板
                 */
                isLast: false,

                /**
                 * 当前面板数量
                 */
                length: panels.length,

                /**
                 * 是否已经切换到第一个面板，为 isFirst 属性的获取器。
                 */
                getIsFirst: function() {
                    return self.isFirst;
                },

                /**
                 * 是否已经切换到最后一个面板，为 isLast 属性的获取器。
                 */
                getIsLast: function() {
                    return self.isLast;
                },

                /**
                 * 获取当前面板索引，为 currentIndex 属性的获取器。
                 */
                getCurrentIndex: function() {
                    return this.currentIndex;
                },

                /**
                 * 获取当前面板总数量，为 length 属性的获取器。
                 */
                getLength: function() {
                    return this.length;
                },

                /**
                 * 切换到当前面板的上一个面板
                 * @return 若当前面板的上一个面板存在且可以切换，则返回 true，否则返回 false。
                 */
                prev: function() {
                    return self.switch(this.currentIndex - 1);
                },

                /**
                 * 切换到当前面板的下一个面板
                 * @return 若当前面板的下一个面板存在且可以切换，则返回 true，否则返回 false。
                 */
                next: function() {
                    self.switch(this.currentIndex + 1);
                },

                /**
                 * 切换到所指定的面板
                 * @param flag {number|string} 若为数字，则为要切换面板的索引，若为字符串，则为一个筛选选择器。
                 * @return 若需切换的面板存在且可以切换，则返回 true，否则返回 false。
                 */
                switch: function(flag) {
                    var result = this._switch(flag);

                    if (result) {
                        history.appendNode(result);
                    }
                },

                /**
                 * 返回到上一次切换时的当前面板
                 */
                backup: function() {

                    if(history.lastNode) {
                        var index = history.lastNode.$prevNode ? history.lastNode.$prevNode.index : -1;
                        history.remove(history.lastNode);
                        if(index!=-1) {
                            this._switch(index);
                        }
                    }
                },

                /**
                 * 切换到所指定的面板
                 * @param flag {number|string} 若为数字，则为要切换面板的索引，若为字符串，则为一个筛选选择器。
                 * @return 返回切换相关信息
                 */
                _switch: function(flag) {
                    var index, panel;

                    if (typeof flag === 'number') {
                        index = flag;
                        panel = panels.eq(index);
                    }
                    else if (typeof flag === 'string') {
                        panel = panels.filter(flag);
                        index = panel.index();
                    }

                    if (index === self.currentIndex || !panel.length) {
                        return undefined;
                    }
                    else {
                        var switchInfo = {
                            index: index,
                            panel: panel,
                            panelName: panel.attr('name') || panel.attr('data-name'),
                            flag: flag
                        };

                        panel.show();
                        self.current && self.current.hide();
                        setCurrent(index, panel);

                        $scope.onSwitch && $scope.onSwitch( { $info: switchInfo } );

                        return switchInfo;
                    }
                }
            });

            // 初始化操作
            panels.hide();  // 默认将所有面板隐藏
            self.switch(0); // 默认显示第一个面板

            var deregisterInstance = cmSwitcherDelegate._registerInstance(self, $attrs.delegateHandle);

            $scope.$on('$destroy', function() {

                deregisterInstance();
            });

            /**
             * 设置当前面板
             * @param index {number} 需设置为当前面板的索引
             */
            function setCurrent(index, panel) {
                var length = self.length;

                if (0 <= index && index < length) {
                    self.currentIndex = index;
                    self.current = panel;
                    self.isFirst = index === 0;
                    self.isLast = index === length;
                    return true;
                }
                else {
                    return false;
                }
            }
        }],

        compile: function(el, attrs) {
            var $el = $(el);
            $el.addClass('switcher');
        }
    };
});

angular.module('app.directives').service('cmSwitcherDelegate', ionic.DelegateService([
    'next',
    'prev',
    'getIsFirst',
    'getIsLast',
    'getCurrentIndex',
    'getLength',
    'switch',
    'backup'
]));

/**
 * 动态计算并设置高度
 */

angular.module('app.directives').directive('cmDynamicHeight', ["$rootScope", "$timeout", function(
    $rootScope, $timeout
) {
    var _r_width = /\$width\b/;

    return {
        restrict: 'A',
        priority: 1,
        link: function($scope, $el, $attrs) {
            var expression = $attrs.cmDynamicHeight,
                el = $el[0],
                h;

            $timeout(setHeight);

            window.addEventListener('resize', setHeight);
            h = $rootScope.$on('$ionicView.enter', setHeight);

            function setHeight() {
                if ($el.is(':hidden')) return;

                var width = $el.width(),
                    height = $scope.$eval(expression, {
                        $width: width
                    });

                if (height == null) height = '';

                if (typeof height === 'number') {
                    height = height + 'px';
                }

                el.style.height = height;

                $scope.$broadcast('resize', {
                    width: width,
                    height: height
                });
            }

            $scope.$on('$destroy', function() {
                window.removeEventListener('resize', setHeight);
                h();
            });
        }
    };
}])
;

/**
 * 图片盒子
 */
angular.module('app.directives').directive('cmImageBox', ["$compile", function(
    $compile
) {
    /**
     * 将原尺寸缩放使之能够填充目标尺寸，缩放后尺寸小于或等于目标尺寸，
     * 且有一边与原尺寸相同。
     * @param w1 目标尺寸 - 宽度
     * @param h1 目标尺寸 - 高度
     * @param w2 原尺寸 - 宽度
     * @param h2 原尺寸 - 高度
     */
    function contain(w1, h1, w2, h2) {
        var ar1 = w1 / h1,  // aspect ratio
            ar2 = w2 / h2,
            tw, th,
            tz;

        if (ar1 > ar2) {
            tz = h1 / h2;
            tw = w2 * tz; th = h1;
        }
        else if (ar1 < ar2) {
            tz = w1 / w2;
            tw = w1; th = h2 * tz;
        }
        else {
            tz = w1 / w2;
            tw = w1; th = h1;
        }

        return { width: tw, height: th, zoom: tz };
    }

    /**
     * 将原尺寸缩放使之能够填充目标尺寸，缩放后尺寸大于或等于目标尺寸，
     * 且有一边与原尺寸相同。
     * @param w1 目标尺寸 - 宽度
     * @param h1 目标尺寸 - 高度
     * @param w2 原尺寸 - 宽度
     * @param h2 原尺寸 - 高度
     */
    function cover(w1, h1, w2, h2) {
        var ar1 = w1 / h1,  // aspect ratio
            ar2 = w2 / h2,
            tw, th,
            tz;

        if (ar1 > ar2) {
            tz = w1 / w2;
            tw = w1; th = h2 * tz;
        }
        else if (ar1 < ar2) {
            tz = h1 / h2;
            tw = w2 * tz; th = h1;
        }
        else {
            tz = w1 / w2;
            tw = w1; th = h1;
        }

        return { width: tw, height: th, zoom: tz };
    }

    /**
     * 图片头数据加载就绪事件 - 更快获取图片尺寸
     * @author  TangBin
     * @see     http://www.planeart.cn/?p=1121
     * @param   {String}      图片路径
     * @param   {Function}    尺寸就绪
     * @param   {Function}    加载完毕 (可选)
     * @param   {Function}    加载错误 (可选)
     * @example
     *      imgReady(
     *          'http://www.site.com/image/01.jpg',
     *          function() {
     *              alert('size Ready: width = ' + this.width + '; height = ' + this.height);
     *          }
     *      );
     */
    var imgReady = (function () {
        var list = [], intervalId = null,

            // 用来执行队列
            tick = function () {
                var i = 0;
                for (; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                };
                !list.length && stop();
            },

            // 停止所有定时器队列
            stop = function () {
                clearInterval(intervalId);
                intervalId = null;
            };

        return function (url, ready, load, error) {
            var onready, width, height, newWidth, newHeight,
                img = new Image();

            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready.call(img);
                load && load.call(img);
                return;
            };

            width = img.width;
            height = img.height;

            // 加载错误后的事件
            img.onerror = function () {
                error && error.call(img);
                onready.end = true;
                img = img.onload = img.onerror = null;
            };

            // 图片尺寸就绪
            onready = function () {
                newWidth = img.width;
                newHeight = img.height;
                if (newWidth !== width || newHeight !== height ||
                    // 如果图片已经在其他地方加载可使用面积检测
                    newWidth * newHeight > 1024
                   ) {
                       ready.call(img);
                       onready.end = true;
                   };
            };
            onready();

            // 完全加载完毕的事件
            img.onload = function () {
                // onload在定时器时间差范围内可能比onready快
                // 这里进行检查并保证onready优先执行
                !onready.end && onready();

                load && load.call(img);

                // IE gif动画会循环执行onload，置空onload即可
                img = img.onload = img.onerror = null;
            };

            // 加入队列中定期执行
            if (!onready.end) {
                list.push(onready);
                // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                if (intervalId === null) intervalId = setInterval(tick, 40);
            };
        };
    })();

    return {
        restrict: 'EA',

        priority: 0,

        scope: {
            // 图片路径
            src: '@?'
        },

        compile: function(el, attrs) {
            var $el = $(el);
            $el.addClass('image-box').css({
                position: 'relative',
                overflow: 'hidden'
            });

            return function($scope, $element, $attrs) {
                // 待加载的图片
                var image = undefined;

                $scope.$on('resize', function(event, newSize) {
                    compute();
                });

                imgReady(
                    $scope.src,
                    // 图片预加载完成
                    function() {
                        image = $(this);
                        image.data('original-width', this.width);
                        image.data('original-height', this.height);
                    },
                    // 图片加载完成
                    function() {
                        insert();
                    },
                    // 图片加载失败
                    function() {
                    });

                /**
                 * 将图片插入容器中
                 */
                function insert() {
                    if (!image) { return; }

                    $element.append(image);
                    compute();
                }

                /**
                 * 计算图片的显示尺寸及位置
                 */
                function compute() {
                    if (!image) { return; }

                    var boxWidth = $element.innerWidth(),
                        boxHeight = $element.innerHeight(),

                        originalWidth = image.data('original-width'),
                        originalHeight = image.data('original-height'),

                        computedImageSize = contain(boxWidth, boxHeight, originalWidth, originalHeight),

                        x = (boxWidth - computedImageSize.width) / 2,
                        y = (boxHeight - computedImageSize.height) / 2;

                    image.css({
                        position: 'absolute',
                        width: computedImageSize.width,
                        height: computedImageSize.height,
                        left: x,
                        top: y
                    });

                }
            };
        }
    };
}]);

/**
 * 计数器
 */
angular.module('app.directives')
    .directive('cmCounter', function factory() {
        return {
            restrict: 'EA',

            template: [
                '<button class="counter-dec counter-transparent">-</button>',
                '   <input class="counter-num counter-transparent" id="{{inputId}}" name="{{inputName}} "',
                '       ng-model="ngModel.$viewValue" type="text" ng-readonly="{{inputReadonly}}"/>',
                '<button class="counter-inc counter-transparent">+</button>',
            ].join(''),

            scope: {
                inputName: '@',
                inputId: '@',
                delayTriggerChange: '@',
                maxNum: '=',
                minNum: '=',
                inputReadonly: '=',
                onChange: '&'
            },

            require: 'ngModel',

            link: function ($scope, el, attrs, ngModel) {
                $scope.ngModel = ngModel;

                var input = el.find('> .counter-num'),
                    decBtn = el.find('> .counter-dec'),
                    incBtn = el.find('> .counter-inc'),

                    prevValue = ngModel.$viewValue,

                    changeTimeout;

                el.addClass('counter').removeAttr('name');

                input.on('change', function () {
                    refresh();
                    // $scope.$apply();
                })

                decBtn.on('click', function () {
                    ngModel.$setViewValue(Math.max(ngModel.$viewValue - 1, getMinNum()));
                    refresh();
                    // $scope.$apply();
                });
                incBtn.on('click', function () {
                    ngModel.$setViewValue(Math.min(ngModel.$viewValue + 1, getMaxNum()));
                    refresh();
                    // $scope.$apply();
                });

                ngModel.$viewChangeListeners.push(function () {
                    if (prevValue !== ngModel.$viewValue) {
                        triggerChange();
                    }
                });

                ngModel.$render = function () {
                    prevValue = ngModel.$viewValue;
                    refresh();
                };

                $scope.$watch('minNum', function () {
                    refresh();
                });

                $scope.$watch('maxNum', function () {
                    refresh();
                });

                function triggerChange() {
                    if ($scope.delayTriggerChange) {
                        clearTimeout(changeTimeout);
                        changeTimeout = setTimeout(function () {
                            changeTimeout = undefined;
                            runChange();
                        }, parseInt($scope.delayTriggerChange) || 400);
                    } else {
                        runChange();
                    }
                }

                function runChange() {
                    if (prevValue == ngModel.$viewValue) {
                        return;
                    }

                    var prev = prevValue;
                    prevValue = ngModel.$viewValue;

                    var promise = $scope.onChange({
                        $newNumber: ngModel.$viewValue,
                        $oldNumber: prev
                    });

                    if (!$scope.$$phase) {
                        // $scope.$apply();
                    }

                    // 如果事件处理函数返回一个 promise，则处理该 promise 的错误状态，
                    // 当出现错误时，回退到修改之前的值，且此次回退不会再次触发修改事件。
                    if (promise) {
                        promise.catch(function (data) {
                            prevValue = prev;
                            ngModel.$setViewValue(prevValue);
                            throw data;
                        });
                    }
                }

                function refresh() {
                    if (ngModel.$isEmpty(ngModel.$viewValue)) {
                        ngModel.$setViewValue(prevValue);
                        return;
                    }

                    ngModel.$viewValue = parseInt(ngModel.$viewValue);

                    if (_.isNaN(ngModel.$viewValue)) {
                        ngModel.$setViewValue(prevValue);
                        return;
                    }

                    var minNum = getMinNum(),
                        maxNum = getMaxNum(),
                        isMin = ngModel.$viewValue <= minNum,
                        isMax = ngModel.$viewValue >= maxNum;

                    if (minNum > maxNum) {
                        throw '最小值不能大于最大值';
                    }

                    decBtn.toggleClass('disabled', isMin).prop('disabled', isMin);
                    incBtn.toggleClass('disabled', isMax).prop('disabled', isMax);
                    if (isMin && isMax) {
                        input.addClass('disabled').prop('readonly', true);
                    }

                    ngModel.$setViewValue(Math.min(Math.max(minNum, ngModel.$viewValue), maxNum));
                }

                function getMinNum() {
                    var minNum = parseInt($scope.minNum, 10);
                    return angular.isNumber(minNum) && !isNaN(minNum) ? minNum : -Infinity;
                }

                function getMaxNum() {
                    var maxNum = parseInt($scope.maxNum, 10);
                    return angular.isNumber(maxNum) && !isNaN(maxNum) ? maxNum : Infinity;
                }
            }
        };
    });

/**
 * 设置订单列表页商品滑动容器宽度
 */

angular.module('app')
    .directive('cmAdjustParentWidth', ["$timeout", function ($timeout) {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, $el, $attrs) {
                if ($scope.$last === true) {
                    $timeout(function () {
                        var width = $el.width(),
                            siblings = $el.siblings();
                        for (var i = 0; i < siblings.length; i++) {
                            width += $(siblings[i]).width();
                        }
                        $el.parent().css('width', width + 'px');
                    });
                }
            }
        };
    }])
;

/**
 * 设置订单列表页商品滑动容器宽度
 */

angular.module('app').directive('cmImageVerifyCode', ["globalService", function(
    globalService
) {
    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attrs) {
            var isLoading = false;

            loadImage();

            $element.on('click', loadImage);

            function loadImage() {
                if (isLoading) return;

                isLoading = true;
                globalService.imageVerifyCode().success(function(data) {
                    var base64Str = 'data:' + data.dataType + ';base64,' + data.base64;
                    $element.attr('src', base64Str);
                    isLoading = false;
                });
            }
        }
    };
}])
;

/**
 * 用于隐藏应用 tabs 的指令
 * <ion-view title="page title" cm-hide-tabs>
 *     <!-- something -->
 * </ion-view>
 */
angular.module('app.directives')
    .directive('cmHideTabs', ["$timeout", function factory($timeout) {
        var count = 0,

            HIDE_CLASS = 'hide-tabs',
            BODY_HIDE_CLASS = 'hide-app-tabs',

            // data name
            DN_ID = 'cm-hide-tabs-id';

        return {
            restrict: 'A',

            link: function($scope, $el, $attrs) {
                var id = count++,

                    body = angular.element(document.body),
                    appTabs = angular.element('.app-tabs'),

                    set = $attrs.cmHideTabs,

                    isHideTabs,

                    prevIsHide = appTabs.is('.' + HIDE_CLASS),
                    prevHideId = appTabs.data(DN_ID);

                appTabs.data(DN_ID, id);

                init();


                function init() {
                    switch (set) {
                        case 'true':
                            isHideTabs = true;
                            hideTabs();
                            break;
                        case 'false':
                            isHideTabs = false;
                            showTabs();
                            break;
                        case 'inherit':
                            if (prevIsHide) {
                                isHideTabs = true;
                                hideTabs();
                            }
                            else {
                                isHideTabs = false;
                                showTabs();
                            }
                            break;
                    }
                }
                function hideTabs() {
                    appTabs.addClass(HIDE_CLASS);
                    body.addClass(BODY_HIDE_CLASS);
                    $scope.$hasTabs = false;
                }

                function showTabs() {
                    appTabs.removeClass(HIDE_CLASS);
                    body.removeClass(BODY_HIDE_CLASS);
                    $scope.$hasTabs = true;
                }

                function restore() {
                    appTabs.data(DN_ID, prevHideId);
                    if (prevIsHide === isHideTabs) { return; }

                    if (prevIsHide) {
                        hideTabs();
                    }
                    else {
                        showTabs();
                    }
                }

                init();

                $scope.$on('$ionicView.beforeEnter', function(event, info) {
                    var deregistration = $scope.$on('$stateChangeSuccess', function(event, info) {
                        init();
                        deregistration();
                    });
                });
            }
        };
    }]);

/**
 * 实现选择优惠券功能
 */
angular.module('app.directives').directive('cmSelectRegion', function factory() {

    // 格式化地区名称为如下格式：
    //   中国，北京，昌平区
    function formatRegionsName(regions) {
        var name = "";

        _.forEach(regions, function(region) {
            name += region.name;
        });

        return name;
    }

    return {
        restrict: 'A',
        require: '?ngModel',

        link: function($scope, $el, $attrs, ngModel) {
            if (!ngModel) return;

            $el.on('click', function() {
                $scope.modals.selectAddressRegion.open({
                    params: {
                        successCallback: (function(regionId, regions) {
                            ngModel.$setViewValue(regions);
                            ngModel.$render();
                            $scope.$eval($attrs.ngChange);
                        }).bind(this),
                        regions: ngModel.$modelValue
                    }
                });
            });

            ngModel.$formatters = [];
            ngModel.$viewChangeListeners = [];

            ngModel.$render = function() {
                $el.val(formatRegionsName(ngModel.$modelValue));
            };
        }
    };
});

/**
 * 实现选择优惠券功能
 */
angular.module('app.directives').directive('cmMemberSelectRegion', function factory() {

    // 格式化地区名称为如下格式：
    //   中国，北京，昌平区
    function formatRegionsName(regions) {
        var name = "";

        _.forEach(regions, function(region) {
            name += region.name;
        });

        return name;
    }

    return {
        restrict: 'A',
        require: '?ngModel',

        link: function($scope, $el, $attrs, ngModel) {
            if (!ngModel) return;

            $el.on('click', function() {
                $scope.modals.memberSelectAddressRegion.open({
                    params: {
                        successCallback: (function(regionId, regions) {
                            ngModel.$setViewValue(regions);
                            ngModel.$render();
                            $scope.$eval($attrs.ngChange);
                        }).bind(this),
                        regions: ngModel.$modelValue
                    }
                });
            });

            ngModel.$formatters = [];
            ngModel.$viewChangeListeners = [];

            ngModel.$render = function() {
                $el.val(formatRegionsName(ngModel.$modelValue));
            };
        }
    };
});

/**
 * 表单组
 */
angular.module('app.directives').directive('cmItemFormGroup', ["$timeout", function factory($timeout) {

    return {
        require: '^form',
        priority: 700,
        link: function($scope, $el, $attrs, formCtrl) {
            $timeout(function() {
                var input = $el.find('.input-field'),
                    helpBlock = $el.find('.mini-help-block'),

                    name = input.attr('name'),
                    first = true;

                if (!name || !formCtrl[name]) { return; }

                input.focus(function(e) {
                    getHelpBlockText().removeClass('ng-hide');
                });

                input.blur(function(e) {
                    getHelpBlockText().addClass('ng-hide');
                    first = false;
                });

                helpBlock.click(function(e) {
                    getHelpBlockText().toggleClass('ng-hide');
                    e.stopImmediatePropagation();
                    e.preventDefault();
                });

                function getHelpBlockText() {
                    return $el.find('.mini-help-block .text').addClass('ng-hide-animate');
                }

                // 监听表单校验的结果，如果校验成功，为表单项添加表示成功或失败的 class。
                var listener = $scope.$watch(function() {
                    return formCtrl[name].$valid ? 'success' : formCtrl[name].$invalid ? 'danger' : '';
                }, function (newStateClass, oldStateClass) {
                    $el.removeClass(oldStateClass).addClass(newStateClass);
                });

                // 监听表单域改变，刷新帮助信息的显示状态。
                input.one('blur', function (e) {
                    helpBlock.toggleClass('ng-hide');
                });

                $scope.$on('$destroy', function() {
                    listener();
                });
            });
        }
    };
}]);

/**
 * 倒计时，最高支持天单位。
 *
 * 该指令会替换所在元素为如下结构：
 *
 * ```HTML
 * <div class="countdown">
 *   <span class="countdown-item countdown-item-text countdown-is-end">已结束</span>
 *   <span class="countdown-item countdown-item-text countdown-not-started">未开始</span>
 *   <div class="countdown-time-cont">
 *     <span class="countdown-item countdown-item-day">10</span>
 *     <span class="countdown-item countdown-item-day-text">天</span>
 *     <span class="countdown-item countdown-item-hour">10</span>
 *     <span class="countdown-item countdown-item-colon countdown-item-colon-hour">:</span>
 *     <span class="countdown-item countdown-item-minute">10</span>
 *     <span class="countdown-item countdown-item-colon">:</span>
 *     <span class="countdown-item countdown-item-second">10</span>
 *   </div>
 * </div>
 * ```
 *
 * @param starttime(?) {String<Date>} 倒计时开始时间
 * @param endtime(?) {String<Date>} 倒计时结束时间
 * @param duration(?) {Integer} 倒计时时长，以毫秒为单位。如果只设置开始时间而没有结束时间，则根据该参数计算出结束时间；如果也没有开始时间，则以当前时间为开始时间。
 * @param autoHideDay(?) {Boolean} 是否在天数为 0 时自动隐藏相关元素
 * @param autoHideHour(?) {Boolean} 是否在小时数为 0 时自动隐藏相关元素
 *
 * @example
 * <!-- 设置一个立即开始的二十秒倒计时 -->
 * <cm-countdown duration="20000"></div>
 * <!-- 设置一个自指定时间开始的二十秒倒计时 -->
 * <cm-countdown starttime="2015-05-17 20:47:23" duration="20000"></div>
 * <!-- 设置一个自指定时间开始并在指定时间结束的倒计时 -->
 * <cm-countdown starttime="2015-05-17 20:47:23" endtime="2015-05-17 20:47:43"></div>
 */
angular.module('app.directives')
    .directive('cmCountdown', ["$interval", function factory($interval) {
        var SECONDS = 1000,
            MINUTES = SECONDS * 60,
            HOURS   = MINUTES * 60,
            DAYS    = HOURS * 24;

        return {
            restrict: 'EA',

            replace: true,
            transclude: true,
            template: [
                '<div class="countdown">',
                    '<span class="countdown-item countdown-item-text countdown-is-end">已结束</span>',
                    '<span class="countdown-item countdown-item-text countdown-not-started">未开始</span>',
                    '<div class="countdown-time-cont">',
                        '<span class="countdown-item countdown-item-day"></span>',
                        '<span class="countdown-item countdown-item-day-text">天</span>',
                        '<span class="countdown-item countdown-item-hour"></span>',
                        '<span class="countdown-item countdown-item-colon countdown-item-colon-hour">:</span>',
                        '<span class="countdown-item countdown-item-minute"></span>',
                        '<span class="countdown-item countdown-item-colon">:</span>',
                        '<span class="countdown-item countdown-item-second"></span>',
                    '</div>',
                '</div>'
            ].join(''),

            scope: {
                onEnd: '&'
            },

            link: function($scope, el, attrs) {
                var isEndEl = el.find('.countdown-is-end'),
                    notStartedEl = el.find('.countdown-not-started'),
                    timeContEl = el.find('.countdown-time-cont'),

                    dayEl = el.find('.countdown-item-day'),
                    dayTextEl = el.find('.countdown-item-day-text'),
                    hourEl = el.find('.countdown-item-hour'),
                    hourColonEl = el.find('.countdown-item-colon-hour'),
                    minuteEl = el.find('.countdown-item-minute'),
                    secondEl = el.find('.countdown-item-second'),

                    isShowIsEndEl = true,
                    isShowNotStartedEl = true,
                    isShowDayEl = true,
                    isShowHourEl = true,
                    isRunEndEvent = false,

                    duration = parseInt(attrs.duration, 10),

                    start = parseTime(attrs.starttime),
                    end = parseTime(attrs.endtime),

                    isAutoHideDay = attrs.autoHideDay === 'true',
                    isAutoHideHour = attrs.autoHideHour === 'true',

                    interval;

                if ( !(start && start.isValid()) ) {
                    start = moment();
                }

                if ( duration && !(end && end.isValid()) ) {
                    end = moment(start + duration);
                }

                hideNotStartedEl();
                hideIsEndEl();

                refresh();
                interval = setInterval(refresh, 1000);

                $scope.$on('$destroy', function() {
                    clearInterval(interval);
                });

                function parseTime(timeStr) {
                    var parser = [
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD HH:mm:ss', true);
                        },
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD HH:mm', true);
                        },
                        function(timeStr) {
                            return moment(timeStr, 'YYYY-MM-DD', true);
                        },
                        function(timeStr) {
                            return moment(Number(timeStr));
                        }
                    ];

                    for (var i = 0; i < parser.length; i++) {
                        var m = parser[i](timeStr);
                        if (m.isValid()) {
                            return m;
                        }
                    }

                    return undefined;
                }

                function refresh() {
                    var now = moment();

                    // 未开始
                    if (now < start) {
                        showNotStartedEl();
                    }
                    // 已结束
                    else if (now > end) {
                        showIsEndEl();

                        if (!isRunEndEvent) {
                            $scope.onEnd();
                            isRunEndEvent = true;
                        }

                        clearInterval(interval);
                    }
                    // 进行中
                    else {
                        hideIsEndEl();
                        hideNotStartedEl();

                        var diff = end.diff(now);
                        var day = Math.floor(diff / DAYS);
                        diff = diff % DAYS;
                        var hour = Math.floor(diff / HOURS);
                        diff = diff % HOURS;
                        var minute = Math.floor(diff / MINUTES);
                        diff = diff % MINUTES;
                        var second = Math.floor(diff / SECONDS);

                        diff = diff % HOURS;

                        dayEl.text(day);
                        hourEl.text(hour < 10 ? '0' + hour : hour);
                        minuteEl.text(minute < 10 ? '0' + minute : minute);
                        secondEl.text(second < 10 ? '0' + second : second);

                        if (day > 0) { if (day === 1) { showDayEl(); } }
                        else if(isAutoHideDay) { hideDayEl(); }

                        if (hour > 0) { if (hour === 1) { showHourEl(); } }
                        else if(isAutoHideHour) { hideHourEl(); }
                    }
                }

                function hideDayEl() {
                    if (isShowDayEl === true) {
                        dayEl.hide();
                        dayTextEl.hide();
                        isShowDayEl = false;
                    }
                }

                function showNotStartedEl() {
                    if (isShowNotStartedEl === false) {
                        notStartedEl.show();
                        timeContEl.hide();
                        isShowNotStartedEl = true;
                    }
                }

                function showIsEndEl() {
                    if (isShowIsEndEl === false) {
                        isEndEl.show();
                        timeContEl.hide();
                        isShowIsEndEl = true;
                    }
                }

                function hideIsEndEl() {
                    if (isShowIsEndEl === true) {
                        isEndEl.hide();
                        timeContEl.show();
                        isShowIsEndEl = false;
                    }
                }

                function hideNotStartedEl() {
                    if (isShowNotStartedEl === true) {
                        notStartedEl.hide();
                        timeContEl.show();
                        isShowNotStartedEl = false;
                    }
                }

                function showDayEl() {
                    if (isShowDayEl === false) {
                        dayEl.show();
                        dayTextEl.show();
                        isShowDayEl = true;
                    }
                }

                function hideHourEl() {
                    if (isShowHourEl === true) {
                        hourEl.hide();
                        hourColonEl.hide();
                        isShowHourEl = false;
                    }
                }

                function showHourEl() {
                    if (isShowHourEl === false) {
                        hourEl.show();
                        hourColonEl.show();
                        isShowHourEl = true;
                    }
                }
            }
        };
    }]);

/**
 * 验证是否是有效的中国手机号码
 */
angular.module('app.directives').directive('cmvMobile', function factory() {
    var regexp = /^1\d{10}$/i;

    return {
        restrict: 'A',
        require: 'ngModel',

        link: function($scope, $el, $attrs, m) {
            m.$validators.mobile = function(mval) {
                return m.$isEmpty(mval) ? true : regexp.test(mval);
            };
        }
    };
});

angular.module('app.directives').directive('cmSearchBar', ["$timeout", function factory($timeout) {
    return function($scope, $el, $attrs) {

        var input = $el.find('input[type=search]');

        $scope.$on('$ionicView.beforeLeave', function() {
            input.blur();
        });
    };
}]);

/**
 * 商品清单列表收起时的处理
 */
angular.module('app.directives').directive('showMore', ["$ionicScrollDelegate", function factory($ionicScrollDelegate) {

    //是否收起更多
    var hideMore = false;

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $el, $attrs) {
            hideMore = JSON.parse($attrs.hideMore);
            //操作元素隐藏显示
            showMoreOption($el);
            //添加展开、收起点击事件
            $el.find('.info-list-more').on('click',function() {

                //修改状态
                hideMore = !hideMore;
                //操作元素隐藏显示
                showMoreOption($el);
            });
        }
    };

    /**
     * 隐藏、显示元素
     */
    function showMoreOption(el) {
        var $infolist = el.find('.info-list');
        if(hideMore) {
            if($infolist.hasClass('max-list')) {
                $infolist.removeClass('max-list')
            }
            el.find('.list-down').hide();
            el.find('.list-up').show();
        }else {
            $infolist.addClass('max-list');
            offsetTop = $infolist.offset().top;
            el.find('.list-down').show();
            el.find('.list-up').hide();
        }

        $(window).resize();
    }
}]);

/**
 * 切换中英文指令 检测到当前为英文时 添加一个class 解决样式问题
 */
angular.module('app.directives').directive('changeLanguage',["$translate", function($translate) {

    return {
        restrict: 'A',
        link: function($scope, $el, $attrs, m) {

            // 检测当前语言是否添加class
            toggleClass();

            // 切换语言检测是否需要添加class
            $el.find('.toggle-language').on('click',function() {
                toggleClass();
            });

            function toggleClass() {
                if(APP_CONFIG.language == 'en') {
                    $el.addClass('lang-en');
                }else {
                    if($el.hasClass('lang-en')) {
                        $el.removeClass('lang-en');
                    }
                }
                $('title').text($translate.instant('title'));
            }
        }
    }


}]);

// /**
//  * 垂直拖动切换视图
//  */
// angular.module('app.directives')
//
// .directive('cmVerticalSwitchUp', function($ionicScrollDelegate, $timeout) {
//
//     return {
//         restrict: 'A',
//         scope: false,
//         link: function($scope, $element, $attr) {
//             var dragCount = 0;
//             var dragTimeout;
//             var handle = $ionicScrollDelegate.$getByHandle($element.attr('delegate-handle'));
//             var target = $scope[$attr.cmVerticalSwitchUp];
//             var lastPageY = 0;
//
//             $element.on('touchstart', function(e) {
//                 lastPageY = e.originalEvent.targetTouches[0].pageY;
//             });
//
//             $element.on('touchmove', ionic.throttle(function(e) {
//                 var pageY = e.originalEvent.targetTouches[0].pageY;
//                 var offset = pageY - lastPageY;
//                 lastPageY = pageY;
//                 if (offset >= 0) return;
//
//                 if (handle.getScrollPosition().top >= handle.getScrollView().__maxScrollTop) {
//                     e.preventDefault();
//                     if (dragCount < 5) {
//                         dragCount++;
//                         clearTimeout(dragTimeout);
//                         dragTimeout = setTimeout(function () {
//                             dragCount = 0;
//                         }, 100);
//                     } else {
//                         $timeout(function() {
//                             target.switched = true;
//                             dragCount = 0;
//                         });
//                         clearTimeout(dragTimeout);
//                     }
//                 }
//             }, 40));
//         }
//     };
// })
//
// .directive('cmVerticalSwitchDown', function($ionicScrollDelegate, $timeout) {
//
//     return {
//         restrict: 'A',
//         scope: false,
//         link: function($scope, $element, $attr) {
//             var dragCount = 0;
//             var dragTimeout;
//             var handle = $ionicScrollDelegate.$getByHandle($element.attr('delegate-handle'));
//             var target = $scope[$attr.cmVerticalSwitchDown];
//             var lastPageY = 0;
//
//             $element.on('touchstart', function(e) {
//                 lastPageY = e.originalEvent.targetTouches[0].pageY;
//             });
//
//             $element.on('touchmove', ionic.throttle(function(e) {
//                 var pageY = e.originalEvent.targetTouches[0].pageY;
//                 var offset = pageY - lastPageY;
//                 lastPageY = pageY;
//                 if (offset <= 0) return;
//
//                 if (handle.getScrollPosition().top <= 0) {
//                     e.preventDefault();
//                     if (dragCount < 5) {
//                         dragCount++;
//                         clearTimeout(dragTimeout);
//                         dragTimeout = setTimeout(function () {
//                             dragCount = 0;
//                         }, 100);
//                     } else {
//                         $timeout(function() {
//                             target.switched = false;
//                             dragCount = 0;
//                         });
//                         clearTimeout(dragTimeout);
//                     }
//                 }
//             }, 40));
//         }
//     };
// });
/**
 * 垂直拖动切换视图
 */
angular.module('app.directives')

.directive('cmVerticalSwitchUp', ["$ionicScrollDelegate", "$timeout", function ($ionicScrollDelegate, $timeout) {

    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $attr) {
            var dragCount = 0;
            var dragTimeout;
            var handle = $ionicScrollDelegate.$getByHandle($element.attr('delegate-handle'));
            var target = $scope[$attr.cmVerticalSwitchUp];
            var lastPageX = 0;
            var lastPageY = 0;
            var sumX = 0;
            var scrollContent = $element.children();
            // var isAndroid = ionic.Platform.isAndroid();

            $element.on('touchstart', function (e) {
                var touch = e.originalEvent.targetTouches[0];
                lastPageX = touch.pageX;
                lastPageY = touch.pageY;
                sumX = 50;
            });

            $element.on('touchmove', ionic.throttle(function (e) {
                if (sumX <= 0 || target.switched) return;
                var touches = e.originalEvent.targetTouches;
                if (touches.length > 1) {
                    dragCount = 0;
                    return;
                }
                var pageX = touches[0].pageX;
                var pageY = touches[0].pageY;
                sumX -= Math.abs(pageX - lastPageX);
                lastPageX = pageX;
                var offset = pageY - lastPageY;
                lastPageY = pageY;
                if (offset >= 0) return;

                var maxScrollTop = 0;
                // if (isAndroid) {
                //     var contentHeight = 0;
                //     scrollContent.children().each(function() {
                //         contentHeight += $(this).outerHeight(true);
                //     });
                //     maxScrollTop = contentHeight - $element.height();
                // } else {
                maxScrollTop = handle.getScrollView().__maxScrollTop;
                // }
                if (handle.getScrollPosition().top >= maxScrollTop - 5) {
                    e.preventDefault();
                    if (dragCount < 5) {
                        dragCount++;
                        clearTimeout(dragTimeout);
                        dragTimeout = setTimeout(function () {
                            dragCount = 0;
                        }, 100);
                    }
                    if (dragCount >= 5 || offset <= -100) {
                        $timeout(function () {
                            target.switched = true;
                            dragCount = 0;
                        });
                        clearTimeout(dragTimeout);
                    }
                }
            }, 40));
        }
    };
}])

.directive('cmVerticalSwitchDown', ["$ionicScrollDelegate", "$timeout", function ($ionicScrollDelegate, $timeout) {

    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $attr) {
            var scrollContent = $element.parent()[0];
            var dragCount = 0;
            var dragTimeout;
            var handle = $ionicScrollDelegate.$getByHandle($element.attr('delegate-handle'));
            var target = $scope[$attr.cmVerticalSwitchDown];
            var lastPageX = 0;
            var lastPageY = 0;
            var sumX = 0;
            var dragStart = false;
            var lastPosition = 0;

            function reset() {
                dragStart = false;
                lastPosition = 0;
                scrollContent.style[ionic.CSS.TRANSITION] = 'transform 0.3s ease';
                scrollContent.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
                handle.freezeScroll(false);
            }

            $element.on('touchstart', function (e) {
                scrollContent.style[ionic.CSS.TRANSITION] = 'none';
                scrollContent.style[ionic.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
                dragStart = false;
                lastPosition = 0;
                var touch = e.originalEvent.targetTouches[0];
                lastPageX = touch.pageX;
                lastPageY = touch.pageY;
                sumX = 50;
            });

            $element.on('touchmove', ionic.throttle(function (e) {
                if (sumX <= 0 || !target.switched) return;
                var touches = e.originalEvent.targetTouches;
                if (touches.length > 1) {
                    dragCount = 0;
                    return;
                }
                var pageX = touches[0].pageX;
                var pageY = touches[0].pageY;
                var offset = pageY - lastPageY;
                lastPageY = pageY;

                if (!dragStart) {
                    sumX -= Math.abs(pageX - lastPageX);
                    if (handle.getScrollPosition().top <= 0 && offset > 0) {
                        e.preventDefault();
                        if (dragCount >= 2) {
                            dragCount = 0;
                            dragStart = true;
                            clearTimeout(dragTimeout);
                            handle.freezeScroll(true);
                        } else {
                            dragCount++;
                            clearTimeout(dragTimeout);
                            dragTimeout = setTimeout(function () {
                                dragCount = 0;
                            }, 100);
                        }
                    }
                } else {
                    e.preventDefault();
                    var translateY = Math.max(0, Math.min(40, offset + lastPosition));
                    if (translateY != lastPosition) {
                        ionic.requestAnimationFrame(function () {
                            scrollContent.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + translateY + 'px, 0)';
                        });
                        lastPosition = translateY;
                    }
                    if (lastPosition === 40) {
                        if (dragCount >= 10) {
                            dragCount = 0;
                            clearTimeout(dragTimeout);
                            reset();
                            $timeout(function () {
                                target.switched = false;
                            });
                        } else {
                            dragCount++;
                            clearTimeout(dragTimeout);
                            dragTimeout = setTimeout(function () {
                                dragCount = 0;
                            }, 100);
                        }
                    }
                }
            }, 30));

            $element.on('touchend', function (e) {
                setTimeout(reset, 100);
                if (lastPosition === 40) {
                    $timeout(function () {
                        target.switched = false;
                    });
                }
            });
        }
    };
}]);

/**
 * 滚动到一定高度时显示浮动面板
 * 显示面板时会设置样式 transform: translate3d(0, 0, 0)，初始状态需要由css设置
 */
angular.module('app.directives')

.directive('cmScrollShow', ["$document", "$ionicScrollDelegate", function($document, $ionicScrollDelegate) {

    return {
        restrict: 'A',
        scope: false,
        link: function($scope, $element, $attr) {
            var scrollPanel = $element.siblings('.ionic-scroll').eq(0);
            var percentage = $scope.$eval($attr.cmScrollShow) || 0.5;
            var starty = scrollPanel.height() * percentage;

            var shown = false;

            scrollPanel.on('scroll', function(e) {
                var scrollTop = 0;
                var event = e.originalEvent;
                if (event.detail && event.detail.scrollTop) {
                    scrollTop = event.detail.scrollTop;
                } else {
                    scrollTop = event.target.scrollTop;
                }

                if (!shown && scrollTop > starty) {
                    $element.css('transform', 'translate3d(0, 0, 0)');
                    shown = true;
                }
                if (shown && scrollTop <= starty) {
                    $element.css('transform', '');
                    shown = false;
                }
            });

            $scope.$on('$ionicView.afterEnter', function() {
                if (shown) {
                    $element.css('transform', 'translate3d(0, 0, 0)');
                } else {
                    $element.css('transform', '');
                }
            });
        }
    };
}]);

/**
 * 评价等级展示指令
 * @param level (?)  评论等级  取值范围1-5  传入该参数时 为不可编辑状态
 */
angular.module('app.directives').directive('cmCommentLevel',function() {

        // 默认为最高等级
        var defaultLevel = 5;

        var template = '<div class="comment-level fl">';

        for(var i = 0; i < 5; i ++) {
            template += '<i class="icon ion-android-star-outline"></i>';
        }
        template += '</div>';
        return {
            restrict: 'E',
            replace: true,
            template: template,
            require: '?ngModel',
            link: function($scope, el, attrs,ngModel) {

                $scope.ngModel = ngModel;

                // 获取传入的评论等级
                var level = attrs.level;

                // 评论星级数组
                var icons = el.find('i');

                if(!level) {
                    // 默认最低等级
                    toggleIcon(0,icons);
                    icons.on('click',function() {
                        level = $(this).prevAll().length + 1;
                        toggleIcon(level,icons);
                        ngModel.$setViewValue(level);
                        $scope.$apply();
                    });
                }else{
                    toggleIcon(level,icons);
                }

                function toggleIcon(level,icons) {
                    for(var i =0 ;i< icons.length;i++) {
                        var icon = $(icons[i]);
                        if(i < level) {
                            icon.removeClass('ion-android-star-outline').addClass('ion-android-star');
                        }else {
                            icon.addClass('ion-android-star-outline').removeClass('ion-android-star');
                        }
                    }
                }
            }
        };
    });

/**
 * 动态绑定html片段.
 */

angular.module('app')
    .directive('cmBindHtml', ["$compile", "$ionicScrollDelegate", function factory($compile, $ionicScrollDelegate) {
        return {
            restrict: 'A',
            scope: false,
            link: function($scope, $el, $attrs) {
                var listener = $scope.$watch(
                    function() {
                        return $scope.$eval($attrs.cmBindHtml);
                    },
                    function(newValue) {
                        $el[0].innerHTML = '';
                        if (newValue && newValue.trim()) {
                            $el.append($compile(newValue)($scope));
                        }
                        $ionicScrollDelegate.resize();
                    });

                $scope.$on('$destroy', function() {
                    listener();
                });
            }
        };
    }])
;

// 使textarea的高度适应内容
angular.module('app').directive('cmAutomateTextarea', function () {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            $scope.$watch($attr.ngModel, function () {
                $element.css("height", "auto");
                $element.css("height", $element[0].scrollHeight + "px");
            });
        }
    };
});

/**
 */
angular.module('app.filters').filter('brandsFormat', ["$translate", function($translate) {
    return function(brands) {
        var result = "";

        _.forEach(brands, function(brandName, brandId) {
            result += brandName;
            return false;
        });

        if (_.keys(brands).length > 1) {
            result += $translate.instant('etcSuffix');
        }

        return result;
    };
}]);

/**
 * 增加一个文本过滤器 用于替换隐藏字符
 * 传入的文本是手机 则中间4位以*号替换
 *   18612943151 -> 186****3151
 * 传入的文本是邮箱 则@之前部分除第一位最后一位外使用*替换
 *   qq9133702@163.com -> q*******2@163.com
 */
angular.module('app.filters').filter('textFormat', ["validator", function(validator) {

    return function(text) {
        //去除空格
        text = $.trim(text);

        //判断是否为邮箱
        var isEmail = validator.isEmail(text);
        //判断是否为手机
        var isMobile = validator.isMobile(text);
        if(isMobile) {
            text=text.substring(0,3)+"****"+text.substring(7);
        }else if(isEmail) {
            var emailTextArray = text.split('@');
            var emailPart = emailTextArray[0];
            if(emailPart.length>2) {
                var replaceLength = emailPart.length -2;
                if(replaceLength > 0) {
                    var replaceChar="";
                    for(var i=0;i<replaceLength;i++) {
                        replaceChar+="*";
                    }
                    text = emailPart.substring(0,1) + replaceChar + emailPart.substring(emailPart.length-1) +"@"+emailTextArray[1];
                }
            }
        }
        return text;
    };
}]);

/**
 * 用于格式化用户的详细地址 ，接口传回的收货地址以特殊字符分割，前端需要替换为模板显示
 *
 */
angular.module('app.filters').filter('addressFormat',["$translate", function($translate) {

	return function(address) {

		if(!address) {
			return address;
		}
        else if (address.allDeliveryName) {
            return address.allDeliveryName;
        }
        else {

		    //详细地址模板
		    var addressPartTpl=[
				$translate.instant('user.address.road'),
				$translate.instant('user.address.figure'),
				$translate.instant('user.address.estate'),
				$translate.instant('user.address.buildingNo'),
				$translate.instant('user.address.room')
		    ];

		    var addressStr="";

		    //判断参数类型
		    var isObject = typeof(address) === 'object';

		    if(isObject) {
			    var index = 0;

			    addressStr = address.road + " " + addressPartTpl[index++] + " " + address.lane + " " +
                    addressPartTpl[index++] + " " + address.village +  " " + addressPartTpl[index++] +
				    " " + address.buildingNumber +  " " + addressPartTpl[index++] + " " + address.roomNumber + " " + addressPartTpl[index++];
		    }
            else {
			    //分割详细地址
			    var addressArr = address.split('%$'),
                    i;

                if(addressArr.length == addressPartTpl.length) {
				    for(i in addressArr) {
					    addressStr+= addressArr[i]+" "+addressPartTpl[i] + " ";
				    }
	            }
                else {
	        	    for(i = 0 ; i < addressArr.length; i++) {
					    addressStr+= addressArr[i] + " " + addressPartTpl[i+addressPartTpl.length-addressArr.length] + " ";
				    }

	        	    addressStr = addressStr;
	            }
		    }

            return addressStr;
        }
	};
}]);

/**
 * 时间显示过滤器  日期和时间部分增加br
 */
angular.module('app.filters').filter('timeFormat', function() {

    return function(time) {
        if(time) {
            var timeArray = time.split(' ');
            return timeArray[0] +"<br>"+ timeArray[1];
        }
        return time;

    };
});

/**
 * 把秒转化为时分秒格式
 */
angular.module('app.filters').filter('secondsFormat', ["validator", function(validator) {
    return function(value, type) {
        var s = (parseInt(value) / 1000).toFixed(0);
        var m = 0;
        var h = 0;
        if (s > 60) {
            m = parseInt(s / 60);
            s = parseInt(s % 60);
            if (m > 60) {
                h = parseInt(m / 60);
                m = parseInt(m % 60);
            }
        }
        var result = [];
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        switch (type) {
            case 'h':
                return h;
            case 'm':
                return m;
            case 's':
                return s;
            default:
                result.push(h, m, s);
                return result.join(":");
        }
    };
}]);

/**
 * 格式化价格区间
 */
angular.module('app.filters').filter('priceRangeFormat', ["$translate", function($translate) {
    return function(priceRange) {  // [100, 200] => "100 - 200 元"
        var beginPrice = priceRange && priceRange[0],
            endPrice = priceRange && priceRange[1],

            result = "";

        if (beginPrice != null && endPrice != null) {
            result = beginPrice + " - " + endPrice + " " + $translate.instant('priceSuffix');
        }

        return result;
    };
}]);

/**
 * 增加一个文本过滤器 用于替换隐藏字符 用户详情页用户评价名称
 * 传入的文本，取第一个和最后一个，中间使用***代替，不管多长的用户名
 *   18612943151 -> 1***1
 *   12          -> 1***2
 *   1           -> 1***
 */
angular.module('app.filters').filter('commentNameFormat', ["validator", function(validator) {

    return function(text) {

        if (text.length == 1) {
            text = $.trim(text).substr(0, 1) + "***";
        } else if (text.length == 0) {
            text = '';
        } else {
            text = $.trim(text).substr(0, 1) + "***" + $.trim(text).substr(-1);
        }

        return text;
    };
}]);
