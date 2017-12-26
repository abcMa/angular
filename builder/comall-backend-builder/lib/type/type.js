'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Type = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _textbox = require('../components/textbox');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 全局默认类型系统呈现，其余类型或格式通过继承该类并覆盖相应方法以实现内容。
 */
var Type = exports.Type = function () {
    function Type() {
        (0, _classCallCheck3['default'])(this, Type);
    }

    (0, _createClass3['default'])(Type, [{
        key: 'getNotAvailableDisplayComponent',

        /**
         * 获取无数据状态展示组件
         */
        value: function getNotAvailableDisplayComponent(displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style;

            return _react2['default'].createElement(
                'span',
                { className: (0, _classnames2['default'])('type-not-available', className),
                    style: style },
                'NA'
            );
        }

        /**
         * 获取有数据状态展示组件
         */

    }, {
        key: 'getAvailableDisplayComponent',
        value: function getAvailableDisplayComponent(value, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style;

            return _react2['default'].createElement(
                'span',
                { className: className, style: style },
                value
            );
        }

        /**
         * 获取展示组件
         */

    }, {
        key: 'getDisplayComponent',
        value: function getDisplayComponent(value, displayInfo) {
            if (value === undefined || value === null) {
                return this.getNotAvailableDisplayComponent(displayInfo);
            } else {
                return this.getAvailableDisplayComponent(value, displayInfo);
            }
        }

        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_textbox.Textbox, (0, _extends3['default'])({}, controlInfo, { type: 'text' }));
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            callback();
        }

        /**
         * 对数据进行格式化
         */

    }, {
        key: 'format',
        value: function format(value) {
            if (_.isNil(value) || _.isNaN(value)) {
                return value.toString();
            } else {
                return '';
            }
        }

        /**
         * 将数据格式化为请求参数
         */

    }, {
        key: 'formatParams',
        value: function formatParams(key, value) {
            return (0, _defineProperty3['default'])({}, key, value);
        }
    }]);
    return Type;
}();