'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.controlPropTypes = exports.basicPropTypes = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 基本组件的通用 Props 定义
 */
var basicPropTypes = exports.basicPropTypes = {
    // 自定义 class
    className: _propTypes2['default'].string,

    // 自定义样式
    style: _propTypes2['default'].object,

    // 与该组件绑定的实体对象
    entity: _propTypes2['default'].object
};

/**
 * 表单输入基本组件的通用 Props 定义
 */
var controlPropTypes = exports.controlPropTypes = {
    // 输入组件的 name，作为该输入组件在其所属表单内的唯一识别符
    name: _propTypes2['default'].string.isRequired,

    // 初始值，具体类型需各个组件自行定义
    value: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].number, _propTypes2['default'].string, _propTypes2['default'].arrayOf(_propTypes2['default'].bool), _propTypes2['default'].arrayOf(_propTypes2['default'].number), _propTypes2['default'].arrayOf(_propTypes2['default'].string)]),

    // 占位符
    placeholder: _propTypes2['default'].string,

    // 该输入组件是否为禁用状态，默认值为 false
    disabled: _propTypes2['default'].bool,

    // change 事件，处理器函数接收如下两个参数：
    //
    // - {any} newValue - 改变后的值
    // - {string} name - 该组件的 name
    onChange: _propTypes2['default'].func.isRequired
};