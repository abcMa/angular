import { connect } from 'react-redux';
import * as _ from 'lodash';

import { DataForm } from '../data-form';
import * as actions from '../../actions';

/**
 * 生成默认表单域
 * @param {object} properties 实体属性定义
 */
function generateDefaultFields(properties) {
    return _.mapValues(properties, (config, name) => {
        if (config.properties) {
            return generateDefaultFields(config.properties);
        }
        return config.defaultValue || undefined;
    });
}

function mapDispatchToProps(dispatch, props) {
    const {
        componentId,
        entity,
        fieldsFilter,
        onInit,
        onSubmit
    } = props;

    return _.defaults({
        onInit,
        onSubmit,
    }, {
        // 初始化表单结构
        onInit: () => {
            let { metainfo: { properties } } = entity;
            if (fieldsFilter && fieldsFilter.length) {
                properties = _.pick(properties, fieldsFilter);
            }
            const fields = generateDefaultFields(properties);

            dispatch(actions.formInitAction(componentId, {
                type: 'CreateForm',
                entityId: entity.id,
                fields
            }));
        },

        // 提交表单
        onSubmit: (event, fields) => {
            const entityFields = _.mapValues(fields, (field, name) => {
                return field.value;
            });
            entity.add(entityFields, props.params);
        },

        onSubmitStart: () => {
            dispatch(actions.componentSubmitAction(componentId, 'create'));
        }
    });
}

export const CreateForm = connect(null, mapDispatchToProps)(DataForm);
