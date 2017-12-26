var service = "/mobile/api/";


function getQueryString(name, url) {
    if (!name || !url) {
        return false;
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var a = document.createElement("a");
    a.href = url;
    var r = a.search.substr(1).match(reg);
    if (r) {
        return decodeURIComponent(r[2]);
    }
    return false;
}

function getCookieByName(name) {
    var cookies = document.cookie,
        nameStartIndex,
        cookieStartIndex,
        cookieEndIndex,
        cookie;

    if (!cookies) return undefined;

    nameStartIndex = cookies.indexOf(name + '=');

    if (nameStartIndex > -1) {
        cookieStartIndex = nameStartIndex + name.length + 1;
        cookieEndIndex = cookies.indexOf(';', cookieStartIndex);

        if (cookieEndIndex === -1) {
            cookieEndIndex = cookies.length;
        }

        cookie = unescape(cookies.substring(cookieStartIndex, cookieEndIndex));
    }

    return cookie;
}

function isWeixinBrowser() {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
}

function switchPage(name) {
    $('.page').each(function (index, item) {
        var $item = $(item);
        if ($item.hasClass(name)) {
            $item.show();
        } else {
            $item.hide();
        }
    });
}

function checkDevices(unique, mobile, os, callback) {
    $.ajax({
        type: "POST",
        url: service + "storeRegistration/validateReceive",
        dataType: "JSON",
        data: {
            memberId: mobile,
            unique: unique,
            registerOs: os
        },
        success: callback
    });
}

function getGift(unique, mobile, password, os, callback) {
    $.ajax({
        type: "POST",
        url: service + "storeRegistration/receive",
        dataType: "JSON",
        data: {
            memberId: mobile,
            unique: unique,
            password: password,
            registerOs: os
        },
        success: callback
    });
}

function doCheck(params) {
    checkDevices(params.u, params.m, params.os, function (response) {
        if (response.result > 1) {
            $('.tip').text(response.tip);
            $('.loading').fadeOut(function () {
                switchPage('error');
            });
            return;
        }
        $('.loading').fadeOut(function () {
            switchPage('code');
        });
    });
}

function analyticsParams(url) {
    var empty = {
        u: 0,
        m: 0,
        os: ''
    };
    try {
        var query = getQueryString('lp', url);
        if (query) {
            return JSON.parse(query);
        } else {
            return empty;
        }
    } catch (e) {
        return empty;
    }
}

function doScan(callback) {
    wx.scanQRCode({
        needResult: 1,
        success: function (res) {
            if (!res.resultStr) {
                setTimeout(function () {
                    alert('扫描二维码异常');
                }, 1000);
                return;
            }
            callback(analyticsParams(res.resultStr));
        },
        fail: function (res) {
            setTimeout(function () {
                alert(res);
            }, 1000);
        }
    });
}

$(function () {
    // 获取权限
    if (isWeixinBrowser() && window.wx) {
        wx.config({
            // debug: true,
            appId: getCookieByName('appId'),
            timestamp: getCookieByName('timestamp'),
            nonceStr: getCookieByName('nonceStr'),
            signature: getCookieByName('signature'),
            jsApiList: [
                'scanQRCode'
            ]
        });
    } else {
        alert('请使用微信扫描');
    }
    wx.ready(function () {
        var cachePassword;

        //  取参分析
        var params = analyticsParams(document.location.href);
        doCheck(params);


        function verifyCallback(response) {
            if (response.result > 1) {
                $('.tip').text(response.tip);
                switchPage('error');
                return false;
            }
            switchPage('confirm');

            $('.todayCount').text(response.todayNum);
            $('.totalCount').text(response.total);
            $('.orderCreatedNumCount').text(response.orderCreatedNum);
            $('.orderReceivedNumCount').text(response.orderReceivedNum+' 订单');
            $('.rewardCount').text(response.reward);
            return true;
        }

        // 口令核验
        $('.check-button').on('click', function () {
            var password = $('#password').val().trim();
            getGift(params.u, params.m, password, params.os, function (response) {
                if (verifyCallback(response)) {
                    cachePassword = password;
                    $('.next-button').show();
                }
                $('#password').val("");
            });
        });

        // 扫描下一个
        $('.next-button').on('click', function () {
            switchPage('error');
            $('.tip').text('等待扫描二维码...');
            $('.error').find('.gift-circle').show();
            $('.error').find('.status').show();
            doScan(function (_params) {
                $('.tip').text('加载中, 请稍后...');
                getGift(_params.u, _params.m, cachePassword, _params.os, verifyCallback);
                return;
            });
        });
    });

});
