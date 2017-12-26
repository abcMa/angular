'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExportButton = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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

var _button = require('../button');

var _services = require('../../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ExportButton = exports.ExportButton = function (_Component) {
    (0, _inherits3['default'])(ExportButton, _Component);

    function ExportButton(props) {
        (0, _classCallCheck3['default'])(this, ExportButton);

        var _this = (0, _possibleConstructorReturn3['default'])(this, (ExportButton.__proto__ || Object.getPrototypeOf(ExportButton)).call(this, props));

        _this.handleClick = _this.handleClick.bind(_this);

        _this.state = {
            loading: false
        };
        return _this;
    }

    /**
     * 处理按钮的点击事件
     */


    (0, _createClass3['default'])(ExportButton, [{
        key: 'handleClick',
        value: function handleClick(event) {
            var _this2 = this;

            var _interpolate$split = (0, _services.interpolate)(this.props.downloadUrl, this.props).split('?'),
                _interpolate$split2 = (0, _slicedToArray3['default'])(_interpolate$split, 2),
                url = _interpolate$split2[0],
                query = _interpolate$split2[1];

            var params = {};

            if (query) {
                query.split('&').forEach(function (expression) {
                    var _expression$split = expression.split('='),
                        _expression$split2 = (0, _slicedToArray3['default'])(_expression$split, 2),
                        key = _expression$split2[0],
                        value = _expression$split2[1];

                    params[key] = value;
                });
            }

            this.setState({ loading: true });

            var finish = function finish() {
                _this2.setState({ loading: false });
            };
            _services.api.download({ apiPath: url, params: params }).then(finish, finish);
        }
    }, {
        key: 'render',
        value: function render() {
            var props = (0, _extends3['default'])({}, this.props, {
                loading: this.state.loading,
                onClick: this.handleClick
            });

            return _react2['default'].createElement(_button.Button, props);
        }
    }]);
    return ExportButton;
}(_react.Component);