'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loading = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var loadingElement = void 0;

var loading = exports.loading = {
    // 开启全局读取中
    open: function open() {
        if (loadingElement) {
            return;
        }
        loadingElement = document.createElement('div');
        var spin = document.createElement('span');
        spin.className = 'ant-spin-dot';
        spin.innerHTML = '<i></i><i></i><i></i><i></i>';
        spin.style.display = 'inline-block';
        loadingElement.appendChild(spin);
        loadingElement.className = 'ant-spin ant-spin-spinning';
        (0, _extends3['default'])(loadingElement.style, {
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            textAlign: 'center',
            lineHeight: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
        });
        document.body.appendChild(loadingElement);
    },
    // 关闭全局读取中
    close: function close() {
        document.body.removeChild(loadingElement);
        loadingElement = null;
    }
};