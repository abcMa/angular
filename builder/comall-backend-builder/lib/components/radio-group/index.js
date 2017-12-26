'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RadioGroup = undefined;

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

var _css = require('antd/lib/radio/style/css');

var _radio = require('antd/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var AntRadioGroup = _radio2['default'].Group;

var RadioGroup = exports.RadioGroup = function (_Component) {
    (0, _inherits3['default'])(RadioGroup, _Component);

    function RadioGroup(props) {
        (0, _classCallCheck3['default'])(this, RadioGroup);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (RadioGroup.__proto__ || Object.getPrototypeOf(RadioGroup)).call(this, props));

        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(RadioGroup, [{
        key: 'onChange',
        value: function onChange(e) {
            var _props = this.props,
                name = _props.name,
                onChange = _props.onChange;


            if (onChange) {
                onChange(e.target.value, name);
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var name = nextProps.name,
                value = nextProps.value,
                options = nextProps.options,
                onChange = nextProps.onChange;


            if (!value || _.isEqual(this.props.options, options)) {
                return;
            }

            var newValue = _.reduce(value, function (newValue, item) {
                if (_.some(options, function (option) {
                    return option.id === item;
                })) {
                    newValue.push(item);
                }
                return newValue;
            }, []);

            if (!_.isEqual(value, newValue)) {
                onChange(newValue, name);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                value = _props2.value,
                className = _props2.className,
                style = _props2.style,
                disabled = _props2.disabled,
                options = _props2.options;


            var radioGroupProps = {
                value: value,
                className: className,
                style: style,
                disabled: disabled,
                options: options.map(function (option) {
                    return { label: option.name, value: option.id };
                })
            };

            return _react2['default'].createElement(AntRadioGroup, (0, _extends3['default'])({}, radioGroupProps, { onChange: this.onChange }));
        }
    }]);
    return RadioGroup;
}(_react.Component);