import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { Form as AntForm, Spin as AntSpin } from 'antd';

import { basicPropTypes } from '../component-props';
import { Button } from '../button';
import { getTypeSystem } from '../../type';
import { behaviorHandle } from '../../services';

import './index.scss';

// 栅格总列数
const GRID_COLUMN_NUMBER = 24;

/**
 * 根据属性路径获取表单域
 * @param {string} path 属性路径
 * @param {object} fields 顶级表单域结构
 * @returns {object} 表单域
 */
export function getField(path, fields) {
    let propertyNames = path.split('.');
    let field;
    let fieldName = [];
    for (let name of propertyNames) {
        fieldName.push(name);
        field = fields[fieldName.join('.')];
        if (!field) {
            break;
        }
        fields = field.fields;
    }
    return field;
}

/**
 * 负责对接 Ant.Design 的表单组件
 */
export class BasicForm extends Component {
    static defaultProps = {
        direction: 'horizontal',
        labelCol: 8
    };

    static propTypes = {
        ...basicPropTypes,

        // 表单域数据
        fields: PropTypes.object,

        // 表单域修改事件
        onFieldChange: PropTypes.func,

        // 表单提交事件（该事件将在点击提交按钮并校验完成后触发）
        onSubmit: PropTypes.func,

        // 表单布局
        direction: PropTypes.oneOf(['horizontal', 'vertical', 'inline']),

        // 定义 label 宽度
        labelCol: PropTypes.oneOf(_.range(1, 25)),

        // 定义 输入控件 宽度
        controlCol: PropTypes.oneOf(_.range(1, 25)),

        // 是否提供提交操作，若为 false，则不显示提交按钮，反之则显示。
        // 另外可以通过提供一个配置对象定义提交操作完成后的附加行为。
        submit: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.shape({
                text: PropTypes.string,
                type: PropTypes.string,
                tooltip: PropTypes.string,
                shape: PropTypes.string,
                icon: PropTypes.string,
                style: PropTypes.string,
                router: PropTypes.string,
                link: PropTypes.string,
                action: PropTypes.object
            })
        ])
    };

    constructor(props) {
        super(props);

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const onInit = this.props.onInit;
        if (onInit) {
            onInit();
        }
    }

    /**
     * 表单域修改事件处理函数
     */
    handleFieldChange(value, name) {

        const { onFieldChange, onReloadOptions } = this.props;

        if (onFieldChange) {
            onFieldChange(name, value);
        }

        const field = getField(name, this.props.state.fields);
        if (field.triggerOptionsReload && onReloadOptions) {
            setTimeout(() => {
                _.forEach(field.triggerOptionsReload, (fieldName) => {
                    onReloadOptions(fieldName, this.props.state.fields);
                });
            }, 0);
        }
    }

    /**
     * 表单提交事件处理函数
     */
    handleSubmit(event) {
        if (this.props.state.requestStatus === 'pending') {
            return;
        }

        if (event) {
            event.preventDefault();
        }

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { onSubmitStart, onSubmit } = this.props;

                if (onSubmitStart) {
                    onSubmitStart();
                }

                if (onSubmit) {
                    onSubmit(event, this.props.state.fields);
                }
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        const prevStatus = this.props.state.requestStatus;
        const nextStatus = nextProps.state.requestStatus;
        const { state: { submitType }, onSubmitSuccess, onSubmitError,
            submitSuccessBehavior, submitErrorBehavior, onSubmitFinish } = nextProps;
        if (submitType && prevStatus === 'pending' && nextStatus === 'success') {
            if (onSubmitSuccess) {
                onSubmitSuccess(nextProps.state.fields, submitType);
            }
            if (submitSuccessBehavior) {
                behaviorHandle(submitSuccessBehavior);
            }
            if (onSubmitFinish) {
                onSubmitFinish();
            }
        }
        if (submitType && prevStatus === 'pending' && nextStatus === 'error') {
            if (onSubmitError) {
                onSubmitError(nextProps.state.fields, submitType);
            }
            if (submitErrorBehavior) {
                behaviorHandle(submitErrorBehavior);
            }
            if (onSubmitFinish) {
                onSubmitFinish();
            }
        }
    }

    render() {
        const { direction, className, style, showSpin, state } = this.props;

        let form = (
            <AntForm layout={direction} onSubmit={this.handleSubmit} className={className} style={style}>
                { this.renderFormFields(this.props.state.fields) }
                { this.renderFormFooter() }
            </AntForm>
        );

        if (showSpin !== false) {
            let spinning = !!state && state.requestStatus === 'pending';

            return (
                <AntSpin spinning={spinning}>
                    { form }
                </AntSpin>
            );
        } else {
            return form;
        }
    }

    /**
     * 渲染表单域
     */
    renderFormFields(fields) {
        return _.map(fields, (field, fieldname) => {
            if (field.format === 'subForm') {
                return this.renderSubForm(fieldname, field);
            } else {
                return this.renderFormItem(fieldname, field);
            }
        });
    }

    /**
     * 渲染子表单
     */
    renderSubForm(fieldname, field) {
        if (this.props.direction === 'inline') {
            // 行内表单不添加子表单标题和缩进
            return this.renderFormFields(field.fields);
        } else {
            return (
                <fieldset className="sub-form" key={ fieldname }>
                    <legend className="sub-form-title">
                        { field.displayName || fieldname }
                    </legend>
                    { this.renderFormFields(field.fields) }
                </fieldset>
            );
        }
    }

    /**
     * 渲染表单项
     */
    renderFormItem(fieldname, field) {
        const { type, format } = field;
        const label = field.displayName || fieldname;
        const value = field.value;

        // 表单项设置
        const formItemProps = {
            key: fieldname,
            label,
            ...this.getFormItemLayout()
        };

        // 渲染不可编辑域
        if (field.modifiable === false) {
            return <AntForm.Item {...formItemProps}>
                {getTypeSystem(type, format).getDisplayComponent(value, {
                    ...field.displayConfig,
                    name: field.name,
                    options: field.options
                })}
            </AntForm.Item>;
        }

        const { getFieldDecorator } = this.props.form;
        const validate = getTypeSystem(type, format).validate;
        let rules = field.rules || [];

        // 统一required校验失败message
        rules = rules.map((rule)=> {
            if (rule.required && !rule.message) {
                rule.message = `${label} is required`;
            }
            return rule;
        });

        return (
            <AntForm.Item {...formItemProps}>
                {getFieldDecorator(fieldname, {
                    rules: [...rules, {validator: validate}],
                    initialValue: value
                })(this.renderFormControl(fieldname, field))}
            </AntForm.Item>
        );
    }

    /**
     * 渲染表单项中的输入组件
     */
    renderFormControl(fieldname, field) {
        const { entity, params } = this.props;
        const { type, format } = field;

        const props = {
            ...field.controlConfig,
            name: fieldname,
            entity,
            params,
            disabled: field.disabled,
            options: field.options,
            onChange: this.handleFieldChange
        };

        let control = getTypeSystem(type, format).getControlComponent(props);

        return control;
    }

    /**
     * 渲染表单页脚
     */
    renderFormFooter() {
        let { submit, footer } = this.props;

        if (submit) {
            if (typeof submit !== 'object') {
                submit = {};
            }
            return (
                <AntForm.Item {...this.getTailFormItemLayout()}>
                    {this.renderFooterButton(submit)}
                </AntForm.Item>
            );
        }

        if (footer) {
            return (
                <AntForm.Item {...this.getTailFormItemLayout()}>
                    {footer.map((button, index) => this.renderFooterButton(button, index))}
                </AntForm.Item>
            );
        }

        return;
    }

    renderFooterButton(props, key) {

        let btnProps = _.assign({}, {
            text: '提交',
            type: 'primary',
            htmlType: 'submit'
        }, props);

        return <Button {...btnProps} key={key} />;
    }

    /**
     * 获取表单项布局设置
     */
    getFormItemLayout() {
        const { direction, labelCol, controlCol } = this.props;

        return direction === 'horizontal' ? {
            labelCol: {
                span: labelCol
            },
            wrapperCol: {
                span: controlCol || GRID_COLUMN_NUMBER - labelCol
            }
        } : undefined;
    }

    /**
     * 获取尾部表单项布局设置
     */
    getTailFormItemLayout() {
        const { direction, labelCol, controlCol } = this.props;

        return direction === 'horizontal' ? {
            wrapperCol: {
                offset: labelCol,
                span: controlCol || GRID_COLUMN_NUMBER - labelCol
            }
        } : undefined;
    }
}

export const Form = AntForm.create()(BasicForm);
