'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Progress = undefined;

var _css = require('antd/lib/progress/style/css');

var _progress = require('antd/lib/progress');

var _progress2 = _interopRequireDefault(_progress);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Progress = exports.Progress = function (_Component) {
    (0, _inherits3['default'])(Progress, _Component);

    function Progress() {
        (0, _classCallCheck3['default'])(this, Progress);
        return (0, _possibleConstructorReturn3['default'])(this, (Progress.__proto__ || Object.getPrototypeOf(Progress)).apply(this, arguments));
    }

    (0, _createClass3['default'])(Progress, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                percent = _props.percent,
                status = _props.status,
                showInfo = _props.showInfo;


            var progressProps = {
                percent: parseFloat(Math.min(percent, 100)),
                status: status,
                showInfo: showInfo,
                format: function format() {
                    return percent + '%';
                }
            };

            return _react2['default'].createElement(_progress2['default'], progressProps);
        }
    }]);
    return Progress;
}(_react.Component);