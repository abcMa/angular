import * as _ from 'lodash';

export const statusCode = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    REQUEST_ENTITY_TOO_LARGE: 413,
    REQUEST_URI_TOO_LONG_URI: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    LOCKED: 423,
    TOO_MANY_REQUEST: 429,
};

// 使 statusCode 成为一个状态名及状态码的双向映射表
_.assign(statusCode, _.transform(statusCode, function(result, code, name) {
    result[code] = name;
}));
