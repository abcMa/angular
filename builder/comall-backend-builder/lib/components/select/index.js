'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Select = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/select/style/css');

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _componentProps = require('../component-props');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Select = exports.Select = function (_Component) {
    (0, _inherits3['default'])(Select, _Component);

    function Select(props) {
        (0, _classCallCheck3['default'])(this, Select);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (Select.__proto__ || Object.getPrototypeOf(Select)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(Select, [{
        key: 'handleChange',
        value: function handleChange(value) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;


            if (onChange) {
                onChange(value, name);
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _props2 = this.props,
                name = _props2.name,
                value = _props2.value,
                options = _props2.options,
                onChange = _props2.onChange,
                defaultValueIndex = _props2.defaultValueIndex;

            if (defaultValueIndex !== undefined && !value && defaultValueIndex < options.length) {
                onChange(options[defaultValueIndex].id, name);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var name = nextProps.name,
                value = nextProps.value,
                options = nextProps.options,
                onChange = nextProps.onChange,
                defaultValueIndex = nextProps.defaultValueIndex;


            if (value && options.length) {
                if (_.isArray(value)) {
                    if (_.some(value, function (id) {
                        return !_.find(options, { id: id });
                    })) {
                        onChange([], name);
                    }
                } else {
                    if (!_.some(options, function (option) {
                        return option.id + '' === value + '';
                    })) {
                        onChange(undefined, name);
                    }
                }
            }

            if (defaultValueIndex !== undefined && !value && !_.isEqual(this.props.options, options)) {
                onChange(options[defaultValueIndex].id, name);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                className = _props3.className,
                style = _props3.style,
                mode = _props3.mode,
                name = _props3.name,
                value = _props3.value,
                placeholder = _props3.placeholder,
                disabled = _props3.disabled,
                options = _props3.options,
                allowClear = _props3.allowClear,
                showSearch = _props3.showSearch,
                optionFilterProp = _props3.optionFilterProp,
                onSelect = _props3.onSelect,
                onDeselect = _props3.onDeselect;


            var selectProps = {
                // basicPropTypes
                className: className,
                style: style,

                // controlPropTypes
                mode: mode,
                name: name,
                placeholder: placeholder,
                disabled: disabled,
                showSearch: showSearch,
                allowClear: allowClear,
                optionFilterProp: optionFilterProp,
                onChange: this.handleChange,
                onSelect: onSelect,
                onDeselect: onDeselect
            };

            if (value !== undefined && value !== null) {
                selectProps.value = _.isArray(value) ? value : value + '';
            }

            var children = _.map(options, function (option) {
                return _react2['default'].createElement(
                    _select2['default'].Option,
                    { key: option.id },
                    option.name
                );
            });

            return _react2['default'].createElement(
                _select2['default'],
                selectProps,
                children
            );
        }
    }]);
    return Select;
}(_react.Component);

Select.defaultProps = {
    placeholder: '请选择'
};
Select.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes, {

    value: _propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].string, _propTypes2['default'].array]),

    // 待选项
    options: _propTypes2['default'].array.isRequired
});