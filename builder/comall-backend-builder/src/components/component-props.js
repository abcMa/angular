import PropTypes from 'prop-types';

/**
 * 基本组件的通用 Props 定义
 */
export const basicPropTypes = {
    // 自定义 class
    className: PropTypes.string,

    // 自定义样式
    style: PropTypes.object,

    // 与该组件绑定的实体对象
    entity: PropTypes.object
};

/**
 * 表单输入基本组件的通用 Props 定义
 */
export const controlPropTypes = {
    // 输入组件的 name，作为该输入组件在其所属表单内的唯一识别符
    name: PropTypes.string.isRequired,

    // 初始值，具体类型需各个组件自行定义
    value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.bool),
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.arrayOf(PropTypes.string)
    ]),

    // 占位符
    placeholder: PropTypes.string,

    // 该输入组件是否为禁用状态，默认值为 false
    disabled: PropTypes.bool,

    // change 事件，处理器函数接收如下两个参数：
    //
    // - {any} newValue - 改变后的值
    // - {string} name - 该组件的 name
    onChange: PropTypes.func.isRequired
};