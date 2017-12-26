/**
 * 状态码配置，此处的状态码兼容业务接口所响应的状态码，
 * 并添加了一些客户端自定义的状态码，客户端自定义的状态码会添加前缀「C」。
 */
(function() {
    var stateCode = {
        unknownException:   '1',   // 未知异常
        notLogin:           '3',   // 用户未登录
        operationFailure:   '4',   // 业务失败
        networkAnomaly:     'C1',  // 网络异常
        abortRequest:       'C2',  // 请求被中止
        serviceException:   'C3',  // 当调用接口时，响应异常状态码
        applePayNotSupport: 'C4',  // 不支持 Apple Pay
        applePayFailure:    'C5',  // 使用 Apple Pay 支付失败
        applePayCancel:     'C6',  // 使用 Apple Pay 时取消支付
        messageNotFound:    'C7',  // 无法根据消息 id 找到对应的消息数据
        carrefourWallet:    'C8',  // 家乐福福卡自定义错误消息
    };

    // 交换 stateCode 中的 key 和 value，并将交换结果放入 stateCode 中，
    // 使 stateCode 成为一个状态名及状态码的双向映射表
    _.assign(stateCode, _.transform(stateCode, function(result, stateCode, stateName) {
        result[stateCode] = stateName;
    }));

    // 作为常量模块注册到 angular 中
    _.assign(window.APP_STATE_CODE, stateCode);
})();
