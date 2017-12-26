"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uuid = uuid;
function uuid() {
    function S4() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}