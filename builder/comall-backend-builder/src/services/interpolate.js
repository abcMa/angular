/**
 * 插值方法，使用 context 中的值替换 text 中 {{}} 表达式
 * @expamle interpolate('hello {{ foo.bar }}', {foo: {bar: 'world'}});
 * 返回值： 'hello world'
 */
export function interpolate(text, context) {
    let result = text;

    while (/{{([^}]+)}}/.test(result)) {
        let expr = RegExp.$1;
        let keys = expr.trim().split('.');
        let value = context;
        for (let key of keys) {
            value = value[key];
            if (!value) {
                value = '';
                break;
            }
        }
        result = result.replace(/{{[^}]+}}/, value.toString().replace(/\//, '') || '');
    }

    return result;
}
