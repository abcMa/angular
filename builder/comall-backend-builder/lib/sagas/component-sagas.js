'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.initComponentSagas = initComponentSagas;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _store = require('../store');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _effects = require('redux-saga/effects');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _marked = [initComponentSagas, initEditFormSaga].map(_regenerator2['default'].mark);

/**
 * 在页面启动时调用的saga，此时为切换分页至第一页
 */
function initComponentSagas() {
    return _regenerator2['default'].wrap(function initComponentSagas$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.takeEvery)(actions.GET_SUCCESS, initEditFormSaga);

                case 2:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

/**
 * <generator函数> 数据加载后进行 EditForm 数据初始化
 */
function initEditFormSaga(action) {
    var state, entity, payload, entityId, properties, componentId, fields;
    return _regenerator2['default'].wrap(function initEditFormSaga$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    state = _store.store.getState();
                    entity = action.entity, payload = action.payload;
                    entityId = entity.id, properties = entity.metainfo.properties;
                    componentId = _.findKey(state.components, { entityId: entityId, type: 'EditForm', loaded: false });

                    if (!(componentId === undefined)) {
                        _context2.next = 6;
                        break;
                    }

                    return _context2.abrupt('return');

                case 6:
                    fields = _.mapValues(properties, function (property, name) {
                        return payload[name];
                    });
                    _context2.next = 9;
                    return (0, _effects.put)(actions.formInitAction(componentId, {
                        type: 'EditForm',
                        entityId: entityId,
                        fields: fields,
                        loaded: true
                    }));

                case 9:

                    _.forEach(properties, function (property, name) {
                        reloadPropertyOptions(name, property, entity, fields);
                    });

                case 10:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this);
}

/**
 * 重新加载有条件依赖的候选项
 * @param {string} path 属性路径
 * @param {object} property 属性定义
 * @param {object} entity 实体定义
 * @param {object} fields 实体数据
 */
function reloadPropertyOptions(path, property, entity, fields) {
    var options = property.options,
        sourceDefination = property.source;

    if (options && sourceDefination && sourceDefination.dependences) {
        var apiRoot = sourceDefination.apiRoot,
            apiPath = sourceDefination.apiPath;

        var source = { apiRoot: apiRoot, apiPath: apiPath };
        var params = _.reduce(sourceDefination.dependences, function (values, dependence) {
            values[dependence] = _.get(fields, dependence);
            return values;
        }, {});
        entity.loadPropertyOptions(path, source, params);
    }
    _.forEach(property.properties, function (subProperty, subPropertyName) {
        reloadPropertyOptions(path + '.' + subPropertyName, subProperty, entity, fields);
    });
}