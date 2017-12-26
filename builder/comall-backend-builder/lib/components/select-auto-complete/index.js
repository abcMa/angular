'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectAutoComplete = undefined;

var _css = require('antd/lib/select/style/css');

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var SelectAutoComplete = exports.SelectAutoComplete = function (_Component) {
    (0, _inherits3['default'])(SelectAutoComplete, _Component);

    function SelectAutoComplete(props) {
        (0, _classCallCheck3['default'])(this, SelectAutoComplete);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (SelectAutoComplete.__proto__ || Object.getPrototypeOf(SelectAutoComplete)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSearch = _.throttle(_this.handleSearch.bind(_this), 1000);
        return _this;
    }

    (0, _createClass3['default'])(SelectAutoComplete, [{
        key: 'handleChange',
        value: function handleChange(value) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;


            if (onChange) {
                if (_.isArray(value)) {
                    value = _.map(value, function (_ref) {
                        var key = _ref.key,
                            label = _ref.label;
                        return { id: key, name: label };
                    });
                } else if (value !== null && value !== undefined) {
                    value = { id: value.key, name: value.label };
                }
                onChange(value, name);
            }
        }
    }, {
        key: 'handleSearch',
        value: function handleSearch(value) {
            var _props2 = this.props,
                entity = _props2.entity,
                name = _props2.name,
                params = _props2.params;


            var property = _.get(entity.metainfo.properties, name.split('.').join('.properties.'));
            entity.loadPropertyOptions(name, property.source, (0, _extends3['default'])({}, params, { name: value }));
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
                allowClear: allowClear,
                labelInValue: true,
                showSearch: true,
                filterOption: false,
                onChange: this.handleChange,
                onSearch: this.handleSearch,
                onSelect: onSelect,
                onDeselect: onDeselect
            };

            if (_.isArray(value)) {
                selectProps.value = value.map(function (_ref2) {
                    var id = _ref2.id,
                        name = _ref2.name;
                    return { key: id, label: name };
                });
            } else if (_.isObject(value)) {
                selectProps.value = { key: value.id, label: value.name };
            }

            var children = _.map(options, function (_ref3) {
                var id = _ref3.id,
                    name = _ref3.name;
                return _react2['default'].createElement(
                    _select2['default'].Option,
                    { key: id },
                    name
                );
            });

            return _react2['default'].createElement(
                _select2['default'],
                selectProps,
                children
            );
        }
    }]);
    return SelectAutoComplete;
}(_react.Component);

SelectAutoComplete.defaultProps = {
    placeholder: '请选择'
};
SelectAutoComplete.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, _componentProps.controlPropTypes, {

    value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].array]),

    // 待选项
    options: _propTypes2['default'].array.isRequired
});