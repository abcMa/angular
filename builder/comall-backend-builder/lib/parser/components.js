'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Components = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _dynamicComponentFactory = require('./dynamic-component-factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * 存放所有已注册的组件
 */
var COMPONENTS = new Map();

var Components = exports.Components = function () {
    function Components() {
        (0, _classCallCheck3['default'])(this, Components);
    }

    (0, _createClass3['default'])(Components, null, [{
        key: 'register',

        /**
         * 注册组件
         * @param {string} name - 组件名称
         * @param {Component|Object} component - 组件类
         */
        value: function register(name, component) {
            if (COMPONENTS.has(name)) {
                throw new Error('Component ' + name + ' is registered.');
            }

            switch (typeof component === 'undefined' ? 'undefined' : (0, _typeof3['default'])(component)) {
                case 'object':
                    component = _dynamicComponentFactory.DynamicComponentFactory.create(name, component);
                    break;
                case 'function':
                    component.displayName = '#' + (component.displayName || component.name);
                    break;
                default:
                // Not Default
            }

            COMPONENTS.set(name, component);
        }

        /**
         * 基于名称获取对应的组件类
         * @param {string} name - 组件注册名称
         * @return {Component} 对应的组件类
         */

    }, {
        key: 'get',
        value: function get(name) {
            if (!COMPONENTS.has(name)) {
                throw new Error('Component ' + name + ' not found.');
            }
            return COMPONENTS.get(name);
        }
    }]);
    return Components;
}();