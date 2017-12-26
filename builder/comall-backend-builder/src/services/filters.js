/**
 * 过滤器列表
 */
export let filters = {
    decimalAdjust,
    absolute,
    floatNumberToInt,
    floatNumberInThousands
    // floatNumberCompute
};

/**
 * 注册新的过滤器
 */
export function registerFilter(name, filter) {
    filters[name] = filter;
}

/**
 * [description] Math方法 返回一个十进制的带保留小数
 * @param  {string} type 选择一种数学方法包括 round&ceil&floor
 * @param  {number} value 数字
 * @param  {number} exp 保留小数几位 可以为负数,负数则为小数位数
 */
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

/**
 * @param  {number&string} 传入一个数字或字符 返回一个绝对数, 不对值做修改
 */
function absolute(number, integer) {

    let parseNumber;

    if (isNaN(number)) {
        return null;
    }

    if (integer) {
        parseNumber = isNaN(parseInt(number, 10)) ? null : Math.abs(parseInt(number, 10));
    } else {
        parseNumber = parseFloat(number, 10) < 0 ? Math.abs(number) : number;
    }

    return number == null ? null : parseNumber;

}

function floatNumberToInt(number) {

    try {
        const str = String(number);
        const value = str.replace('.', '');
        const digit = str.split('.')[1].length;
        const pow = Math.pow(10, digit);
        return {
            number: parseInt(value, 10),
            pow
        };

    } catch (e) {
        return {
            number: number,
            pow: 1
        };
    }

}

function floatNumberInThousands(value) {

    const str = String(value);
    if (!~str.indexOf('.')) {
        return str.replace(/\B(?=(?:\d{3})+$)/g, ',');
    } else {
        let strArr = str.split('.');
        const integer = strArr[0].replace(/\B(?=(?:\d{3})+$)/g, ',');
        return `${integer}.${strArr[1]}`;
    }

}