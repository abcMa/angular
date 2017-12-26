import { connect } from 'react-redux';
import * as _ from 'lodash';

import { Form } from '../../components/form';

function mapStateToProps(state, props) {
    const { entity, fieldsFilter, mode } = props;
    let submit = props.submit;
    let { metainfo: { filters } } = entity;
    const fieldValues = entity.filters || {};

    if (fieldsFilter && fieldsFilter.length) {
        filters = _.pick(filters, fieldsFilter);
    }

    const fields = _.mapValues(filters, (config, name) => {
        let field = { ...config };

        field.value = fieldValues[name] || undefined;

        return field;
    });

    if (!submit || mode === 'change') {
        submit = false;
    }

    return {
        state: {
            fields: fields
        },
        submit: submit
    };
}

function mapDispatchToProps(dispatch, props) {
    const { entity, submit, mode, fieldsFilter } = props;

    return {
        onInit: () => {
            let { metainfo: { filters } } = entity;
            if (fieldsFilter && fieldsFilter.length) {
                filters = _.pick(filters, fieldsFilter);
            }
            const defaultFilters = _.reduce(filters, (result, filter, key) => {
                if (filter.defaultValue !== undefined) {
                    result[key] = filter.defaultValue;
                }
                return result;
            }, {});

            if (Object.keys(defaultFilters).length) {
                entity.filtersChange({...entity.filters, ...defaultFilters});
            }
        },
        // 表单域改变
        onFieldChange: (name, value) => {
            const fields = Object.assign({}, entity.filters, { [name]: value });
            entity.filtersChange(fields);
            if (mode === 'change') {
                entity.search(props.params);
            }
        },

        // 提交表单
        onSubmit: () => {
            if (!!submit) {
                entity.search(props.params);
            }
        }
    };
}

export const FilterForm = connect(mapStateToProps, mapDispatchToProps)(Form);
