/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

// This is installed as a <js-module /> so it doesn't have a cordova.define wrapper

var exec = require('cordova/exec');

var cmKeychain = function () {};

cmKeychain.prototype.getForKey = function (key, successCallback, failureCallback) {
    exec(successCallback, failureCallback, "cmKeychain", "getForKey", [key]);
};

cmKeychain.prototype.setForKey = function (key, value, successCallback, failureCallback) {
    exec(successCallback, failureCallback, "cmKeychain", "setForKey", [key, value]);
};

cmKeychain.prototype.removeForKey = function (key, successCallback, failureCallback) {
    exec(successCallback, failureCallback, "cmKeychain", "removeForKey", [key]);
};

if (!window.plugins) {
    window.plugins = {};
}

if (!window.plugins.cmKeychain) {
    window.plugins.cmKeychain = new cmKeychain();
}

module.exports = new cmKeychain();
