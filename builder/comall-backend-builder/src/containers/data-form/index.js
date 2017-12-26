import { connect } from 'react-redux';
import * as _ from 'lodash';

import { Form, getField } from '../../components/form';
import * as actions from '../../actions';

/**
 * 根据实体属性定义和实体数据生成表单域结构
 * @param {string} name 实体属性名称
 * @param {object} property 实体属性信息
 * @param {object} fieldValues 实体数据
 * @returns {object} 表单域结构
 */
function generateField(name, property, fieldValues) {
    let field = { ...property };

    field.value = _.get(fieldValues, name);

    if (field.format === 'subForm') {
        field.fields = _.reduce(field.properties,
            (result, subFormProperty, subFormPropertyName) => {
                let path = `${name}.${subFormPropertyName}`;
                result[path] = generateField(path, subFormProperty, fieldValues);
                return result;
            }, {});
    }

    return field;
}

function mapStateToProps(state, props) {
    const { componentId, entity, fieldsFilter } = props;
    let { metainfo: { properties } } = entity;
    const componentState = state.components[componentId] || {};
    const fieldValues = componentState.fields || {};

    if (fieldsFilter && fieldsFilter.length) {
        properties = _.pick(properties, fieldsFilter);
    }

    const fields = _.mapValues(properties, (property, name) =>
        (generateField(name, property, fieldValues)));

    return {
        state: {
            fields: fields,
            requestStatus: entity.requestStatus,
            submitType: componentState.submitType
        }
    };
}

function mapDispatchToProps(dispatch, props) {
    const {
        componentId,
        entity,
        onFieldChange,
        onReloadOptions,
        onSubmitStart
    } = props;

    return _.defaults({
        onFieldChange,
        onReloadOptions,
        onSubmitStart
    }, {
        // 表单域改变
        onFieldChange: (name, value) => {
            dispatch(actions.formChangeAction(componentId, name, value));
        },

        // 重新加载属性候选值
        onReloadOptions: (fieldName, fields) => {
            const field = getField(fieldName, fields);
            const sourceDefination = field.source;
            let dependences = sourceDefination.dependences;
            let params = _.reduce(dependences, (values, dependence) => {
                values[dependence] = getField(dependence, fields).value;
                return values;
            }, _.clone(props.params));
            entity.loadPropertyOptions(fieldName, sourceDefination, params);
        },

        // 提交表单开始
        onSubmitStart: () => {
            dispatch(actions.componentSubmitAction(componentId, 'submit'));
        },

        // 提交表单结束
        onSubmitFinish: () => {
            dispatch(actions.componentSubmitFinishAction(componentId));
        }
    });
}

export const DataForm = connect(mapStateToProps, mapDispatchToProps)(Form);
