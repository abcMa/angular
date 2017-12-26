import { Component, createElement } from 'react';
import classNames from 'classnames';
import * as _ from 'lodash';

import { Components } from './components';
import { Entities } from './entities';

import * as actions from '../actions';
import { store } from '../store';

// 组件唯一标识计数
let idCounter = 0;


/**
 * 动态组件工厂，用于基于所给的的组件配置动态创建组件类。
 * 动态组件会分配唯一标识，用于维护组件生命周期中的状态，组件 props 会添加 componentId
 */

export class DynamicComponentFactory {

    /**
     * 创建动态组件
     * @param {string} name - 组件名称
     * @param {object} desc - 组件配置
     */
    static create(name, desc) {
        const BasisComponent = Components.get(desc.component);
        let cachedStyle;

        const basisProps = _.assign({}, desc);
        delete basisProps.component;
        delete basisProps.entity;
        delete basisProps.entities;

        class DynamicComponent extends Component {

            // 组件被创建时如果关联了实体，则创建实体的实例
            constructor(props) {
                super(props);
                this.setWrappedInstance = this.setWrappedInstance.bind(this);
                this.getWrappedInstance = this.getWrappedInstance.bind(this);
                this.componentId = idCounter++;
            }

            // 组件加载时，初始化关联实体
            componentWillMount() {
                const { params } = this.props;
                const { dispatch } = store;

                if (desc.entity) {
                    let entity = new ( Entities.get(desc.entity) )(params);
                    this.entity = entity;

                    if (desc.loaderType === 'get') {
                        dispatch(actions.getAction(entity, params));
                    }

                    if (desc.loaderType === 'search') {
                        dispatch(actions.searchAction(entity, params));
                    }
                }

                if (desc.entities) {
                    this.entities = {};
                    _.forEach(desc.entities, defination => {
                        const { name, entityName, loaderType } = defination;
                        let entity = new ( Entities.get(entityName) )(params);
                        this.entities[name] = entity;

                        if (loaderType === 'get') {
                            dispatch(actions.getAction(entity, params));
                        }

                        if (loaderType === 'search') {
                            dispatch(actions.searchAction(entity, params));
                        }
                    });
                }

            }

            // 组件被销毁时，同时销毁已创建的实体实例
            componentWillUnmount() {
                const { entity, entities, componentId } = this;
                if (entity) {
                    entity.unmount();
                }
                if (entities) {
                    _.forEach(entities, entity => {
                        entity.unmount();
                    });
                }
                if (store.getState().components[componentId]) {
                    store.dispatch(actions.unmountComponentAction(componentId));
                }
            }

            getWrappedInstance() {
                return this.wrappedInstance;
            }

            setWrappedInstance(ref) {
                this.wrappedInstance = ref;
            }

            render() {
                let props = {
                    ...this.props,
                    ...basisProps,
                    ...(this.getMergeProps()),
                    componentId: this.componentId,
                    ref: this.setWrappedInstance
                };

                if (this.entity) {
                    props.entity = this.entity;
                }

                if (this.entities) {
                    props.entities = this.entities;
                }

                return createElement(BasisComponent, props);
            }

            /**
             * 全局组件配置 className 和 style 是可以合并的。
             * 该方法会将当前组件的 props 及 basisProps 中的待合并属性进行组合，
             * 在合并时若出现重复内容，则以当前组件配置为准。
             */
            getMergeProps() {
                let style = _.assign({}, basisProps.style, this.props.style);
                if (!_.isEqual(style, cachedStyle)) {
                    cachedStyle = style;
                }
                return {
                    className: classNames(basisProps.className, this.props.className),
                    style: cachedStyle
                };
            }
        }

        DynamicComponent.displayName = '$' + _.upperFirst(name);

        return DynamicComponent;
    }

}
