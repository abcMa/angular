'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.entityFactory = entityFactory;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _store = require('../store');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var dispatch = _store.store.dispatch;

var idCounter = 0;

/**
 * 根据属性路径获取实体属性
 * @param {string} path 属性路径
 * @param {object} properties 顶级属性属性定义
 * @returns {object} 实体属性
 */
function getProperty(path, properties) {
    path = path.split('.').join('.properties.');
    return _.get(properties, path);
}

/**
 * 构建一个实体类型
 * @param {string} name - 实体名称
 * @param {object} desc - 实体描述信息
 */
function entityFactory(name, desc) {
    var apiPath = desc.apiPath,
        apiRoot = desc.apiRoot,
        paramsFilter = desc.paramsFilter,
        propertiesDefination = desc.properties,
        filtersDefination = desc.filters;

    var Entity = function () {
        function Entity(params) {
            var _this = this;

            (0, _classCallCheck3['default'])(this, Entity);

            // 实体 ID
            this.id = idCounter++;
            // 存储路由参数
            this.params = params;

            var properties = _.cloneDeep(propertiesDefination);
            var filters = _.cloneDeep(filtersDefination);

            // 处理属性候选项
            _.forEach(properties, function (property, name) {
                _this.initPropertyMeta(name, property, properties);
            });

            // 获取筛选器候选项
            _.forEach(filters, function (filter, name) {
                var options = filter.options,
                    source = filter.source;

                if (options && source && source.loadOnInit !== false) {
                    _this.loadFilterOptions(name, source);
                }
            });

            // 初始化实体的元信息定义
            this.setMeta({
                name: name,
                properties: properties,
                filters: filters,
                apiPath: apiPath,
                apiRoot: apiRoot,
                paramsFilter: paramsFilter
            });
        }

        /**
         * 初始化实体属性的元信息
         * @param {string} propertyName - 属性名
         * @param {object} propertyDefination - 属性定义
         * @param {object} properties - 实体所有属性定义
         */


        (0, _createClass3['default'])(Entity, [{
            key: 'initPropertyMeta',
            value: function initPropertyMeta(propertyName, propertyDefination, properties) {
                var _this2 = this;

                var options = propertyDefination.options,
                    source = propertyDefination.source;

                if (options && source) {
                    if (source.dependences) {
                        _.forEach(source.dependences, function (dependence) {
                            var property = Entity.getProperty(dependence, properties);
                            if (!property) {
                                throw new Error('Dependence ' + dependence + ' required by ' + propertyName + ' not found.');
                            }
                            if (!property.triggerOptionsReload) {
                                property.triggerOptionsReload = [];
                            }
                            property.triggerOptionsReload.push(propertyName);
                        });
                    }

                    if (source.loadOnInit !== false) {
                        this.loadPropertyOptions(propertyName, source);
                    }
                }
                // 处理子属性
                _.forEach(propertyDefination.properties, function (subProperty, subPropertyName) {
                    _this2.initPropertyMeta(propertyName + '.' + subPropertyName, subProperty, properties);
                });
            }

            /**
             * 更新实体的元信息定义
             * @param {object} changedMeta - 发生改变的实体的元信息定义
             */

        }, {
            key: 'setMeta',
            value: function setMeta(changedMeta) {
                var meta = (0, _extends3['default'])({}, this.metainfo, changedMeta);
                dispatch(actions.setEntityMetaAction(this, meta));
            }

            /**
             * 更新筛选器信息
             * @param {object} changedFilters - 发生改变的筛选器信息
             */

        }, {
            key: 'filtersChange',
            value: function filtersChange(changedFilters) {
                var filters = (0, _extends3['default'])({}, this.filters, changedFilters);
                dispatch(actions.filtersChangeAction(this, filters));
            }

            /**
             * 更新分页信息
             * @param {object} changedPageInfo - 发生改变的分页信息
             */

        }, {
            key: 'pageChange',
            value: function pageChange(changedPageInfo) {
                var paging = (0, _extends3['default'])({}, this.paging, changedPageInfo);
                dispatch(actions.pageChangeAction(this, paging));
            }

            /**
             * 查询
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 查询成功后的行为
             * @param {object} errorBehavior - 查询失败后的行为
             */

        }, {
            key: 'search',
            value: function search(params, successBehavior, errorBehavior) {
                dispatch(actions.searchAction(this, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 加载下一页数据
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 加载成功后的行为
             * @param {object} errorBehavior - 加载失败后的行为
             */

        }, {
            key: 'loadNextPage',
            value: function loadNextPage(params, successBehavior, errorBehavior) {
                dispatch(actions.loadNextPageAction(this, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 添加新资源
             * @param {object} fields - 新资源属性信息
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 添加成功后的行为
             * @param {object} errorBehavior - 添加失败后的行为
             */

        }, {
            key: 'add',
            value: function add(fields, params, successBehavior, errorBehavior) {
                dispatch(actions.addAction(this, fields, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 删除目标资源
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 删除成功后的行为
             * @param {object} errorBehavior - 删除失败后的行为
             */

        }, {
            key: 'delete',
            value: function _delete(params, successBehavior, errorBehavior) {
                dispatch(actions.deleteAction(this, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 获取目标资源信息
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 获取成功后的行为
             * @param {object} errorBehavior - 获取失败后的行为
             */

        }, {
            key: 'get',
            value: function get(params, successBehavior, errorBehavior) {
                dispatch(actions.getAction(this, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 修改目标资源的信息
             * @param {object} fields - 修改后的资源属性信息
             * @param {object} params - 路由参数
             * @param {object} successBehavior - 修改成功后的行为
             * @param {object} errorBehavior - 修改失败后的行为
             */

        }, {
            key: 'modify',
            value: function modify(fields, params, successBehavior, errorBehavior) {
                dispatch(actions.modifyAction(this, fields, (0, _extends3['default'])({}, this.params, params), successBehavior, errorBehavior));
            }

            /**
             * 获取属性候选项
             * @param {string} path - 属性路径
             * @param {object} source - 远程资源定义
             * @param {object} params - 路由参数
             * */

        }, {
            key: 'loadPropertyOptions',
            value: function loadPropertyOptions(path, source, params) {
                var apiRoot = source.apiRoot,
                    apiPath = source.apiPath,
                    paramsFilter = source.paramsFilter;

                var data = {
                    apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                    params: (0, _extends3['default'])({}, this.params, params)
                };
                dispatch(actions.loadPropertyOptionsAction(this, path, data));
            }

            /**
             * 获取筛选器候选项
             * @param {string} path - 筛选属性路径
             * @param {object} source - 远程资源定义
             * @param {object} params - 路由参数
             * */

        }, {
            key: 'loadFilterOptions',
            value: function loadFilterOptions(path, source, params) {
                var apiRoot = source.apiRoot,
                    apiPath = source.apiPath,
                    paramsFilter = source.paramsFilter;

                var data = {
                    apiRoot: apiRoot, apiPath: apiPath, paramsFilter: paramsFilter,
                    params: (0, _extends3['default'])({}, this.params, params)
                };
                dispatch(actions.loadFilterOptionsAction(this, path, data));
            }

            /**
             * 设置资源信息
             * @param {string} fields - 资源信息
             * */

        }, {
            key: 'setFields',
            value: function setFields(fields) {
                dispatch(actions.setEntityFieldsAction(this, fields));
            }

            /** 销毁实体 */

        }, {
            key: 'unmount',
            value: function unmount() {
                dispatch(actions.unmountEntityAction(this));
            }

            /** 获取元信息 */

        }, {
            key: 'metainfo',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.metainfo;
            }

            /** 获取筛选器属性信息 */

        }, {
            key: 'filters',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.filters;
            }

            /** 获取分页信息 */

        }, {
            key: 'paging',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.paging;
            }

            /** 获取查询结果 */

        }, {
            key: 'result',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.result;
            }

            /** 获取表单信息 */

        }, {
            key: 'fields',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.fields;
            }

            /** 获取新创建资源的信息 */

        }, {
            key: 'created',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.created;
            }

            /** 获取请求状态 */

        }, {
            key: 'requestStatus',
            get: function get() {
                var entityData = getEntityDataByStore(this.id);
                return entityData.requestStatus;
            }
        }]);
        return Entity;
    }();

    Entity.getProperty = getProperty;


    return Entity;
}

/**
 * 从 Recux 仓库中获取指定的实体数据。
 * @param {number} id - 实体 ID
 * @return {object} 实体数据集
 */
function getEntityDataByStore(id) {
    var state = _store.store.getState();
    return _.get(state, 'entities[' + id + ']', {});
}