'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Form = exports.BasicForm = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _css = require('antd/lib/spin/style/css');

var _spin = require('antd/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _css2 = require('antd/lib/form/style/css');

var _form = require('antd/lib/form');

var _form2 = _interopRequireDefault(_form);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.getField = getField;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _componentProps = require('../component-props');

var _button = require('../button');

var _type = require('../../type');

var _services = require('../../services');

require('./index.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// 栅格总列数
var GRID_COLUMN_NUMBER = 24;

/**
 * 根据属性路径获取表单域
 * @param {string} path 属性路径
 * @param {object} fields 顶级表单域结构
 * @returns {object} 表单域
 */
function getField(path, fields) {
    var propertyNames = path.split('.');
    var field = void 0;
    var fieldName = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = propertyNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            fieldName.push(name);
            field = fields[fieldName.join('.')];
            if (!field) {
                break;
            }
            fields = field.fields;
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

    return field;
}

/**
 * 负责对接 Ant.Design 的表单组件
 */

var BasicForm = exports.BasicForm = function (_Component) {
    (0, _inherits3['default'])(BasicForm, _Component);

    function BasicForm(props) {
        (0, _classCallCheck3['default'])(this, BasicForm);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (BasicForm.__proto__ || Object.getPrototypeOf(BasicForm)).call(this, props));

        _this.handleFieldChange = _this.handleFieldChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }

    (0, _createClass3['default'])(BasicForm, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var onInit = this.props.onInit;
            if (onInit) {
                onInit();
            }
        }

        /**
         * 表单域修改事件处理函数
         */

    }, {
        key: 'handleFieldChange',
        value: function handleFieldChange(value, name) {
            var _this2 = this;

            var _props = this.props,
                onFieldChange = _props.onFieldChange,
                onReloadOptions = _props.onReloadOptions;


            if (onFieldChange) {
                onFieldChange(name, value);
            }

            var field = getField(name, this.props.state.fields);
            if (field.triggerOptionsReload && onReloadOptions) {
                setTimeout(function () {
                    _.forEach(field.triggerOptionsReload, function (fieldName) {
                        onReloadOptions(fieldName, _this2.props.state.fields);
                    });
                }, 0);
            }
        }

        /**
         * 表单提交事件处理函数
         */

    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            var _this3 = this;

            if (this.props.state.requestStatus === 'pending') {
                return;
            }

            if (event) {
                event.preventDefault();
            }

            this.props.form.validateFields(function (err, values) {
                if (!err) {
                    var _props2 = _this3.props,
                        onSubmitStart = _props2.onSubmitStart,
                        onSubmit = _props2.onSubmit;


                    if (onSubmitStart) {
                        onSubmitStart();
                    }

                    if (onSubmit) {
                        onSubmit(event, _this3.props.state.fields);
                    }
                }
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var prevStatus = this.props.state.requestStatus;
            var nextStatus = nextProps.state.requestStatus;
            var submitType = nextProps.state.submitType,
                onSubmitSuccess = nextProps.onSubmitSuccess,
                onSubmitError = nextProps.onSubmitError,
                submitSuccessBehavior = nextProps.submitSuccessBehavior,
                submitErrorBehavior = nextProps.submitErrorBehavior,
                onSubmitFinish = nextProps.onSubmitFinish;

            if (submitType && prevStatus === 'pending' && nextStatus === 'success') {
                if (onSubmitSuccess) {
                    onSubmitSuccess(nextProps.state.fields, submitType);
                }
                if (submitSuccessBehavior) {
                    (0, _services.behaviorHandle)(submitSuccessBehavior);
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
                    (0, _services.behaviorHandle)(submitErrorBehavior);
                }
                if (onSubmitFinish) {
                    onSubmitFinish();
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props,
                direction = _props3.direction,
                className = _props3.className,
                style = _props3.style,
                showSpin = _props3.showSpin,
                state = _props3.state;


            var form = _react2['default'].createElement(
                _form2['default'],
                { layout: direction, onSubmit: this.handleSubmit, className: className, style: style },
                this.renderFormFields(this.props.state.fields),
                this.renderFormFooter()
            );

            if (showSpin !== false) {
                var spinning = !!state && state.requestStatus === 'pending';

                return _react2['default'].createElement(
                    _spin2['default'],
                    { spinning: spinning },
                    form
                );
            } else {
                return form;
            }
        }

        /**
         * 渲染表单域
         */

    }, {
        key: 'renderFormFields',
        value: function renderFormFields(fields) {
            var _this4 = this;

            return _.map(fields, function (field, fieldname) {
                if (field.format === 'subForm') {
                    return _this4.renderSubForm(fieldname, field);
                } else {
                    return _this4.renderFormItem(fieldname, field);
                }
            });
        }

        /**
         * 渲染子表单
         */

    }, {
        key: 'renderSubForm',
        value: function renderSubForm(fieldname, field) {
            if (this.props.direction === 'inline') {
                // 行内表单不添加子表单标题和缩进
                return this.renderFormFields(field.fields);
            } else {
                return _react2['default'].createElement(
                    'fieldset',
                    { className: 'sub-form', key: fieldname },
                    _react2['default'].createElement(
                        'legend',
                        { className: 'sub-form-title' },
                        field.displayName || fieldname
                    ),
                    this.renderFormFields(field.fields)
                );
            }
        }

        /**
         * 渲染表单项
         */

    }, {
        key: 'renderFormItem',
        value: function renderFormItem(fieldname, field) {
            var type = field.type,
                format = field.format;

            var label = field.displayName || fieldname;
            var value = field.value;

            // 表单项设置
            var formItemProps = (0, _extends3['default'])({
                key: fieldname,
                label: label
            }, this.getFormItemLayout());

            // 渲染不可编辑域
            if (field.modifiable === false) {
                return _react2['default'].createElement(
                    _form2['default'].Item,
                    formItemProps,
                    (0, _type.getTypeSystem)(type, format).getDisplayComponent(value, (0, _extends3['default'])({}, field.displayConfig, {
                        name: field.name,
                        options: field.options
                    }))
                );
            }

            var getFieldDecorator = this.props.form.getFieldDecorator;

            var validate = (0, _type.getTypeSystem)(type, format).validate;
            var rules = field.rules || [];

            // 统一required校验失败message
            rules = rules.map(function (rule) {
                if (rule.required && !rule.message) {
                    rule.message = label + ' is required';
                }
                return rule;
            });

            return _react2['default'].createElement(
                _form2['default'].Item,
                formItemProps,
                getFieldDecorator(fieldname, {
                    rules: [].concat((0, _toConsumableArray3['default'])(rules), [{ validator: validate }]),
                    initialValue: value
                })(this.renderFormControl(fieldname, field))
            );
        }

        /**
         * 渲染表单项中的输入组件
         */

    }, {
        key: 'renderFormControl',
        value: function renderFormControl(fieldname, field) {
            var _props4 = this.props,
                entity = _props4.entity,
                params = _props4.params;
            var type = field.type,
                format = field.format;


            var props = (0, _extends3['default'])({}, field.controlConfig, {
                name: fieldname,
                entity: entity,
                params: params,
                disabled: field.disabled,
                options: field.options,
                onChange: this.handleFieldChange
            });

            var control = (0, _type.getTypeSystem)(type, format).getControlComponent(props);

            return control;
        }

        /**
         * 渲染表单页脚
         */

    }, {
        key: 'renderFormFooter',
        value: function renderFormFooter() {
            var _this5 = this;

            var _props5 = this.props,
                submit = _props5.submit,
                footer = _props5.footer;


            if (submit) {
                if ((typeof submit === 'undefined' ? 'undefined' : (0, _typeof3['default'])(submit)) !== 'object') {
                    submit = {};
                }
                return _react2['default'].createElement(
                    _form2['default'].Item,
                    this.getTailFormItemLayout(),
                    this.renderFooterButton(submit)
                );
            }

            if (footer) {
                return _react2['default'].createElement(
                    _form2['default'].Item,
                    this.getTailFormItemLayout(),
                    footer.map(function (button, index) {
                        return _this5.renderFooterButton(button, index);
                    })
                );
            }

            return;
        }
    }, {
        key: 'renderFooterButton',
        value: function renderFooterButton(props, key) {

            var btnProps = _.assign({}, {
                text: '提交',
                type: 'primary',
                htmlType: 'submit'
            }, props);

            return _react2['default'].createElement(_button.Button, (0, _extends3['default'])({}, btnProps, { key: key }));
        }

        /**
         * 获取表单项布局设置
         */

    }, {
        key: 'getFormItemLayout',
        value: function getFormItemLayout() {
            var _props6 = this.props,
                direction = _props6.direction,
                labelCol = _props6.labelCol,
                controlCol = _props6.controlCol;


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

    }, {
        key: 'getTailFormItemLayout',
        value: function getTailFormItemLayout() {
            var _props7 = this.props,
                direction = _props7.direction,
                labelCol = _props7.labelCol,
                controlCol = _props7.controlCol;


            return direction === 'horizontal' ? {
                wrapperCol: {
                    offset: labelCol,
                    span: controlCol || GRID_COLUMN_NUMBER - labelCol
                }
            } : undefined;
        }
    }]);
    return BasicForm;
}(_react.Component);

BasicForm.defaultProps = {
    direction: 'horizontal',
    labelCol: 8
};
BasicForm.propTypes = (0, _extends3['default'])({}, _componentProps.basicPropTypes, {

    // 表单域数据
    fields: _propTypes2['default'].object,

    // 表单域修改事件
    onFieldChange: _propTypes2['default'].func,

    // 表单提交事件（该事件将在点击提交按钮并校验完成后触发）
    onSubmit: _propTypes2['default'].func,

    // 表单布局
    direction: _propTypes2['default'].oneOf(['horizontal', 'vertical', 'inline']),

    // 定义 label 宽度
    labelCol: _propTypes2['default'].oneOf(_.range(1, 25)),

    // 定义 输入控件 宽度
    controlCol: _propTypes2['default'].oneOf(_.range(1, 25)),

    // 是否提供提交操作，若为 false，则不显示提交按钮，反之则显示。
    // 另外可以通过提供一个配置对象定义提交操作完成后的附加行为。
    submit: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].shape({
        text: _propTypes2['default'].string,
        type: _propTypes2['default'].string,
        tooltip: _propTypes2['default'].string,
        shape: _propTypes2['default'].string,
        icon: _propTypes2['default'].string,
        style: _propTypes2['default'].string,
        router: _propTypes2['default'].string,
        link: _propTypes2['default'].string,
        action: _propTypes2['default'].object
    })])
});
var Form = exports.Form = _form2['default'].create()(BasicForm);