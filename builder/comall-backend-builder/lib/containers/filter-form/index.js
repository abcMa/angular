'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterForm = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _reactRedux = require('react-redux');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _form = require('../../components/form');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function mapStateToProps(state, props) {
    var entity = props.entity,
        fieldsFilter = props.fieldsFilter,
        mode = props.mode;

    var submit = props.submit;
    var filters = entity.metainfo.filters;

    var fieldValues = entity.filters || {};

    if (fieldsFilter && fieldsFilter.length) {
        filters = _.pick(filters, fieldsFilter);
    }

    var fields = _.mapValues(filters, function (config, name) {
        var field = (0, _extends4['default'])({}, config);

        field.value = fieldValues[name] || undefined;

        return field;
    });

    if (!submit || mode === 'change') {
        submit = false;
    }

    return {
        state: {
            fields: fields
        },
        submit: submit
    };
}

function mapDispatchToProps(dispatch, props) {
    var entity = props.entity,
        submit = props.submit,
        mode = props.mode,
        fieldsFilter = props.fieldsFilter;


    return {
        onInit: function onInit() {
            var filters = entity.metainfo.filters;

            if (fieldsFilter && fieldsFilter.length) {
                filters = _.pick(filters, fieldsFilter);
            }
            var defaultFilters = _.reduce(filters, function (result, filter, key) {
                if (filter.defaultValue !== undefined) {
                    result[key] = filter.defaultValue;
                }
                return result;
            }, {});

            if (Object.keys(defaultFilters).length) {
                entity.filtersChange((0, _extends4['default'])({}, entity.filters, defaultFilters));
            }
        },
        // 表单域改变
        onFieldChange: function onFieldChange(name, value) {
            var fields = (0, _extends4['default'])({}, entity.filters, (0, _defineProperty3['default'])({}, name, value));
            entity.filtersChange(fields);
            if (mode === 'change') {
                entity.search(props.params);
            }
        },

        // 提交表单
        onSubmit: function onSubmit() {
            if (!!submit) {
                entity.search(props.params);
            }
        }
    };
}

var FilterForm = exports.FilterForm = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_form.Form);