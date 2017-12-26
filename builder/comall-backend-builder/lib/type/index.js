'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

exports.registerType = registerType;
exports.getTypeSystem = getTypeSystem;
exports.formatParams = formatParams;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

require('./index.scss');

var _type = require('./type');

var _string = require('./string/string');

var _password = require('./string/password');

var _url = require('./string/url');

var _imageUrl = require('./string/image-url');

var _longText = require('./string/long-text');

var _date = require('./string/date');

var _dateTime = require('./string/date-time');

var _month = require('./string/month');

var _monthRange = require('./string/month-range');

var _time = require('./string/time');

var _array = require('./array/array');

var _keyValueArray = require('./array/key-value-array');

var _optionsArray = require('./array/options-array');

var _optionsArrayAuto = require('./array/options-array-auto');

var _treeNodeArray = require('./array/tree-node-array');

var _number = require('./number/number');

var _price = require('./number/price');

var _integer = require('./number/integer');

var _percentage = require('./number/percentage');

var _positive = require('./number/positive');

var _boolean = require('./boolean/boolean');

var _object = require('./object/object');

var _option = require('./object/option');

var _optionAuto = require('./object/option-auto');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT = new _type.Type();

// 存放所有类型
var TYPES = new Map();

registerType('string', new _string.StringType());
registerType('password', new _password.PasswordFormat());
registerType('url', new _url.URLFormat());
registerType('imageUrl', new _imageUrl.ImageURLFormat());
registerType('longText', new _longText.LongTextFormat());
registerType('date', new _date.DateFormat());
registerType('dateTime', new _dateTime.DateTimeFormat());
registerType('month', new _month.MonthFormat());
registerType('monthRange', new _monthRange.MonthRangeFormat());
registerType('time', new _time.TimeFormat());

registerType('array', new _array.ArrayType());
registerType('keyValueArray', new _keyValueArray.KeyValueArrayFormat());
registerType('optionsArray', new _optionsArray.OptionsArrayFormat());
registerType('optionsArrayAuto', new _optionsArrayAuto.OptionsArrayAutoFormat());
registerType('treeNodeArray', new _treeNodeArray.TreeNodeArrayFormat());

registerType('number', new _number.NumberType());
registerType('price', new _price.PriceFormat());
registerType('integer', new _integer.IntegerFormat());
registerType('percentage', new _percentage.PercentageFormat());
registerType('positive', new _positive.PositiveFormat());

registerType('boolean', new _boolean.BooleanType());

registerType('object', new _object.ObjectType());
registerType('option', new _option.OptionFormat());
registerType('optionAuto', new _optionAuto.OptionAutoFormat());

/**
 * 注册新类型，所有类型需实现 Type 定义的 api
 * @param {string} name 类型名称
 * @param {Type} type 类型实例
 */
function registerType(name, type) {
    if (TYPES.has(name)) {
        throw new Error('Type ' + name + ' is registered.');
    }
    TYPES.set(name, type);
}

/**
 * 获取所指定的类型系统，未找到时使用默认类型
 * @param {string} type - 类型名称
 * @param {string} format - 格式名称
 * @return {Type} 对应类型及格式的类型系统对象
 */
function getTypeSystem(type, format) {
    return TYPES.get(format) || TYPES.get(type) || DEFAULT;
}

/**
 * 按照类型定义转换参数格式，未找到类型定义的参数不进行转换
 * @param {*} properties 实体的属性定义
 * @param {*} fields 表单域对象
 * @return {object} 转换后的参数对象
 */
function formatParams(properties, fields) {
    var params = {};
    _.forEach(fields, function (value, key) {
        var typeDefination = properties[key];
        if (typeDefination) {
            var type = typeDefination.type,
                format = typeDefination.format;

            if (type === 'object' && format === 'subForm') {
                (0, _extends5['default'])(params, (0, _defineProperty3['default'])({}, key, formatParams(typeDefination.properties, value)));
            } else {
                (0, _extends5['default'])(params, getTypeSystem(type, format).formatParams(key, value));
            }
        } else {
            (0, _extends5['default'])(params, (0, _defineProperty3['default'])({}, key, value));
        }
    });
    return params;
}