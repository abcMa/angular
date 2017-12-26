import { NumberType } from './number';

/**
 * 非负数类型
 */
export class PositiveFormat extends NumberType {
    /**
     * 对数据进行校验
     */
    validate(rule, value, callback) {
        if (value && typeof value !== 'number' && value < 0 && !Number.isFinite(value)) {
            callback('The input is not valid Number!');
        }else {
            callback();
        }
    }

    /**
     * 将数据格式化为 positive number 类型的值
     */
    format(value) {
        if (typeof value !== 'number') {
            value = parseFloat(value, 10);
        }

        // NaN, +Infinity, -Infinity
        if (Number.isFinite(value) === false) {
            value = undefined;
        }else {
            value = Math.abs(value);
        }

        return value;
    }
}
