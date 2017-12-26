'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.privilege = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _store = require('../store');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var PRIVILEGE_HIERACHY = {
    full: 3,
    modify: 2,
    view: 1,
    none: 0
};

var PRIVILEGE_NAME = {
    'target': 50,
    'shipmentTarget': 1100,
    'offtakeTarget': 1101,
    'campaign': 51,
    'monitor': 52,
    'authority': 53,
    'role': 1300,
    'user': 1301
};

function getPrevilegeLevelByPath(privileges, path) {
    var keys = path.split('.');

    var currentPrivilege = void 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            currentPrivilege = _.find(privileges, { id: PRIVILEGE_NAME[key] });
            if (currentPrivilege) {
                privileges = currentPrivilege.children;
            } else {
                return 'none';
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

    return currentPrivilege.level;
}

function check(path, level) {
    var privileges = _store.store.getState().user.privileges;
    var userLevel = getPrevilegeLevelByPath(privileges, path);
    return PRIVILEGE_HIERACHY[userLevel] >= PRIVILEGE_HIERACHY[level];
}

function convertRouterItem(item) {
    item = (0, _extends3['default'])({}, item);
    item.routers = _.reduce(item.routers, function (result, node) {
        if (!node.privilege || check(node.privilege.path, node.privilege.level)) {
            result.push(convertRouterItem(node));
        }
        return result;
    }, []);
    return item;
}

function convertRouter(router) {
    var convertedRouter = void 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = router[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (!item.privilege || check(item.privilege.path, item.privilege.level)) {
                convertedRouter = convertRouterItem(item);
                break;
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return convertedRouter;
}

var privilege = exports.privilege = {
    check: check,
    convertRouter: convertRouter
};