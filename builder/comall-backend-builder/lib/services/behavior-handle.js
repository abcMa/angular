'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.behaviorHandle = undefined;

var _services = require('../services');

var _store = require('../store');

/**
 * 点击等行为处理器
 * @param {object} behavior - 行为信息
 */
var behaviorHandle = exports.behaviorHandle = function behaviorHandle(behavior) {
    var route = behavior.route,
        link = behavior.link,
        action = behavior.action,
        actions = behavior.actions;


    if (route) {
        if (route === 'goBack') {
            _services.navigation.goBack();
        } else {
            var entity = behavior.entity,
                params = behavior.params;

            _services.navigation.goto((0, _services.interpolate)(route, { entity: entity, params: params }));
        }
        action && _store.store.dispatch(action);
    } else if (action) {
        _store.store.dispatch(action);
    } else if (actions) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _action = _step.value;

                _store.store.dispatch(_action);
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
    } else if (link) {
        // TODO: 链接调转
    }
};