import * as actions from '../actions';

export function userReducer(state = {}, action) {

    const payload = action.payload;

    switch (action.type) {

        case actions.LOGIN_SUCCESS:
        case actions.REFRESH_TOKEN_SUCCESS:
        case actions.GET_PERMISSION_SUCCESS:
            return { ...state, ...payload };

        case actions.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}
