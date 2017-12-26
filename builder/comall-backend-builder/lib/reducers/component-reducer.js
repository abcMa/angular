'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends11 = require('babel-runtime/helpers/extends');

var _extends12 = _interopRequireDefault(_extends11);

exports.componentReducer = componentReducer;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function componentReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];
    var type = action.type,
        componentId = action.componentId,
        payload = action.payload;

    var componentState = state[componentId];

    if (componentId !== undefined) {

        switch (type) {

            case actions.COMPONENT_UNMOUNT:
                state = (0, _extends12['default'])({}, state);
                delete state[componentId];
                break;

            case actions.COMPONENT_FORM_INIT:
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, (0, _extends12['default'])({}, payload)));
                break;

            case actions.COMPONENT_FORM_CHANGE:
                componentState = (0, _extends12['default'])({}, componentState, {
                    fields: _.cloneDeep(componentState.fields)
                });
                _.forEach(payload, function (value, key) {
                    _.set(componentState.fields, key, value);
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_SUBMIT:
                componentState = (0, _extends12['default'])({}, componentState, {
                    submitType: payload
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_SUBMIT_FINISH:
                componentState = (0, _extends12['default'])({}, componentState, {
                    submitType: null
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_TABLE_ROW_SELECTION_CHANGE:
                componentState = (0, _extends12['default'])({}, componentState, {
                    selectedRowKeys: payload
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_TABLE_MODIFY_START:
                componentState = (0, _extends12['default'])({}, componentState, {
                    fields: (0, _extends12['default'])({}, payload)
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_TABLE_MODIFY_CHANGE:
                componentState = (0, _extends12['default'])({}, componentState, {
                    fields: (0, _extends12['default'])({}, componentState.fields, payload)
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_TABLE_MODIFY_FINISH:
                componentState = (0, _extends12['default'])({}, componentState, {
                    fields: null
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            case actions.COMPONENT_TABLE_SORT_CHANGE:
                componentState = (0, _extends12['default'])({}, componentState, {
                    sort: (0, _extends12['default'])({}, payload)
                });
                state = (0, _extends12['default'])({}, state, (0, _defineProperty3['default'])({}, componentId, componentState));
                break;

            default:
            // do nothing
        }
    }

    return state;
}