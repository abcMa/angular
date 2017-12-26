import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

const PREFIX = 'web-pg-';
const TOKEN = 'ieBTLnyrcmpvtXTtqEVgzRWhhetgiemb';

// 清理未加密本地存储
if (!!window.localStorage[PREFIX + 'username']) {
    window.localStorage.clear();
}

/**
 * 本地数据存储操作服务
 *
 * 1. 以 key-value 方式存储
 * 2. 不支持时间等扩展对象
 * 3. 当某个 key 对应的 value 为 undefined 时（不包括 null），视为该条数据不存在。
 */
export let localStorage = {
    /**
     * 判断数据是否存在
     */
    has: function(key) {
        try {
            return !!window.localStorage[PREFIX + key];
        } catch (e) { return false; }
    },

    /**
     * 设置数据
     */
    set: function(key, value) {
        try {
            var uKey = PREFIX + key;

            if (value !== undefined) {
                value = AES.encrypt(JSON.stringify(value), TOKEN);
                window.localStorage[uKey] = value;
            }
            else {
                localStorage.remove(key);
            }

            return this;
        } catch (e) {  }
    },

    /**
     * 从本地仓库中获取对应的值
     * @param key {String} 要获取的数据的 key
     * @param defVal? {*}  如果所获取的数据不存在，所返回的默认值
     * @param storeDefVal? {*} 如果指定了默认值，是否将其存储到本地仓库中
     */
    get: function(key, defVal, storeDefVal) {
        try {
            var uKey = PREFIX + key,
                value = window.localStorage[uKey];

            return value ? JSON.parse(AES.decrypt(value, TOKEN).toString(Utf8)) :
                ((storeDefVal && defVal !== undefined && localStorage.set(key, defVal)), defVal);
        } catch (e) {  }
    },

    /**
     * 移除数据
     */
    remove: function(key) {
        try {
            var uKey = PREFIX + key;
            delete window.localStorage[uKey];
            return this;
        } catch (e) {  }
    }
};
