/***
 * 数据统计
 *基于cofferSem提供的API接口来做
 **/

angular.module('app.services').factory('cofferSem', function(
    $rootScope, messageCenter, stateUtils, $http, localStorage, orderService
) {

    var history = [];

    function initParam(idfa) {

        var APPKEY = {
            IOS: 'DCFDCF7076DD3110A86FAC96896D6D22_606',
            ANDROID: 'B1BB0551D10C5EFBE1966ADB56AAF214_606'
        };

        var mac = '', imei = '';

        // logtime 2016-05-04:12-00-03
        var sid = localStorage.get("sid");
        var logtime = moment().format("YYYY-MM-DD:h-mm-ss");

        //参数拼接，iOS和android会有差别
        var params = "";
        if (ionic.Platform.isIOS()) {

            if (idfa) {
                params = "&idfa=" + idfa ;
            }

            params +=  "&appkey=" + APPKEY.IOS;

        }else if(ionic.Platform.isAndroid()) {

            if (window.cordova && window.cordova.plugins) {

                mac = window.cordova.plugins.uid.MAC;
                imei = window.cordova.plugins.uid.IMEI;

                if (mac) {
                    params = "&mac=" + mac;
                }

                if (imei) {
                    params += "&imei=" + imei;
                }
            }

            params += "&appkey=" + APPKEY.ANDROID;
        }

        params += "&sid=" + sid + "&logtime=" + logtime;
        var commonParam = "type=s2s" + params;
        return commonParam;
    }

    function eventUrlEncode(commonParam, eid, ext_args){
        ext_args = encodeURIComponent(ext_args);
        var eventUrl = "http://trk8.cn/app/e?" + commonParam + "&eid=" + eid + "&ext_args=" + ext_args;
        $http.get(eventUrl);
    }

    function pageUrlEncode(commonParam, ownParam, param) {
        var pageUrl = "http://trk8.cn/app/p?" + commonParam + ownParam + param;
        $http.get(pageUrl);
    }

    var cofferSem = {

        commonParam: '',

        //应用启动时，需要的参数 isactivity 是否首次打开 0 否 1 是
        initApp: function(isactivity){
            var startAppUrl = "http://trk8.cn/app/a?" + cofferSem.commonParam + "&isactivity=" +isactivity;
            $http.get(startAppUrl);
        },

        //页面相应时，发送数据，详情页和列表页特殊对待
        init: function(idfa) {

            cofferSem.commonParam = initParam(idfa);

            // 监听视图进入
            $rootScope.$on('$ionicView.afterEnter', function(event, data) {

                if (data.stateName) {

                    if (data.stateName == "tabs.userCarrefourWallet") {
                        return;
                    }

                    //截取字符串，去掉.tabs 后缀
                    var title = (data.title || data.stateName.substring(5));
                    history.push(title);
                    var ownParam = "&pn=" + title + "&at=1";

                    if (title.toLowerCase().indexOf("categoriesproductlist") > -1 ) {

                        //CategoryName  类目名称 ProductIDList  列表中ID列表
                        var categoryName = localStorage.get('categoryName') ? localStorage.get('categoryName') : '';
                        var productIdList = localStorage.get('productIdList') ? localStorage.get('productIdList') : '';
                        var param = "&CategoryName=" + categoryName + "&ProductIDList=" + productIdList;
                        localStorage.set('pageProductListParam', param);
                        pageUrlEncode(cofferSem.commonParam, ownParam, param);
                    }
                }
            }); 

            // 监听视图离开
            $rootScope.$on('$ionicView.beforeLeave', function(event, data) {
                if (data.stateName) {

                    if (data.stateName == "tabs.userCarrefourWallet") {
                        return;
                    }

                    var title = (data.title || data.stateName.substring(5)),
                        ownParam = "&pn=" + title + "&at=0",
                        param = '';

                    if (title.toLowerCase().indexOf("categoriesproductlist") > 0 ) {
                        param = localStorage.get('pageProductListParam') ? localStorage.get('pageProductListParam') : '';
                    }else if(title.toLowerCase().indexOf("productinfo") > 0 ){
                        param = localStorage.get('pageProductInfoParam') ? localStorage.get('pageProductInfoParam') : '';
                    }

                    pageUrlEncode(cofferSem.commonParam, ownParam, param);

                }
            });

            messageCenter.subscribeMessage('productInfo.lodaData', function(event, data) {

                var title = history[history.length - 1].toLowerCase().indexOf('productinfo') > -1 ? history[history.length - 1] : 'productInfo';
                var ownParam = "&pn=" + title + "&at=1";
                //CategoryName 所属类目名称 productID 商品ID stock 商品库存状态
                var productId = data.productId ? data.productId : '';
                var categoryName = data.categoryName ? data.categoryName : '';
                var stock = data.goods ? data.goods.count : 0;
                var param = "&CategoryName=" + categoryName + "&productID=" + productId + "&stock=" + stock;
                localStorage.set('pageProductInfoParam', param);

                pageUrlEncode(cofferSem.commonParam, ownParam, param);
            });

            //监听弹出层开启
//            messageCenter.subscribeMessage('modal.open', function(event, title) {
//
//                if (title) {
//                    //var title = (data.title || data.stateName.substring(5));
//                    //if (!firstState) {
//                    history.push(title);
//
//                    var ownParam = "&pn=" + title + "&at=1";
//                    pageUrlEncode(cofferSem.commonParam, ownParam, '');
//                }
//
//            });

            //监听弹出层关闭
//            messageCenter.subscribeMessage('modal.close', function(event, title) {
//                history.pop();
//
//                if (title) {
//                    //var title = (data.title || data.stateName.substring(5));
//                    //if (!firstState) {
//                    history.push(title);
//
//                    var ownParam = "&pn=" + title + "&at=0";
//                    pageUrlEncode(cofferSem.commonParam, ownParam, '');
//                }
//
//            });

            /**
            *   eid：可以是字符串，数字，特殊符号，汉字均可。推荐为字符串格式，
            *    不过对于电商类APP，请对应使用如下默认事件：
            *    _register，注册。//注册成功
            *    _login，登录。  //登录成功
            *    _cart，添加购物车。   //货品加入购物车
            *    _cartsubmit，创建订单。   //与提交订单重复（成功）
            *    _ordersubmit，提交订单。  //成功提交订单
            *    _pay，支付。     //支付成功
            */

            /**
                ext_args ：每个KV之间必须用“；”分开,同一个Key有多个value的话要用“,”分开。如
                ext_args=mpage_type=123,34,22;mproduct_id=3
                在拼接URL地址时，记得url encode
            */


            // 监听注册成功 CustomerID： 唯一标识的客户编号 RegisterTime： 注册成功提交的时间
            messageCenter.subscribeMessage('register.success', function(event,data) {
                var eid = "_register",
                    custmerId = data.loginName,
                    registerTime = data.registerTime;

                var ext_args = "CustomerID=" + custmerId + 
                               ";RegisterTime=" + registerTime;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);

            });

            // 监听提交订单成功 CustomerID:   唯一标识的客户编号 OrderID:  订单编号 OrderCreateTime:   订单创建时间 (订单创建与订单提交是一个事件，数据一样)
            messageCenter.subscribeMessage('checkout.success', function(event, data) {
                var eid = "_ordersubmit",
                    userId = APP_USER.loginName,
                    orderSubmitTime = data.orderSubmitTime,
                    orderNumber = data.orderNumber;

                var ext_args = "CustomerID=" + userId + 
                               ";OrderID=" + orderNumber + 
                               ";OrderCreateTime=" + orderSubmitTime;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);
            });

            // 监听提交订单成功 CustomerID:   唯一标识的客户编号 OrderID:  订单编号 OrderSubmitTime:   订单提交时间
            messageCenter.subscribeMessage('checkout.success', function(event, data) {
                var eid = "_cartsubmit",
                    userId = APP_USER.loginName,
                    orderSubmitTime = data.orderSubmitTime,
                    orderNumber = data.orderNumber;

                var ext_args = "CustomerID=" + userId + 
                               ";OrderID=" + orderNumber + 
                               ";OrderCreateTime=" + orderSubmitTime;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);
            });

            // 监听支付成功 CustomerID:   唯一标识的客户编号 OrderID:  订单编号 PayTime:  支付时间 PayType:  支付类型
            messageCenter.subscribeMessage('pay.success', function(event, data) {
                var eid = "_pay",
                    orderId = data,
                    customerId = APP_USER.loginName,
                    orderInfo = orderService.paiedSuccess(orderId), 
                    paytype = orderInfo.payType,
                    payTime = orderInfo.payTime;

                var ext_args = "CustomerID=" + customerId + 
                               ";OrderID=" + orderId + 
                               ";PayTime=" + payTime + 
                               ";PayType=" + paytype;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);
            });

            // 用户登录    CustomerID： 唯一标识的客户编号 LoginTime：  登陆时间
            messageCenter.subscribeMessage('login', function(event, userInfo) {
                var eid = "_login",
                    userId = userInfo.loginName,
                    loginTime = userInfo.loginTime;

                var ext_args = "CustomerID=" + userId + 
                               ";LoginTime=" + loginTime;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);
            });

            // 用户登出
            messageCenter.subscribeMessage('logout', function(event) {

            });

            // 购物车添加成功 CustomerID：唯一标识的客户编号 ProductIDList：购物车内商品所对应的ID列表 CartTime： 商品添加入购物车的时间
            messageCenter.subscribeMessage('addGoods.success', function(event, data) {
                var goodsIdArray = [];

                _.each(data.baskets, function(basket) {
                    _.each(basket.basketItems, function(item) {
                        goodsIdArray.push(item.goodsId);
                    });
                });

                var eid = "_cart",
                    custmerId = APP_USER.loginName,
                    cartTime = data.opreateDate,
                    productIdList = goodsIdArray.join(',');

                var ext_args = "CustomerID=" + custmerId + 
                               ";ProductIDList=" + productIdList + 
                               ";CartTime=" + cartTime;

                eventUrlEncode(cofferSem.commonParam, eid, ext_args);
            });
        }
    }

    return cofferSem;
});
