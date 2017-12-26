'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TreeNodeArrayFormat = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _array = require('./array');

var _treeNodeCascader = require('../../components/tree-node-cascader');

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 名值对数组类型
 */
var TreeNodeArrayFormat = exports.TreeNodeArrayFormat = function (_ArrayType) {
    (0, _inherits3['default'])(TreeNodeArrayFormat, _ArrayType);

    function TreeNodeArrayFormat() {
        (0, _classCallCheck3['default'])(this, TreeNodeArrayFormat);
        return (0, _possibleConstructorReturn3['default'])(this, (TreeNodeArrayFormat.__proto__ || Object.getPrototypeOf(TreeNodeArrayFormat)).apply(this, arguments));
    }

    (0, _createClass3['default'])(TreeNodeArrayFormat, [{
        key: 'getDisplayComponent',

        /**
         * 获取展示组件
         */
        value: function getDisplayComponent(array, displayInfo) {
            var className = displayInfo.className,
                style = displayInfo.style;

            var namesArr = _.map(array, function (_ref) {
                var name = _ref.name;

                return name;
            });
            if (array && array.length) {
                return _react2['default'].createElement(
                    'span',
                    { className: (0, _classnames2['default'])('string-type', className), style: style },
                    namesArr.join('/')
                );
            } else {
                return (0, _get3['default'])(TreeNodeArrayFormat.prototype.__proto__ || Object.getPrototypeOf(TreeNodeArrayFormat.prototype), 'getNotAvailableDisplayComponent', this).call(this, displayInfo);
            }
        }
        /**
         * 获取输入组件
         */

    }, {
        key: 'getControlComponent',
        value: function getControlComponent(controlInfo) {
            return _react2['default'].createElement(_treeNodeCascader.TreeNodeCascader, controlInfo);
        }

        /**
         * 对数据进行校验
         */

    }, {
        key: 'validate',
        value: function validate(rule, value, callback) {
            callback();
        }
    }]);
    return TreeNodeArrayFormat;
}(_array.ArrayType);