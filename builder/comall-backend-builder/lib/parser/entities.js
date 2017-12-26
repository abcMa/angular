'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Entities = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _entityFactory = require('./entity-factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 存放所有实体类
var ENTITIES = new Map();

/**
 * 实体服务，用于管理注册的所有实体类。
 */

var Entities = exports.Entities = function () {
    function Entities() {
        (0, _classCallCheck3['default'])(this, Entities);
    }

    (0, _createClass3['default'])(Entities, null, [{
        key: 'register',

        /**
         * 注册一个实体
         * @param {string} name - 实体名称
         * @param {object} desc - 实体的描述信息
         */
        value: function register(name, desc) {
            if (ENTITIES.has(name)) {
                throw new Error('Entity ' + name + ' is registered.');
            }
            var Entity = (0, _entityFactory.entityFactory)(name, desc);
            ENTITIES.set(name, Entity);
        }

        /**
         * 获取一个实体服务
         */

    }, {
        key: 'get',
        value: function get(name) {
            if (!ENTITIES.has(name)) {
                throw new Error('Entity ' + name + ' not found.');
            }
            return ENTITIES.get(name);
        }
    }]);
    return Entities;
}();