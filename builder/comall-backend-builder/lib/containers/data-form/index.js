'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DataForm = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _form = require('../../components/form');

var _actions = require('../../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 根据实体属性定义和实体数据生成表单域结构
 * @param {string} name 实体属性名称
 * @param {object} property 实体属性信息
 * @param {object} fieldValues 实体数据
 * @returns {object} 表单域结构
 */
function generateField(name, property, fieldValues) {
    var field = (0, _extends3['default'])({}, property);

    field.value = _.get(fieldValues, name);

    if (field.format === 'subForm') {
        field.fields = _.reduce(field.properties, function (result, subFormProperty, subFormPropertyName) {
            var path = name + '.' + subFormPropertyName;
            result[path] = generateField(path, subFormProperty, fieldValues);
            return result;
        }, {});
    }

    return field;
}

function mapStateToProps(state, props) {
    var componentId = props.componentId,
        entity = props.entity,
        fieldsFilter = props.fieldsFilter;
    var properties = entity.metainfo.properties;

    var componentState = state.components[componentId] || {};
    var fieldValues = componentState.fields || {};

    if (fieldsFilter && fieldsFilter.length) {
        properties = _.pick(properties, fieldsFilter);
    }

    var fields = _.mapValues(properties, function (property, name) {
        return generateField(name, property, fieldValues);
    });

    return {
        state: {
            fields: fields,
            requestStatus: entity.requestStatus,
            submitType: componentState.submitType
        }
    };
}

function mapDispatchToProps(dispatch, props) {
    var componentId = props.componentId,
        entity = props.entity,
        onFieldChange = props.onFieldChange,
        onReloadOptions = props.onReloadOptions,
        onSubmitStart = props.onSubmitStart;


    return _.defaults({
        onFieldChange: onFieldChange,
        onReloadOptions: onReloadOptions,
        onSubmitStart: onSubmitStart
    }, {
        // 表单域改变
        onFieldChange: function onFieldChange(name, value) {
            dispatch(actions.formChangeAction(componentId, name, value));
        },

        // 重新加载属性候选值
        onReloadOptions: function onReloadOptions(fieldName, fields) {
            var field = (0, _form.getField)(fieldName, fields);
            var sourceDefination = field.source;
            var dependences = sourceDefination.dependences;
            var params = _.reduce(dependences, function (values, dependence) {
                values[dependence] = (0, _form.getField)(dependence, fields).value;
                return values;
            }, _.clone(props.params));
            entity.loadPropertyOptions(fieldName, sourceDefination, params);
        },

        // 提交表单开始
        onSubmitStart: function onSubmitStart() {
            dispatch(actions.componentSubmitAction(componentId, 'submit'));
        },

        // 提交表单结束
        onSubmitFinish: function onSubmitFinish() {
            dispatch(actions.componentSubmitFinishAction(componentId));
        }
    });
}

var DataForm = exports.DataForm = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_form.Form);