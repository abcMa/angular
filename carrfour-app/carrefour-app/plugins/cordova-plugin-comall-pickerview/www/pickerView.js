/**
 * data 格式如下：
 *
 * ```
 * [
 *     {
 *         id: '0',    ------------------------------- 数据项 ID
 *         text: 'item1',    ------------------------- 显示文本
 *         subItems: [    ---------------------------- 子数据项数组
 *             {
 *                 id: '1',    ----------------------- 子数据项 ID
 *                 text: 'sub item 1',    ------------ 显示文本
 *                 subtext: 'sub item text 1'    ----- 附属文本，只有显示层级中的最后一级数据支持显示该附属文本
 *             }
 *         ]
 *     }
 * ]
 * ```
 *
 * options 相关配置项如下：
 *
 * - {number} level - 显示层级
 */
module.exports = {
    show: function(data, options) {
        // for (var i = 0; i < options.length; i++) {
        //     options[i].defaultIndex = options[i].options.indexOf(options[i].default);
        // }

        return {
            then: function(success,fail) {
                cordova.exec(success, fail, "PickerView", "show", [data, options]);
            }
        };
    }
};
