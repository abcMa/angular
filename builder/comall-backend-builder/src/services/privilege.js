import * as _ from 'lodash';

import { store } from '../store';

const PRIVILEGE_HIERACHY = {
    full: 3,
    modify: 2,
    view: 1,
    none: 0
};

const PRIVILEGE_NAME = {
    'target': 50,
    'shipmentTarget': 1100,
    'offtakeTarget': 1101,
    'campaign': 51,
    'monitor': 52,
    'authority': 53,
    'role': 1300,
    'user': 1301,
};

function getPrevilegeLevelByPath(privileges, path) {
    let keys = path.split('.');

    let currentPrivilege;
    for (let key of keys) {
        currentPrivilege = _.find(privileges, { id: PRIVILEGE_NAME[key] });
        if (currentPrivilege) {
            privileges = currentPrivilege.children;
        } else {
            return 'none';
        }
    }
    return currentPrivilege.level;
}

function check(path, level) {
    let privileges = store.getState().user.privileges;
    let userLevel = getPrevilegeLevelByPath(privileges, path);
    return PRIVILEGE_HIERACHY[userLevel] >= PRIVILEGE_HIERACHY[level];
}

function convertRouterItem(item) {
    item = Object.assign({}, item);
    item.routers = _.reduce(item.routers, ( result, node ) => {
        if (!node.privilege || check(node.privilege.path, node.privilege.level)) {
            result.push(convertRouterItem(node));
        }
        return result;
    }, []);
    return item;
}

function convertRouter(router) {
    let convertedRouter;
    for (let item of router) {
        if (!item.privilege || check(item.privilege.path, item.privilege.level)) {
            convertedRouter = convertRouterItem(item);
            break;
        }
    }
    return convertedRouter;
}

export const privilege = {
    check,
    convertRouter
};
