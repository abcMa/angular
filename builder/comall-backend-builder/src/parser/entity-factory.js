import * as _ from 'lodash';

import { store } from '../store';
import * as actions from '../actions';
let dispatch = store.dispatch;

let idCounter = 0;


/**
 * 根据属性路径获取实体属性
 * @param {string} path 属性路径
 * @param {object} properties 顶级属性属性定义
 * @returns {object} 实体属性
 */
function getProperty(path, properties) {
    path = path.split('.').join('.properties.');
    return _.get(properties, path);
}

/**
 * 构建一个实体类型
 * @param {string} name - 实体名称
 * @param {object} desc - 实体描述信息
 */
export function entityFactory(name, desc) {
    let {
        apiPath, apiRoot, paramsFilter,
        properties: propertiesDefination,
        filters: filtersDefination
    } = desc;

    class Entity {
        static getProperty = getProperty

        constructor(params) {
            // 实体 ID
            this.id = idCounter++;
            // 存储路由参数
            this.params = params;

            let properties = _.cloneDeep(propertiesDefination);
            let filters = _.cloneDeep(filtersDefination);

            // 处理属性候选项
            _.forEach(properties, (property, name) => {
                this.initPropertyMeta(name, property, properties);
            });

            // 获取筛选器候选项
            _.forEach(filters, (filter, name) => {
                const { options, source } = filter;
                if (options && source && source.loadOnInit !== false) {
                    this.loadFilterOptions(name, source);
                }
            });

            // 初始化实体的元信息定义
            this.setMeta({
                name,
                properties,
                filters,
                apiPath,
                apiRoot,
                paramsFilter
            });
        }

        /**
         * 初始化实体属性的元信息
         * @param {string} propertyName - 属性名
         * @param {object} propertyDefination - 属性定义
         * @param {object} properties - 实体所有属性定义
         */
        initPropertyMeta(propertyName, propertyDefination, properties) {
            const { options, source } = propertyDefination;
            if (options && source) {
                if (source.dependences) {
                    _.forEach(source.dependences, dependence => {
                        let property = Entity.getProperty(dependence, properties);
                        if (!property) {
                            throw new Error(`Dependence ${dependence} required by ${propertyName} not found.`);
                        }
                        if (!property.triggerOptionsReload) {
                            property.triggerOptionsReload = [];
                        }
                        property.triggerOptionsReload.push(propertyName);
                    });
                }

                if (source.loadOnInit !== false) {
                    this.loadPropertyOptions(propertyName, source);
                }
            }
            // 处理子属性
            _.forEach(propertyDefination.properties, (subProperty, subPropertyName) => {
                this.initPropertyMeta(`${propertyName}.${subPropertyName}`, subProperty, properties);
            });
        }

        /**
         * 更新实体的元信息定义
         * @param {object} changedMeta - 发生改变的实体的元信息定义
         */
        setMeta(changedMeta) {
            const meta = Object.assign({}, this.metainfo, changedMeta);
            dispatch(actions.setEntityMetaAction(this, meta));
        }

        /**
         * 更新筛选器信息
         * @param {object} changedFilters - 发生改变的筛选器信息
         */
        filtersChange(changedFilters) {
            const filters = Object.assign({}, this.filters, changedFilters);
            dispatch(actions.filtersChangeAction(this, filters));
        }

        /**
         * 更新分页信息
         * @param {object} changedPageInfo - 发生改变的分页信息
         */
        pageChange(changedPageInfo) {
            const paging = Object.assign({}, this.paging, changedPageInfo);
            dispatch(actions.pageChangeAction(this, paging));
        }

        /**
         * 查询
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 查询成功后的行为
         * @param {object} errorBehavior - 查询失败后的行为
         */
        search(params, successBehavior, errorBehavior) {
            dispatch(actions.searchAction(this, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 加载下一页数据
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 加载成功后的行为
         * @param {object} errorBehavior - 加载失败后的行为
         */
        loadNextPage(params, successBehavior, errorBehavior) {
            dispatch(actions.loadNextPageAction(this, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 添加新资源
         * @param {object} fields - 新资源属性信息
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 添加成功后的行为
         * @param {object} errorBehavior - 添加失败后的行为
         */
        add(fields, params, successBehavior, errorBehavior) {
            dispatch(actions.addAction(this, fields, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 删除目标资源
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 删除成功后的行为
         * @param {object} errorBehavior - 删除失败后的行为
         */
        delete(params, successBehavior, errorBehavior) {
            dispatch(actions.deleteAction(this, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 获取目标资源信息
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 获取成功后的行为
         * @param {object} errorBehavior - 获取失败后的行为
         */
        get(params, successBehavior, errorBehavior) {
            dispatch(actions.getAction(this, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 修改目标资源的信息
         * @param {object} fields - 修改后的资源属性信息
         * @param {object} params - 路由参数
         * @param {object} successBehavior - 修改成功后的行为
         * @param {object} errorBehavior - 修改失败后的行为
         */
        modify(fields, params, successBehavior, errorBehavior) {
            dispatch(actions.modifyAction(this, fields, {...this.params, ...params},
                successBehavior, errorBehavior));
        }

        /**
         * 获取属性候选项
         * @param {string} path - 属性路径
         * @param {object} source - 远程资源定义
         * @param {object} params - 路由参数
         * */
        loadPropertyOptions(path, source, params) {
            let { apiRoot, apiPath, paramsFilter } = source;
            let data = {
                apiRoot, apiPath, paramsFilter,
                params: {...this.params, ...params}
            };
            dispatch(actions.loadPropertyOptionsAction(this, path, data));
        }

        /**
         * 获取筛选器候选项
         * @param {string} path - 筛选属性路径
         * @param {object} source - 远程资源定义
         * @param {object} params - 路由参数
         * */
        loadFilterOptions(path, source, params) {
            let { apiRoot, apiPath, paramsFilter } = source;
            let data = {
                apiRoot, apiPath, paramsFilter,
                params: {...this.params, ...params}
            };
            dispatch(actions.loadFilterOptionsAction(this, path, data));
        }

        /**
         * 设置资源信息
         * @param {string} fields - 资源信息
         * */
        setFields(fields) {
            dispatch(actions.setEntityFieldsAction(this, fields));
        }

        /** 销毁实体 */
        unmount() {
            dispatch(actions.unmountEntityAction(this));
        }

        /** 获取元信息 */
        get metainfo() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.metainfo;
        }

        /** 获取筛选器属性信息 */
        get filters() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.filters;
        }

        /** 获取分页信息 */
        get paging() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.paging;
        }

        /** 获取查询结果 */
        get result() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.result;
        }

        /** 获取表单信息 */
        get fields() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.fields;
        }

        /** 获取新创建资源的信息 */
        get created() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.created;
        }

        /** 获取请求状态 */
        get requestStatus() {
            const entityData = getEntityDataByStore(this.id);
            return entityData.requestStatus;
        }
    }

    return Entity;
}

/**
 * 从 Recux 仓库中获取指定的实体数据。
 * @param {number} id - 实体 ID
 * @return {object} 实体数据集
 */
function getEntityDataByStore(id) {
    const state = store.getState();
    return _.get(state, `entities[${id}]`, {});
}
