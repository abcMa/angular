'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entityActions = require('./entity-actions');

Object.keys(_entityActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _entityActions[key];
    }
  });
});

var _componentActions = require('./component-actions');

Object.keys(_componentActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _componentActions[key];
    }
  });
});

var _userActions = require('./user-actions');

Object.keys(_userActions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _userActions[key];
    }
  });
});