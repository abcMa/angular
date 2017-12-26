import React, { Component } from 'react';
import { Cascader } from 'antd';
import * as _ from 'lodash';

export class TreeNodeCascader extends Component {
    static defaultProps = {
        placeholder: '请选择',
        rootId: '0'
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadId = '';               //当前加载项的id, 用于加载的去重
        this.state = { targetId: '' };  //当前选中的目标节点的id
    }

    /**
     * 在componentWillMount周期函数里进行对该组件的数据初始化加载
     */
    componentWillMount() {
        this.loadOptions(this.props.rootId);
    }

    render() {
        const { value, placeholder, options, disabled } = this.props;
        const formatOptions = this.formatOptionsData(options);
        let valueIds = _.map(this.props.value, val => {
            return val.id;
        });
        this.loadValueOptions(options, valueIds);
        const _value = _.map(value, val => {
            return val.name;
        });
        let props = {
            value: _value,
            options: formatOptions,
            loadData: this.loadData,
            onChange: this.onChange,
            changeOnSelect: false,
            placeholder,
            disabled
        };
        return (<Cascader  { ...props }/>);
    }

    /**
     * Cascader选择完成后的回调
     * @param {array} value - 选中的节点的value
     * @param {array} selectedOptions - 选中的各级节点, 每个节点是一个对象
     */
    onChange = (value, selectedOptions) => {
        const selectedValue = _.map(selectedOptions, val => {
            const { id, value } = val;
            return {
                id: id,
                name: value
            };
        });
        this.props.onChange(selectedValue, this.props.name);
    }

    /**
     * Cascader异步请求候选项的回调方法
     * @param {array} selectedOptions - 选中项
     */
    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[ selectedOptions.length - 1 ];
        const targetId = targetOption.id;
        this.setState({ targetId });
        this.loadOptions(targetId);
    }

    /**
     * 去加载对应节点的的option数据
     * @param {string} targetId - 要加载对应节点的Id
     */
    loadOptions = (targetId) => {
        const { name, entity, params } = this.props;
        const property = _.get(entity.metainfo.properties, name.split('.').join('.properties.'));
        entity.loadPropertyOptions(name, property.source, { ...params, id: targetId });
    }

    /**
     * 用于格式化options
     * @param {array} options - 格式化前的options数据
     * @returns {array} 符合Cascader组件格式{id,label,value,loading,isLeaf,children}的数据源
     */
    formatOptionsData(options) {
        return _.map(options, val => {
            const { id, name, isLeaf, children } = val;
            let loading = this.state.targetId === id && !isLeaf && !children;
            return {
                id,
                label: name,
                value: name,
                loading,
                isLeaf,
                children: children ? this.formatOptionsData(children) : null
            };
        });
    }

    /**
     * 加载value的options数据
     * @param {array} options - 当前的options数据
     * @param {array} valueIds - 由values中每一项的Id组成的数组
     */
    loadValueOptions(options, valueIds) {
        for (let item of options) {
            const { id, isLeaf, children } = item;
            if (valueIds.length > 0 && valueIds[ 0 ] === id && !isLeaf) {
                if (!children && this.loadId !== id) {
                    this.loadOptions(valueIds[ 0 ]);
                    this.loadId = id;
                } else if (children) {
                    valueIds.shift();
                    this.loadValueOptions(item.children, valueIds);
                }
            }
        }
    }

}