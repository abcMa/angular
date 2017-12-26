/**
 * 定义弹出层
 */
angular.module('app').constant('modals', {
    // 广告欢迎页
    welcome: {
        path: 'templates/modals/welcome.html',
        controller: 'welcomeCtrl',
        controllerAs: 'welcome',
        animation: 'slide-in-up',
        title: '广告欢迎页'
    },

    // 登录
    login: {
        path: 'templates/modals/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login',
        animation: 'slide-in-up',
        title: '登录'
    },

    // 注册
    register: {
        path: 'templates/modals/register.html',
        controller: 'registerCtrl',
        controllerAs: 'register',
        animation: 'slide-in-up',
        title: '注册'
    },

    // 找回密码
    retrievePassword: {
        path: 'templates/modals/retrievePassword.html',
        controller: 'retrievePasswordCtrl',
        controllerAs: 'retrievePassword',
        animation: 'slide-in-up',
        title: '找回密码'
    },

    // 用户注册协议
    registerAgreement: {
        path: 'templates/modals/registerAgreement.html',
        title: '用户注册协议'
    },

    // 选择提货人信息
    selectConsignee: {
        path: 'templates/modals/consigneeList.html',
        controller: 'consigneeListCtrl',
        controllerAs: 'consigneeList',
        title: '选择提货人信息'
    },

    // 会员中心 编辑提货人信息
    memberSelectConsignee: {
        path: 'templates/modals/memberConsigneeList.html',
        controller: 'memberConsigneeListCtrl',
        controllerAs: 'memberConsigneeList',
        title: '编辑提货人信息'
    },

    // 编辑提货人信息
    editConsigneeInfo: {
        path: 'templates/modals/consigneeEdit.html',
        controller: 'editConsigneeInfoCtrl',
        controllerAs: 'editConsigneeInfo',
        title: '编辑提货人信息'
    },

    // 个人中心 编辑提货人信息
    memberEditConsigneeInfo: {
        path: 'templates/modals/memberConsigneeEdit.html',
        controller: 'memberEditConsigneeInfoCtrl',
        controllerAs: 'memberEditConsigneeInfo',
        title: '编辑提货人信息'
    },

    // 选择收货地区
    selectAddressRegion: {
        path: 'templates/modals/selectAddressRegion.html',
        controller: 'selectAddressRegionCtrl',
        controllerAs: 'selectAddressRegion',
        animation: 'slide-in-up',
        title: '选择收货地区'
    },

    // 切换分站选择地区
    selectRegion: {
        path: 'templates/modals/selectRegion.html',
        controller: 'selectRegionCtrl',
        controllerAs: 'selectRegion',
        animation: 'slide-in-up',
        title: '切换分站选择地区'
    },

    // 商品筛选弹出层
    productFilter: {
        path: 'templates/modals/productFilter.html',
        controller: 'productFilterCtrl',
        controllerAs: 'productFilter',
        animation: 'slide-in-right',
        title: '商品筛选'
    },

    // 选择发票
    invoice: {
        path: 'templates/modals/invoice.html',
        controller: 'invoiceCtrl',
        controllerAs: 'invoice',
        animation: 'slide-in-right',
        title: '选择发票'
    },

    // 选择优惠券
    selectCoupons: {
        path: 'templates/modals/selectCoupons.html',
        controller: 'selectCouponsCtrl',
        controllerAs: 'selectCoupons',
        animation: 'slide-in-right',
        title: '选择优惠券'
    },

    // 结算中心-商品清单
    viewOrderItemList: {
        path: 'templates/modals/viewOrderItemList.html',
        controller: 'viewOrderItemListCtrl',
        controllerAs: 'viewOrderItemList',
        animation: 'slide-in-right',
        title: '商品清单'
    },

    // 结算中心-支付和配送方式
    selectPayDelivery: {
        path: 'templates/modals/selectPayDelivery.html',
        controller: 'selectPayDeliveryCtrl',
        controllerAs: 'selectPayDelivery',
        animation: 'slide-in-right',
        title: '支付和配送方式'
    },

    // 结算中心-身份证号
    editIdCard: {
        path: 'templates/modals/editIdCard.html',
        controller: 'editIdCardCtrl',
        controllerAs: 'editIdCard',
        animation: 'slide-in-right',
        title: '编辑身份证信息'
    },

    // 结算中心-确认订单
    confirmOrder: {
        path: 'templates/modals/confirmOrder.html',
        controller: 'confirmOrderCtrl',
        controllerAs: 'confirmOrder',
        animation: 'slide-in-up',
        title: '确认订单'
    },

    // 选择赠品或加价购商品
    selectPresents: {
        path: 'templates/modals/selectPresents.html',
        controller: 'selectPresentsCtrl',
        controllerAs: 'selectPresents',
        animation: 'slide-in-up',
        title: '选择赠品或加价购商品'
    },

    // 结算中心--选择自提点
    // selectPickUpAddress: {
    //     path: 'templates/modals/selectPickUpAddress.html',
    //     animation: 'slide-in-up'
    // },

    // 结算中心--增值税发票开具说明
    invoiceInstruction: {
        path: 'templates/modals/invoiceInstruction.html',
        animation: 'slide-in-up',
        title: '增值税发票开具说明'
    },

    // 提交订单成功
    submitOrderSuccess: {
        path: 'templates/modals/submitOrderSuccess.html',
        controller: 'submitOrderSuccessCtrl',
        controllerAs: 'submitOrderSuccess',
        animation: 'slide-in-up',
        title: '提交订单成功'
    },

    // 支付成功页面
    paymentOrderSuccess: {
        path: 'templates/modals/paymentOrderSuccess.html',
        controller: 'paymentOrderSuccessCtrl',
        controllerAs: 'paymentOrderSuccess',
        title: '支付成功'
    },

    // 详情页 浏览记录侧栏
    siderBarBrowerList: {
        path: 'templates/modals/siderBarBrowerList.html',
        controller: 'siderBarBrowerListCtrl',
        controllerAs: 'siderBarBrowerList',
        animation: 'slide-in-right',
        title: '浏览记录侧栏'
    },

    // 详情页 更多按钮
    productInfoMoreBtns: {
        path: 'templates/modals/productInfoMoreBtns.html',
        controller: 'productInfoMoreBtnsCtrl',
        controllerAs: 'productInfoMoreBtns',
        animation: "none",
        title: '更多'
    },

    // 取消订单原因弹出层
    cancelOrder: {
        path: 'templates/modals/cancelOrder.html',
        controller: 'cancelOrderCtrl',
        controllerAs: 'cancelOrder',
        animation: 'slide-in-up',
        title: '取消订单'
    },

    // 详情页 评论列表
    conmmentList: {
        path: 'templates/modals/commentList.html',
        controller: 'commentListCtrl',
        controllerAs: 'commentList',
        animation: 'slide-in-up',
        title: '评论列表'
    },

    // 订单页 订单评价列表
    orderCommentList: {
        path: 'templates/modals/orderCommentList.html',
        controller: 'orderCommentListCtrl',
        controllerAs: 'orderCommentList',
        animation: 'slide-in-right',
        title: '订单评价列表'
    },

    // 订单页 订单商品填写评价
    orderCommentInfo: {
        path: 'templates/modals/orderCommentInfo.html',
        controller: 'orderCommentInfoCtrl',
        controllerAs: 'orderCommentInfo',
        animation: 'slide-in-right',
        title: '订单商品填写评价'
    },

    // 在线支付 支付方式页
    onlinePayment: {
        path: 'templates/modals/onlinePayment.html',
        controller: 'onlinePaymentCtrl',
        controllerAs: 'onlinePayment',
        animation: 'slide-in-right',
        title: '在线支付'
    },

    // 列表选择器，支持级联选择
    selecter: {
        path: 'templates/modals/selecter.html',
        controller: 'selecterCtrl',
        controllerAs: 'selecter',
        animation: 'slide-in-right',
        title: '列表选择器'
    },

    //福卡支付弹层
    carrefourCardInstruction: {
        path: 'templates/modals/carrefourCardInstruction.html',
        controller: 'carrefourCardInstructionCtrl',
        controllerAs: 'carrefourCardInstruction',
        animation: 'slide-in-up',
        title: '福卡支付弹层'
    },

    // 文章页
    'article': {
        path: 'templates/modals/article.html',
        controller: 'articleCtrl',
        controllerAs: 'article',
        animation: 'slide-in-right',
        title: '文章页'
    },

    // 提示信息弹层
    'promptInfo': {
        path: 'templates/modals/promptInfo.html',
        controller: 'promptInfoCtrl',
        controllerAs: 'promptInfo',
        animation: 'slide-in-up'
    },

    // 店铺地图
    'storeMap': {
        path: 'templates/modals/storeMap.html',
        controller: 'storeMapCtrl',
        controllerAs: 'storeMap',
        animation: 'slide-in-right'
    },

    // 活动关闭提示
    "activityClosedAlert": {
        path: 'templates/modals/activityClosedAlert.html',
        animation: 'slide-in-up'
    },

    //关闭原因
    rejectReason: {
        path: 'templates/modals/rejectReason.html',
        controller: 'rejectReasonCtrl',
        controllerAs: 'rejectReason',
        animation: 'slide-in-down',
        title: '关闭原因'
    },

    //关闭原因
    popUpModals: {
        path: 'templates/modals/popUpModals.html',
        controller: 'popUpModalsCtrl',
        controllerAs: 'popUpModals'
    },

    // 文章弹层
    articlePrompt: {
        path: 'templates/modals/articlePrompt.html',
        controller: 'articlePromptCtrl',
        controllerAs: 'articlePrompt',
        animation: 'slide-in-up'
    },

    //支付宝其他浏览器打开弹出层
    onlinePaymentCorverPage: {
        path: 'templates/modals/onlinePaymentCorverPage.html',
        controller: 'onlinePaymentCorverPageCtrl',
        controllerAs: 'onlinePaymentCorverPage'
    },

    // 分享方式弹出层
    share: {
        path: 'templates/modals/share.html',
        controller: 'shareCtrl',
        controllerAs: 'share',
        animation: 'slide-in-up'
    },

    // 注册会员卡
    registerMemberCard: {
        path: 'templates/modals/registerMemberCard.html',
        controller: 'registerMemberCardCtrl',
        controllerAs: 'registerMemberCard',
        animation: 'slide-in-right'
    },

    // 修改会员卡电话
    editMemberCardMoblie: {
        path: 'templates/modals/editMemberCardMoblie.html',
        controller: 'editMemberCardMoblieCtrl',
        controllerAs: 'editMemberCardMoblie',
        animation: 'slide-in-right'
    },

    // 注册后会员卡弹窗
    memberCardPopup: {
        path: 'templates/modals/memberCardPopup.html',
        controller: 'memberCardPopupCtrl',
        controllerAs: 'memberCardPopup',
        animation: 'slide-in-up'
    }
});
