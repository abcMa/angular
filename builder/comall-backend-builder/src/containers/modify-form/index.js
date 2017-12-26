import { connect } from 'react-redux';
import * as _ from 'lodash';

import { DataForm } from '../data-form';
import * as actions from '../../actions';

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
        onSubmit
    }, {
        // 初始化表单结构
        onInit: () => {
            let { fields: entityFields, metainfo: { properties } } = entity;
            const loaded = !!entityFields;

            if (fieldsFilter && fieldsFilter.length) {
                properties = _.pick(properties, fieldsFilter);
            }
            const fields = _.mapValues(properties, (config, name) => {
                return entityFields ? entityFields[name] : undefined;
            });

            dispatch(actions.formInitAction(componentId, {
                type: 'EditForm',
                entityId: entity.id,
                fields,
                loaded
            }));
        },

        // 提交表单
        onSubmit: (event, fields) => {
            const entityFields = _.mapValues(fields, (field, name) => {
                return field.value;
            });
            entity.modify(entityFields, props.params);
        },
        onSubmitStart: () => {
            dispatch(actions.componentSubmitAction(componentId, 'modify'));
        }
    });
}

export const ModifyForm = connect(null, mapDispatchToProps)(DataForm);
