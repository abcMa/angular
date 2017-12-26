'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.errorHandle = undefined;

var _css = require('antd/lib/message/style/css');

var _message = require('antd/lib/message');

var _message2 = _interopRequireDefault(_message);

var _statusCode = require('./status-code');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

_message2['default'].config({
    duration: 2
});

// const errorMessage = {

// };

var errorHandle = exports.errorHandle = function errorHandle(error) {

    _message2['default'].destroy();
    _message2['default'].error(error.status === undefined ? 'Request has been terminated Possible causes: the network is offline.' : error.response && error.response.body && error.response.body.err_msg || _statusCode.statusCode[error.status]);
};