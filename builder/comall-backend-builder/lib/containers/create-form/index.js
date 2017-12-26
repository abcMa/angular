'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreateForm = undefined;

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _dataForm = require('../data-form');

var _actions = require('../../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 * 生成默认表单域
 * @param {object} properties 实体属性定义
 */
function generateDefaultFields(properties) {
    return _.mapValues(properties, function (config, name) {
        if (config.properties) {
            return generateDefaultFields(config.properties);
        }
        return config.defaultValue || undefined;
    });
}

function mapDispatchToProps(dispatch, props) {
    var componentId = props.componentId,
        entity = props.entity,
        fieldsFilter = props.fieldsFilter,
        onInit = props.onInit,
        onSubmit = props.onSubmit;


    return _.defaults({
        onInit: onInit,
        onSubmit: onSubmit
    }, {
        // 初始化表单结构
        onInit: function onInit() {
            var properties = entity.metainfo.properties;

            if (fieldsFilter && fieldsFilter.length) {
                properties = _.pick(properties, fieldsFilter);
            }
            var fields = generateDefaultFields(properties);

            dispatch(actions.formInitAction(componentId, {
                type: 'CreateForm',
                entityId: entity.id,
                fields: fields
            }));
        },

        // 提交表单
        onSubmit: function onSubmit(event, fields) {
            var entityFields = _.mapValues(fields, function (field, name) {
                return field.value;
            });
            entity.add(entityFields, props.params);
        },

        onSubmitStart: function onSubmitStart() {
            dispatch(actions.componentSubmitAction(componentId, 'create'));
        }
    });
}

var CreateForm = exports.CreateForm = (0, _reactRedux.connect)(null, mapDispatchToProps)(_dataForm.DataForm);