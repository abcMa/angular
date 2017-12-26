import * as _ from 'lodash';

import './index.scss';
import { Type } from './type';

import { StringType } from './string/string';
import { PasswordFormat } from './string/password';
import { URLFormat } from './string/url';
import { ImageURLFormat } from './string/image-url';
import { LongTextFormat } from './string/long-text';
import { DateFormat } from './string/date';
import { DateTimeFormat } from './string/date-time';
import { MonthFormat } from './string/month';
import { MonthRangeFormat } from './string/month-range';
import { TimeFormat } from './string/time';

import { ArrayType } from './array/array';
import { KeyValueArrayFormat } from './array/key-value-array';
import { OptionsArrayFormat } from './array/options-array';
import { OptionsArrayAutoFormat } from './array/options-array-auto';
import { TreeNodeArrayFormat } from './array/tree-node-array';

import { NumberType } from './number/number';
import { PriceFormat } from './number/price';
import { IntegerFormat } from './number/integer';
import { PercentageFormat } from './number/percentage';
import { PositiveFormat } from './number/positive';


import { BooleanType } from './boolean/boolean';

import { ObjectType } from './object/object';
import { OptionFormat } from './object/option';
import { OptionAutoFormat } from './object/option-auto';

const DEFAULT = new Type();

// 存放所有类型
const TYPES = new Map();

registerType('string', new StringType());
registerType('password', new PasswordFormat());
registerType('url', new URLFormat());
registerType('imageUrl', new ImageURLFormat());
registerType('longText', new LongTextFormat());
registerType('date', new DateFormat());
registerType('dateTime', new DateTimeFormat());
registerType('month', new MonthFormat());
registerType('monthRange', new MonthRangeFormat());
registerType('time', new TimeFormat());

registerType('array', new ArrayType());
registerType('keyValueArray', new KeyValueArrayFormat());
registerType('optionsArray', new OptionsArrayFormat());
registerType('optionsArrayAuto', new OptionsArrayAutoFormat());
registerType('treeNodeArray', new TreeNodeArrayFormat());

registerType('number', new NumberType());
registerType('price', new PriceFormat());
registerType('integer', new IntegerFormat());
registerType('percentage', new PercentageFormat());
registerType('positive', new PositiveFormat());

registerType('boolean', new BooleanType());

registerType('object', new ObjectType());
registerType('option', new OptionFormat());
registerType('optionAuto', new OptionAutoFormat());

/**
 * 注册新类型，所有类型需实现 Type 定义的 api
 * @param {string} name 类型名称
 * @param {Type} type 类型实例
 */
export function registerType(name, type) {
    if (TYPES.has(name)) {
        throw new Error(`Type ${name} is registered.`);
    }
    TYPES.set(name, type);
}

/**
 * 获取所指定的类型系统，未找到时使用默认类型
 * @param {string} type - 类型名称
 * @param {string} format - 格式名称
 * @return {Type} 对应类型及格式的类型系统对象
 */
export function getTypeSystem(type, format) {
    return TYPES.get(format) || TYPES.get(type) || DEFAULT;
}

/**
 * 按照类型定义转换参数格式，未找到类型定义的参数不进行转换
 * @param {*} properties 实体的属性定义
 * @param {*} fields 表单域对象
 * @return {object} 转换后的参数对象
 */
export function formatParams(properties, fields) {
    let params = {};
    _.forEach(fields, (value, key) => {
        let typeDefination = properties[key];
        if (typeDefination) {
            const { type, format } = typeDefination;
            if (type === 'object' && format === 'subForm') {
                Object.assign(params, {[key]: formatParams(typeDefination.properties, value)});
            } else {
                Object.assign(params, getTypeSystem(type, format).formatParams(key, value));
            }
        } else {
            Object.assign(params, {[key]: value});
        }
    });
    return params;
}
