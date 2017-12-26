'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TreeNodeCascader = undefined;

var _css = require('antd/lib/cascader/style/css');

var _cascader = require('antd/lib/cascader');

var _cascader2 = _interopRequireDefault(_cascader);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var TreeNodeCascader = exports.TreeNodeCascader = function (_Component) {
    (0, _inherits3['default'])(TreeNodeCascader, _Component);

    function TreeNodeCascader(props) {
        (0, _classCallCheck3['default'])(this, TreeNodeCascader);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (TreeNodeCascader.__proto__ || Object.getPrototypeOf(TreeNodeCascader)).call(this, props));

        _this.onChange = function (value, selectedOptions) {
            var selectedValue = _.map(selectedOptions, function (val) {
                var id = val.id,
                    value = val.value;

                return {
                    id: id,
                    name: value
                };
            });
            _this.props.onChange(selectedValue, _this.props.name);
        };

        _this.loadData = function (selectedOptions) {
            var targetOption = selectedOptions[selectedOptions.length - 1];
            var targetId = targetOption.id;
            _this.setState({ targetId: targetId });
            _this.loadOptions(targetId);
        };

        _this.loadOptions = function (targetId) {
            var _this$props = _this.props,
                name = _this$props.name,
                entity = _this$props.entity,
                params = _this$props.params;

            var property = _.get(entity.metainfo.properties, name.split('.').join('.properties.'));
            entity.loadPropertyOptions(name, property.source, (0, _extends3['default'])({}, params, { id: targetId }));
        };

        _this.onChange = _this.onChange.bind(_this);
        _this.loadData = _this.loadData.bind(_this);
        _this.loadId = ''; //当前加载项的id, 用于加载的去重
        _this.state = { targetId: '' }; //当前选中的目标节点的id
        return _this;
    }

    /**
     * 在componentWillMount周期函数里进行对该组件的数据初始化加载
     */


    (0, _createClass3['default'])(TreeNodeCascader, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.loadOptions(this.props.rootId);
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                value = _props.value,
                placeholder = _props.placeholder,
                options = _props.options,
                disabled = _props.disabled;

            var formatOptions = this.formatOptionsData(options);
            var valueIds = _.map(this.props.value, function (val) {
                return val.id;
            });
            this.loadValueOptions(options, valueIds);
            var _value = _.map(value, function (val) {
                return val.name;
            });
            var props = {
                value: _value,
                options: formatOptions,
                loadData: this.loadData,
                onChange: this.onChange,
                changeOnSelect: false,
                placeholder: placeholder,
                disabled: disabled
            };
            return _react2['default'].createElement(_cascader2['default'], props);
        }

        /**
         * Cascader选择完成后的回调
         * @param {array} value - 选中的节点的value
         * @param {array} selectedOptions - 选中的各级节点, 每个节点是一个对象
         */


        /**
         * Cascader异步请求候选项的回调方法
         * @param {array} selectedOptions - 选中项
         */


        /**
         * 去加载对应节点的的option数据
         * @param {string} targetId - 要加载对应节点的Id
         */

    }, {
        key: 'formatOptionsData',


        /**
         * 用于格式化options
         * @param {array} options - 格式化前的options数据
         * @returns {array} 符合Cascader组件格式{id,label,value,loading,isLeaf,children}的数据源
         */
        value: function formatOptionsData(options) {
            var _this2 = this;

            return _.map(options, function (val) {
                var id = val.id,
                    name = val.name,
                    isLeaf = val.isLeaf,
                    children = val.children;

                var loading = _this2.state.targetId === id && !isLeaf && !children;
                return {
                    id: id,
                    label: name,
                    value: name,
                    loading: loading,
                    isLeaf: isLeaf,
                    children: children ? _this2.formatOptionsData(children) : null
                };
            });
        }

        /**
         * 加载value的options数据
         * @param {array} options - 当前的options数据
         * @param {array} valueIds - 由values中每一项的Id组成的数组
         */

    }, {
        key: 'loadValueOptions',
        value: function loadValueOptions(options, valueIds) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;
                    var id = item.id,
                        isLeaf = item.isLeaf,
                        children = item.children;

                    if (valueIds.length > 0 && valueIds[0] === id && !isLeaf) {
                        if (!children && this.loadId !== id) {
                            this.loadOptions(valueIds[0]);
                            this.loadId = id;
                        } else if (children) {
                            valueIds.shift();
                            this.loadValueOptions(item.children, valueIds);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);
    return TreeNodeCascader;
}(_react.Component);

TreeNodeCascader.defaultProps = {
    placeholder: '请选择',
    rootId: '0'
};