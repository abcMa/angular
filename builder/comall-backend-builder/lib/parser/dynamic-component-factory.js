'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DynamicComponentFactory = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _components = require('./components');

var _entities = require('./entities');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _store = require('../store');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 组件唯一标识计数
var idCounter = 0;

/**
 * 动态组件工厂，用于基于所给的的组件配置动态创建组件类。
 * 动态组件会分配唯一标识，用于维护组件生命周期中的状态，组件 props 会添加 componentId
 */

var DynamicComponentFactory = exports.DynamicComponentFactory = function () {
    function DynamicComponentFactory() {
        (0, _classCallCheck3['default'])(this, DynamicComponentFactory);
    }

    (0, _createClass3['default'])(DynamicComponentFactory, null, [{
        key: 'create',


        /**
         * 创建动态组件
         * @param {string} name - 组件名称
         * @param {object} desc - 组件配置
         */
        value: function create(name, desc) {
            var BasisComponent = _components.Components.get(desc.component);
            var cachedStyle = void 0;

            var basisProps = _.assign({}, desc);
            delete basisProps.component;
            delete basisProps.entity;
            delete basisProps.entities;

            var DynamicComponent = function (_Component) {
                (0, _inherits3['default'])(DynamicComponent, _Component);

                // 组件被创建时如果关联了实体，则创建实体的实例
                function DynamicComponent(props) {
                    (0, _classCallCheck3['default'])(this, DynamicComponent);

                    var _this = (0, _possibleConstructorReturn3['default'])(this, (DynamicComponent.__proto__ || Object.getPrototypeOf(DynamicComponent)).call(this, props));

                    _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
                    _this.getWrappedInstance = _this.getWrappedInstance.bind(_this);
                    _this.componentId = idCounter++;
                    return _this;
                }

                // 组件加载时，初始化关联实体


                (0, _createClass3['default'])(DynamicComponent, [{
                    key: 'componentWillMount',
                    value: function componentWillMount() {
                        var _this2 = this;

                        var params = this.props.params;
                        var dispatch = _store.store.dispatch;


                        if (desc.entity) {
                            var entity = new (_entities.Entities.get(desc.entity))(params);
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
                            _.forEach(desc.entities, function (defination) {
                                var name = defination.name,
                                    entityName = defination.entityName,
                                    loaderType = defination.loaderType;

                                var entity = new (_entities.Entities.get(entityName))(params);
                                _this2.entities[name] = entity;

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

                }, {
                    key: 'componentWillUnmount',
                    value: function componentWillUnmount() {
                        var entity = this.entity,
                            entities = this.entities,
                            componentId = this.componentId;

                        if (entity) {
                            entity.unmount();
                        }
                        if (entities) {
                            _.forEach(entities, function (entity) {
                                entity.unmount();
                            });
                        }
                        if (_store.store.getState().components[componentId]) {
                            _store.store.dispatch(actions.unmountComponentAction(componentId));
                        }
                    }
                }, {
                    key: 'getWrappedInstance',
                    value: function getWrappedInstance() {
                        return this.wrappedInstance;
                    }
                }, {
                    key: 'setWrappedInstance',
                    value: function setWrappedInstance(ref) {
                        this.wrappedInstance = ref;
                    }
                }, {
                    key: 'render',
                    value: function render() {
                        var props = (0, _extends3['default'])({}, this.props, basisProps, this.getMergeProps(), {
                            componentId: this.componentId,
                            ref: this.setWrappedInstance
                        });

                        if (this.entity) {
                            props.entity = this.entity;
                        }

                        if (this.entities) {
                            props.entities = this.entities;
                        }

                        return (0, _react.createElement)(BasisComponent, props);
                    }

                    /**
                     * 全局组件配置 className 和 style 是可以合并的。
                     * 该方法会将当前组件的 props 及 basisProps 中的待合并属性进行组合，
                     * 在合并时若出现重复内容，则以当前组件配置为准。
                     */

                }, {
                    key: 'getMergeProps',
                    value: function getMergeProps() {
                        var style = _.assign({}, basisProps.style, this.props.style);
                        if (!_.isEqual(style, cachedStyle)) {
                            cachedStyle = style;
                        }
                        return {
                            className: (0, _classnames2['default'])(basisProps.className, this.props.className),
                            style: cachedStyle
                        };
                    }
                }]);
                return DynamicComponent;
            }(_react.Component);

            DynamicComponent.displayName = '$' + _.upperFirst(name);

            return DynamicComponent;
        }
    }]);
    return DynamicComponentFactory;
}();