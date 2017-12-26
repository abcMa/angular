/**
 * 国际化配置 - 中文
 */
_.merge(window.APP_LANG, {
    'zh-CN': {
        // 语言名称
        $name: '中文',
        $id: 1,

        // 列表底部占位
        listBottomPlaceholder: {
            tooltip: '已经看到最后了呦~'
        },

        // 福卡钱包相关
        carrefourWallet: {
            closeButton: '商城'
        },

        // 七天无理由退货
        sevenDayRefund: {
            fullPrompt: '不支持7天无理由退货',
            partOne: '购物车中带有',
            partTwo: '标识的为不支持7天无理由退货商品',
            support: '支持7天无理由退货'
        },

        // 各状态的提示信息
        stateTexts: {
            unknownException: '未知异常，请刷新重试。', // 系统出现未知异常时的提示信息
            notLogin: '用户未登录', // 用户未登录时的提示信息
            networkAnomaly: '世界上最遥远的距离就是没网。检查设置', // 网络异常，无法访问到接口服务器时的提示信息
            serviceException: '服务器繁忙，请您稍后再试。', // 当调用接口时，响应异常状态码

            applePayNotSupport: '不支持 Apple Pay', // 不支持 Apple Pay
            applePayFailure: '支付失败', // 使用 Apple Pay 支付失败
            applePayCancel: '支付取消', // 使用 Apple Pay 时取消支付

            messageNotFound: '消息不存在' // 无法根据消息 id 找到对应的消息数据

        },

        inAppBrowser: {
            closeButton: '关闭'
        },

        camera: {
            title: '选择照片',
            cancel: '取消',
            shoot: '拍摄照片',
            uploadByPhoto: '从相册上传',
            openCameraFailure: '无法访问摄像头',
            photoCancelled: '没有获取到图片',
            photoSucceeded: '照片上传成功'
        },

        validator: {
            mobile: '请输入正确的手机号码',
            password: '6-20位字母、数字或者符号组合',
            security: '存在特殊字符，请重新录入',
            idCard: '请输入正确的身份证号'
        },

        title: '家乐福移动端APP',

        overseasShop: '全球购',

        taxAmount: '进口税',

        taxAmountInfo: {
            title: '进口税',
            content: '根据跨境电子商务零售进口税收政策，个人单笔交易限值人民币2000元，个人年度交易限值人民币20000元。',
            content2: '在限值以内进口的跨境电子商务零售进口商品，关税税率暂设为0%；进口环节增值税、消费税按法定应纳税额的70%征收。计算规则如下：',
            content3: '商品税费 = 购买单价 × 件数 × 跨境电商综合税率',
            content4: '跨境电商综合税率 =（消费税率 + 增值税率）/（1 - 消费税率）× 70%',
            content5: '注：运费需缴纳税费。税费为家乐福“全球购”代征代缴，如因个人原因退货，税费将不予返还'
        },

        freightAmountInfo: {
            title: '运费详情',
            content: '订单金额＜39元，首公斤30元，超过1KG部分，按每公斤收取运费10元计算；',
            content2: '39≤订单金额＜129元，每公斤收取10元；',
            content3: '129元≤订单金额＜159元，包邮3KG，超过3KG部分，按每超重1KG收取运费10元计算；',
            content4: '159元≤订单金额＜199元，包邮4KG，超过4KG部分，按每超重1KG收取运费10元计算；',
            content5: '订单金额≥199元，包邮5KG，超过5KG部分，按每超重1KG收取运费10元计算。',
            content6: 'PS.不满1KG按1KG计算。'
        },

        taxRate: '税率',

        nonSupportInvoice: '不支持发票',

        idCard: '身份证号',

        taxTitle: '跨境电商综合税',

        popup: {
            title: '提示',
            ok: '确定',
            updateTitle: '版本更新',
            updateConfirm: '更新',
            notificationTitle: '新消息',
            confirm: '确认',
            cancel: '取消',
            done: '完成',
            check: '查看'
        },

        productTag: {
            1: '生鲜商品配送区域和时间 >> ',
            2: '3小时极速达，配送条件请查看详情 >>',
            3: ''
        },

        // 标点符号
        leftParentheses: "（",
        rightParentheses: "）",
        colon: "：",

        // 通用文本
        etcSuffix: " ...", // 例："戴尔 等"
        priceSuffix: '元', // 例："400 元"

        unselected: '未选择',
        cancel: '取消',
        select: '选择',

        selectExpressageTime: '选择送达时间',

        // 底部标签栏
        tabs: {
            index: '首页',
            category: '分类',
            scan: '扫一扫',
            cart: '购物车',
            me: '我',
            overseasShop: '全球购'
        },

        scan: {
            name: '扫一扫',
            notSupport: '当前环境不支持扫一扫功能',
            parseFailure: '你的相机功能好像有问题哦~去"设置>隐私>相机"开启一下吧',
            none: '没有扫描到有效的二维码或条码',
            noneQRCode: '没有扫描到二维码',
            noneBarCode: '没有扫描到条码',
            invalidQRCode: '该二维码数据无效',
            invalidBarCode: '该条码编号无效'
        },

        // 首页相关配置
        index: {
            title: '家乐福移动端 APP',
            searchText: '搜索您想要的商品',
            recommendProduct: '单品精选',

            market: '精选市场',
            brands: '品牌推荐',

            flashSaleState: {
                0: '距下次活动 ',
                1: '仅剩 ',
                2: '敬请期待'
            },

            flashSaleProductState: {
                0: '敬请期待',
                1: '',
                2: '已抢完',
                3: '已抢完'
            },

            addToCartSuccess: '加入购物车成功',

            everyoneIsBuying: {
                title: '大家都在买什么？',
                subtitle: '为您推荐：)'
            }
        },

        //全球购首页相关配置
        overseasShopIndex: {
            recommendProduct: '单品精选',
            more: '更多',
            addToCart: '加入购物车',
            everyoneIsBuying: {
                title: '大家都在买',
                subtitle: '为您推荐：)'
            }
        },

        // 选择区域
        selectRegion: {
            title: '请选择您的',
            title1: '收货地址',
            title2: '所在区域',
            popupContent: '由于配送点变更，将会清空先前的购物车中商品，是否继续？'
        },

        // 选择收货地址区域
        selectAddressRegion: {
            selectRegion: '点击选择地区',
            regionList: '所在地区',
            cancel: '取消',
            selectText: '请选择'
        },

        // 个人中心 选择收货地址区域
        memberSelectAddressRegion: {
            selectRegion: '点击选择地区',
            regionList: '所在地区',
            cancel: '取消',
            selectText: '请选择'
        },

        // 登录页
        login: {
            title: '登录',
            cancel: '取消',

            loginNameFormItem: {
                label: '账号',
                placeholder: '输入手机号码/邮箱'
            },

            passwordFormItem: {
                label: '密码',
                placeholder: '输入 6 - 20 位密码'
            },

            imageVerifyCodeFormItem: {
                label: '验证码',
                placeholder: '请输入验证码'
            },

            submitButton: '登录',
            toRegister: '手机快速注册',
            toRetrievePassword: '找回密码'
        },

        // 注册
        register: {
            registerMobile: '手机快速注册',
            settingPassword: '设置密码',
            goBack: '返回',
            cancel: '取消',
            confirm: '确认',
            inputMobile: '输入手机号码',
            firstServiceAgreement: '本人确认已仔细阅读了',
            secondServiceAgreement: '<家乐福网上商城服务协议>',
            lastServiceAgreement: '（“协议”），并完全理解了协议的全部内容（特别是以下划线或加粗方式显示的内容）；对于本人向家乐福网上商城（“网上商城”）提出的有关本协议的疑问，网上商城的客服已向本人详细介绍和明确说明，',
            endAgreement: '本人已完全理解，并同意注册',
            next: '下一步',
            agree: '同意',
            inputVerifyCode: '输入验证码',
            inputPassword: '输入 6 - 20 位密码',
            readySendTip: '验证码将发送至',
            sendTip: '验证码已发送至',

            sendCode: '点击发送验证码',
            reSend: '重新获取',
            complete: '完成',
            registerAgreement:  "用户注册协议",
            notFoundAgreement: '没有用户协议',

            popupTitle: "提示",
            bindMemberCard: '会员中心上线了，注册或绑定会员卡，享受更多会员服务和折扣。',
            goRegisterMemberCard: '注册会员卡',
            goBindMemberCard: '去绑卡'
        },

        // 找回密码
        retrievePassword: {
            goBack: '返回',
            sendCode: '点击发送验证码',
            reSend: '重新获取',
            showUp: '显示密码',
            retrievePassword: '找回密码',
            inputLoginName: '输入账户名称',
            inputVerifyCode: '输入验证码',
            inputPassword: '输入 6 - 20 位密码',
            next: '下一步',
            readySendTip: '验证码将发送至',
            sendTip: '验证码已发送至',
            complete: '完成',
            success: '密码修改成功',
            goEmail: '请前往邮箱验证。',
            goLoginPage: '返回登录页面'
        },

        // 会员中心
        user: {
            userCenter: '会员中心',
            login: '登录/注册',
            logout: '退出登录',
            register: '注册会员',
            collectionItems: '收藏商品',
            viewHistroy: '浏览记录',
            myOrder: '我的订单',
            allOrder: '查看全部订单',
            waitingPayment: '待付款',
            receivePackage: '待收货',
            boBeEvaluated: '待评价',
            customerService: '客户服务',
            settings: '设置',
            userCoupon: '我的优惠券',
            userConsignee: '地址管理',
            telePhone: '客服电话',
            toggleLanguageContent: '将语言切换为 English ?',
            nearbyStores: '寻找家乐福',
            carrefourWallet: '福卡钱包',
            changeLanguage: '切换语言',
            service: {
                tips: '请至当地的家乐福大卖场办理退换货手续，请选择距离您最近的家乐福卖场办理。'
            },
            address: {
                road: '路',
                figure: '号/弄',
                estate: '小区',
                buildingNo: '号/幢',
                room: '室'
            },
            info: {
                title: '个人资料',
                pic: '头像',
                nickname: '昵称',
                sex: {
                    title: '性别',
                    sexFemale: '女',
                    sexMale: '男'
                },
                birthday: '出生日期',
                editNickname: {
                    title: '请输入您的用户名',
                    alert: '只能输入 15 个字符'
                },
                editSex: {
                    title: '请选择您的性别',
                    cancel: '取消'
                }
            },
            aboutUs: {
                title: '关于',
                versionTxt: '当前版本 V2.6.0',
                sitTxt: 'Copyright © 家乐福网上商城',
                copyrightTxt: '版权所有'
            },
            cancelOrder: {
                title: '取消订单',
                confirmBtn: '确定',
                tipsTitle: '如果您是使用福卡完成的在线支付，请注意以下事项：',
                tipsTxt1: '您使用福卡支付部分金额将自动退回到原卡内，为保障您的资金安全，请您确认您的福卡仍在身边！',
                tipsTxt2: '若您支付订单的福卡已经遗失，请返回上一页并联系客服为您提供协助。',
                reasonTitle: '请赐个取消原因',
                popupTxt: '请选择取消原因'
            }
        },

        // 优惠券
        userCoupon: {
            title: '优惠券',
            empty: '暂无抵用券',
            date: '有效期至',
            left: '仅剩',
            day: '天',
            disable: '~已失效~',
            cancel: '取消',
            confirm: '确定',
            allFree: '全免',
            codeText: '请输入优惠券兑换码',
            btnText: '兑换',
            enterCode: '兑换码不能为空',
            unUsed: '可使用',
            canNotUsed: '不可使用',
            expired: '已过期',
            used: '已使用',
            useWith: {
                1: '不允许与',
                2: '共同使用'
            },

            types: {
                0: "商品券",
                1: "运费券"
            },
            cancelNote: '请先取消已勾选优惠券再进行选择',
            detailRuler: '详细规则：',
            fullRuler: '满',
            fullUse: '可用'
        },

        // 会员中心-设置
        settings: {
            title: '设置',
            languageTxt: '语言切换',
            toggleLanguageContent: '请选择语言',
            toggleLanguageCancel: '取消',
            versionTxt: '关于',
            appshare: '分享APP给小伙伴',
            logout: '退出登录',
            clearCache: '清除缓存',
            clearSuccess: '清除缓存成功！',
            popupTitle: '确认清除缓存？',
            notes: '意见反馈',
            feedbackOptions: '给家乐福评分',
            successNotes: '反馈成功',
            errorNotes: '操作异常，稍后再试'
        },

        // 意见反馈
        feedbackOptions: {
            title: '意见反馈',
            noteTip: '请留下您的宝贵意见，以帮助我们做得更好。',
            noteType: '问题类型',
            askTip: '请简要描述您的问题(最少5个字)',
            mobile: '联系电话:',
            upImgTip: '支持jpg、gif、png、jpeg，最大3M，最多上传3张；移动数据下会产生较多流量。',
            submit: '提交'
        },

        // 搜索页
        search: {
            searchTip: '搜索您想要的商品',
            cancel: '取消',
            history: '历史搜索',
            emptyHistory: '暂无历史搜索记录',
            clearHistory: '清空历史',
            hotKeywords: '热门搜索'
        },

        //订单状态
        orderStatus: {
            1: '已下单',
            2: '已支付',
            3: '已复核',
            4: '已发货',
            5: '已签收',
            6: '已取消',
            7: '已关闭'
        },

        //订单列表页
        orderList: {
            title: '我的订单',
            totalAmount: '总金额',
            nowPay: '立即支付',
            reBuy: '再次购买',
            cancel: '取消订单',
            empty: '亲，还没有订单呦~',
            addToCartSuccess: '加入购物车成功',
            goToComment: '去评价'
        },

        // 评论页
        userCommentList: {
            title: '填写评价',
            goToComment: '去评价',
            reviewed: '已评价',
            rating: '评分：',
            textareaPlaceholder: '评论不少于10字符，快来分享你的购买心得吧~',
            submitBtn: '发表评价',
            textTips: '评论不能少于10个字符',
            successTip: '评论成功'
        },

        //订单详情页
        orderInfo: {
            title: '订单详情',
            orderStatus: '订单状态',
            orderTotal: '订单总计',
            freight: '含运费',
            orderNumber: '订单编号：',
            myPickUpCode: '查询我的提货码',
            readySendTipFir: '提货码已发送至您的手机，',
            readySendTipSed: 's后可重发',
            gotoPay: '去支付',
            anyTime: '任意时间',
            paymentType: '支付方式',
            payTypeName: {
                online: '在线支付',
                delivery: '货到付款'
            },
            deliveryType: '配送方式',
            deliveryTime: '配送时间',
            invoiceInfo: '发票信息',
            noInvoice: '未开发票',
            productList: '商品清单',
            productAmount: '件商品',
            totalWeight: '总重量',
            goodsAmount: '商品金额',
            discountAmount: '优惠金额',
            couponsDiscount: '优惠券',
            totalFreight: '运费',
            freightServiceFee: '服务费',
            freightDiscount: '运费优惠',
            payableAmount: '应付金额',
            unionpayKnock: '银联立减',
            realPay: '实付金额',
            totalAmount: '订单金额',
            process: {
                submitedOrder: '提交订单',
                payedOrder: '已支付',
                deliveryOrder: '商品出库',
                reciveOrder: '已签收',
                canceledOrder: '已取消',
                closedOrder: '已关闭'
            },
            amountPaid: '已支付'
        },

        // 商品列表
        productList: {
            title: '商品列表',
            order: {
                default: '默认',
                sold: '销量',
                price: '价格',
                reviews: '评论'
            },
            filter: '筛选',
            // offShelve: '商品已下架',
            emptyList: '没有找到商品',
            collectSuccess: '加入购物车成功'
        },

        //商品详情
        productInfo: {
            title: '商品详情',
            totalSalesCount: '总销量',
            promotion: '促销',
            services: '服务',
            buyNumber: '数量',
            prompt: '提示',
            freeDelivery: '全场满129元包邮(<=10KG)',
            overseasShopFreeDelivery: '全场满129元包邮(≤3KG)',
            productContent: '商品介绍',
            productComment: '商品评论',
            commentRate: '好评率',
            seeMoreComment: '查看更多',
            productProperties: '规格参数',
            productAfterSales: '售后服务',
            productRecommend: '商品推荐',
            cart: '购物车',
            addToCart: '加入购物车',
            buyNow: '立即抢购',
            addToCartSuccess: '加入购物车成功',
            search: '搜索',
            index: '首页',
            unavailable: '暂无货品',
            cantCollect: '无法收藏已下架商品',
            limitedSale: {
                name: '抢购',
                price: '抢购价',
                preparing: '距离抢购开始',
                ongoing: '离抢购结束还剩',
                ending_before: '已于',
                ending_after: '结束',
                hour: '时',
                minute: '分',
                second: '秒'
            },
            swipe: '继续拖动，查看图文详情',
            swipeBack: '继续拖动，查看商品信息',
            collect: '收藏',
            collectSuccess: '收藏成功',
            taxInfo: {
                title: '税费详情',
                content: '1.	财政部，海关总署，国家税务总局发布跨境电子商务零售进口税收政策，自2016年4月8日起，跨境电商单次交易限值为人民币2000元，个人年度交易限值为人民币20000元。',
                content2: '2.	跨境电商综合税需按一般贸易增值税及消费税税额的70%征收，家乐福网上商城全球购代征代缴，税费以结算页金额为准。'
            },
            storeTip1: '此商品由',
            storeTip2: '从',
            storeTip3: '发货并提供售后服务'
        },

        // 评价列表
        commentList: {
            commentTitle: '商品评价',
            empty: '还没有人对该商品发表过评价！',
            commentHighList: '好评',
            commentAllList: '全部'
        },

        // 购物车
        cart: {
            title: '购物车',
            empty: '购物车空空如也~',
            editStart: '编辑',
            editEnd: '完成',
            panicBuyMark: '抢购',
            panicBuyTipBefore: '请在',
            panicBuyTipAfter: '内完成支付',
            invalidTip: '该商品已下架或无库存',
            remove: '删除',
            removeConfrimBefore: '您确定要删除这',
            removeConfrimAfter: '件商品吗？',
            removeSingleItem: '您确定要删除这件商品吗？',
            lack: '还差',
            present: '赠品',
            click: '点击',
            pickPresent: '领取赠品',
            addToBuy: '加价购',
            pickAddToBuy: '换购商品',
            footTitle: '您满足的其他促销规则',
            sevenDdayTipBefore: '购物车中带有',
            sevenDdayTipAfter: '标识的为不支持7天无理由退换货商品',
            freeDelivery: '全场满129元包邮(<=10KG)',
            overseasShopFreeDelivery: '全场满129元包邮（≤3KG）',
            payableAmount: '应付：',
            totalAmount: '总价：',
            discountAmount: '优惠：',
            presentLimitBefore: '已领取',
            notSelectedProductYet: '请选择一个商品',
            presentLimitMiddle: '/',
            presentLimitAfter: '件',
            pickPresentLimitAfter: '件',
            confirmSelection: '确定',
            all: '全选',
            checkout: '结算',
            addCollect: '加入收藏',
            tabs: {
                common: '普通商品',
                overseasShop: '全球商品'
            },
            presell: '您的购物车中有预售商品，预售商品需单独勾选并单独提交订单，不可与其他非预售商品同时勾选提交。'
        },

        userViewHistory: {
            title: '浏览记录',
            empty: '暂无记录，赶紧逛起来吧',
            goIndex: '去首页逛逛',
            clear: '清空',
            clearConfirm: '确认要清空浏览历史吗？',
            clearDone: '浏览历史已清空'
        },

        userCollectionList: {
            title: '我的收藏',
            empty: '收藏夹饿扁了',
            goIndex: '去首页逛逛',
            limitedSale: '抢购',
            available: '有货',
            soldOut: '无货',
            unavailable: '下架',
            confirmTxt: '确认取消收藏？',
            deleteTxt: '删除收藏成功',
            addTxt: '加入购物车成功'
        },

        welcome: {
            enter: '进入首页',
            changeLanguage: '切换语言',
            chName: '简体中文',
            enName: 'English'
        },

        viewOrderItemList: {
            title: '商品清单'
        },

        siderBarBrowerList: {
            title: '浏览记录'
        },

        // 结算中心
        checkout: {
            confirmOrder: '核对订单信息',
            addConsignee: '新增收货地址',
            deliveryMode: '配送方式',
            express: '快递',
            invoiceInfo: '发票信息',
            noInvoice: '不需要发票',
            couponInfo: '优惠券',
            noCoupon: '请选择',
            noAvailableCoupon: '无可用',
            payDelivery: '支付及配送',
            needpayDelivery: '请选择',
            productList: '商品清单',
            present: '赠品',
            gift: '礼品',
            changeGoods: '加价购',
            showMoreItem: '查看全部商品',
            hideMoreItem: '收起商品展示',
            totalAmount: '订单金额',
            goodsAmount: '商品金额',
            discountAmount: '优惠金额',
            totalFreight: '运费',
            payableAmount: '应付金额',
            choosePaymodeType: '请选择支付方式',
            wechatPay: '微信支付',
            codPay: '货到付款',
            submit: '提交订单',
            total: '共',
            unit: '件',
            unites: '件',
            freight: '运费',
            freightServiceFee: '服务费',
            freightDiscount: '运费优惠',
            couponsDiscount: '优惠劵抵扣',
            needPayment: '请选择支付方式',
            needDelivery: '请选择配送方式',
            needConsignee: '请配置收货地址',
            deliveryTime: '配送时间',
            notePickUpMessage: '自提须知：为保证商品质量，请于商品入柜后24小时内完成自提（生鲜或冷冻冷藏类商品自提时间为入柜4小时内），超时我们将做滞留件处理，最多保留72小时（生鲜或冷冻冷藏类商品最长保留时间为48小时）。逾期将做退货处理并收取物流服务费10元',
            notSupportExpressageDelivery: '您的购物车中包含生鲜类商品，超出我们的配送区域，请返回购物车重新修改您的商品哦！',

            //准时达 普通不可用提示
            deliveryUnusedOne0: '很抱歉，准时达配送服务暂不可选。',
            deliveryUnusedTwo0: '可能是由于您的收货地址填写不全，您的收货地址与购物时所选区域不一致，或您的购物车内包含不支持配送的商品。',
            deliveryUnusedThree0: '请返回检查您的所有设置和购物车内商品，或咨询客服400 980 8800。',

            //准时达 生鲜不可用提示
            deliveryUnusedOne1: '很抱歉，生鲜配送服务暂不可选。',
            deliveryUnusedTwo1: '可能是由于您的收货地址填写不全，或您所在区域不支持生鲜商品配送。',
            deliveryUnusedThree1: '请返回检查您的所有设置和购物车内商品，或咨询客服400 980 8800。',

            presell: {
                payment: '支付方式:在线支付'
            },

            //编辑身份证信息
            editIdCard: {
                title: '填写身份证信息',
                save: '保存',
                tip: '* 由于海关清关需要，收货人请使用与支付人一致的真实的姓名、身份证号 ',
                tip2: '* 家乐福“全球购”商品仅支持中国身份证持有者支付 ',
                tip3: '温馨提示：为保障顺利清关，收货地址使用的收货人姓名、身份证号与付款人真实信息保持一致。',
                tip4: '因海关清关需要，请填写支付人的身份证号码',
                tip5: '因全球购商品涉及入境清关，根据海关规定，需要您完善当前收货人身份证信息。若信息不正确、不真实，会导致订单清关失败，无法发货。家乐福全球购承诺严格保密您的个人信息。',
                tip6: '我知道了'
            },

            // 收货地址
            consignee: {
                chooseConsigneeInfo: '选择地址',
                add: '新建收货地址',
                edit: '编辑',
                remove: '删除',
                tip: '地址为空，快去新增一个吧~',
                addConsignee: '新建收货地址',
                removeTip: '你确定要删除该收货地址吗？',
                unavailable: '无法配送至此地址',
                manageConsignee: '设置',
                limits: '最多存储30个地址，请至地址管理界面删除不使用地址',
                effect: '该地址需要更新',
                consigneeInfo: {
                    cancel: '取消',
                    edit: '编辑收货人地址',
                    add: '新增收货人地址',
                    consigneeName: '收货人',
                    consigneeRegion: '收货地区',
                    consigneeAddress: '详细地址',
                    road: '路',
                    lane: '号/弄',
                    village: '小区',
                    buildingNumber: '号/幢',
                    roomNumber: '室',
                    mobile: '联系方式',
                    save: '保存并使用'
                }
            },

            // 发票信息
            invoice: {
                setInvoiceInfo: '设置发票信息',
                submit: '确定',
                chooseInvoice: '选择发票',
                noInvoice: '不需要发票',
                needInvoice: '商业零售发票',
                invoiceTitle: '发票抬头',
                invoiceType: {
                    person: '个人',
                    company: '公司'
                },

                placeholder: {
                    all: '请填写个人或公司名称',
                    person: '个人',
                    company: '请填入公司抬头',
                    taxpayerCode: '请填写纳税人识别号或统一社会信用代码',
                },

                invoiceCategory: '发票类别',
                invoiceArticle: '增值税发票开具说明',
                invoiceArticle1: '纳税人识别号填写说明',
                taxpayerCodeArticle: '填写说明',
                invoiceUseDesc: '用户使用家乐福福卡支付部分金额不再开具发票',
                invoiceTips: '请选择发票类别',
                needTitle: '请输入发票抬头',
                needTaxpayCode: '请输入正确的纳税人识别号或正确的统一社会信用代码',
                info: {
                    title: '发票信息',
                    content: '顾客购买家乐福“全球购”商品，属于向境外商家购买商品的行为，故无法向顾客开具中国法律规定的发票。'
                }
            },

            // 选择支付方式
            selectPayDelivery: {
                title: '选择支付配送方式',
                payMode: '支付方式',
                deliveryMode: '配送方式',
                confirm: '确定',
                pickup: '自提点',
                pickupTime: '自提时间',
                pleaseSelected: '请选择自提时间',
                express: '当日达说明',
                expressInfo: '3小时极速达，配送条件请查看详情 >>',
                expressDelivery: '3小时极速达，帮帮兔 提供配送服务，本服务配送条件请查看详情 >>',
                expressageInform: '温馨提示：为保证您的送达时间，在线支付的订单请在下单后半小时内完成支付。若未能及时支付，您的订单有可能会有延误现象。',
                reselectForConsigneeChange: '收货地址变化，请重选支付及配送方式',
                info: {
                    title: '快递',
                    content: '海关审核通过后3个工作日左右发货'
                }
            },

            // 提交成功页
            submitSuccess: {
                success: '订单提交成功',
                codPay: '货到付款：',
                orderTip: '订单号：',
                money: '元',
                tips: '您提交的订单将成为订购商品的要约，当我们再次向您发出电子邮件或短信确认商品已发出或我们已将商品发送至您指定地址时，方视为我们与您之间的订购合同成立。',
                seeOrderDetail: '查看订单详情'

            },

            // 支付成功页
            paySuccess: {
                success: '订单支付成功',
                title: '感谢您，订单支付成功！',
                orderTip: '订单号：',
                payedTip: '已付款：',
                money: '元',
                orderAward: '订单奖励：',
                orderRewardPoints: '积分',
                alertPointsTip:'订单签收7日后, 会员积分自动同步到家乐福会员卡',
                tips: '您提交的订单将成为订购商品的要约，当我们再次向您发出电子邮件或短信确认商品已发出或我们已将商品发送至您指定地址时，方视为我们与您之间的订购合同成立。',
                seeOrderDetail: '查看订单详情',
                applePayDiscountAmount: '云闪付立减优惠',
                messageTip: '小提示：如需要跟踪订单进度，请下载',
                messageTip1: '家乐福网上商城app',
                messageTip2: '，在[我的订单]中查询或关注',
                messageTip3: '“家乐福网上商城”',
                messageTip4:'公众号，点击[我的全球购订单]查询。祝您购物愉快！'
            },

            // 支付中心
            onlinePayment: {
                title: '支付中心',
                price: '应付金额:',
                currencyUnit: '元',
                paymentType: '请选择支付方式',
                remainingText: '已支付',
                remainingTextTitle: '剩余金额',
                warnText: '* 家乐福“全球购”商品仅支持中国身份证持有者支付',
                morePayment: '更多支付方式'
            },

            // 商品清单中商品标签
            itemList: {
                normal: '普通商品',
                gift: '赠品',
                limit: '抢购',
                buy: '加价购'
            },

            //当日达提示
            dayDelivery: {
                warnText: '*目前当日达服务仅开通家乐福网上商城上海站',
                firstWarn: '1.  订单满足以下条件即可享当日达配送服务：',
                subfirst1: '（1） 当日7:00-17:00间提交订单并成功支付；',
                subfirst2: '（2） 单笔订单购买商品不多于10件且不高于10公斤；',
                subfirst3: '（3） 单笔订单需支付10元运费；',
                subfirst4: '（4） 目前仅支持上海部分区域配送（',
                linkText: '配送区域>>',
                endLink: '）；',
                subfirst5: '（5） 仅限在线支付。',
                secondWarn: '2. 配送时段',
                subSecond1: '（1） 7:00-11:00下单并成功支付的订单，当日15:00前完成配送；',
                subSecond2: '（2）11:00-14:00下单并成功支付的订单，当日18:00前完成配送；',
                subSecond3: '（3）14:00-17:00下单并成功支付的订单，当日21:00前完成配送。',
                warnText2: '*为了保证您的配送时效，请在下单完成后5分钟内完成支付；',
                warnText3: '*订单不满足上述条件或超出配送范围的，您可选择其他配送方式。'
            },

            // 结算提示
            rulesPrompt: {
                line1: '1）本人确认已阅读并完全理解',
                line2: '《家乐福网上商城服务协议》',
                line3: '，特别是第三条第一项关于商品订购的约定。',
                line4: '2）本人确认同意带有',
                line5: '的商品不宜退货，不适用七日无理由退货规定。'
            }
        },

        productFilter: {
            title: '筛选',
            confirm: '确认',
            all: '全部',
            clear: '清除筛选条件',
            categories: '分类',
            brands: '品牌',
            priceRanges: '价格'
        },

        datePicker: {
            doneButtonLabel: '确认',
            cancelButtonLabel: '取消',
            titleText: '选择日期',
            cancelText: '取消',
            todayText: '今天',
            nowText: '现在',
            okText: '确认',
            error: '请选择日期'
        },
        pay: {
            openApplication: '正在打开支付应用···',
            paySuccess: '支付成功',
            payError: '支付失败',
            payCancel: '支付取消',
            missWechat: '您还没有安装微信客户端哦~',
            missAlipay: '您还没有安装支付宝客户端哦~'
        },

        //会员中心 地址管理
        consignee: {
            edit: '编辑',
            remove: '删除',
            add: '新建收货地址',
            tip: '地址为空，快去新增一个吧~',
            addConsignee: '新增收货地址',
            defaultAddText: '默认地址',
            removeTip: '你确定要删除该收货地址吗？',
            defaultTip: '你确定要设置这个为默认地址吗？',
            changeSuc: '修改成功',
            title: '地址管理',
            effect: '该地址需要更新'
        },

        //福卡支付
        carrefourCardInstruction: {
            contentOne: '若您的福卡卡片背面含有电子支付密码，才可以进行在线支付。请刮开电子支付密码进行支付。不含有电子支付密码的福卡，暂时无法支持在线支付，感谢您的支持谅解！',
            contentTwo: '为了您的支付安全，使用福卡支付订单后请保留您的福卡至少48小时。',
            next: '下一步'
        },

        //热部署
        deployTips: {
            title: '版本更新',
            notice: '更新提示',
            netTypeTips: '发现新版本，更新大小约300 KB，是否更新？',
            netTypeTips3G: '发现新版本，更新大小约300 KB。您当前处于移动网络，是否更新？',
            downloading: '下载中…',
            downloadError: '当前网络不稳定，请稍后再试。',
            extracting: '正在安装…',
            extractError: '安装失败，请重试。',
            complete: '安装完成，请重启APP。',
            reboot: '重启',
            ok: '更新',
            cancel: '取消',
            close: '关闭'
        },

        nearbyStores: {
            title: '身边门店',
            empty: '未定位到附近的门店',
            gpsUnavailable: '世界上更远的距离是GPS失联',
            notice: '温馨提示',
            noticeContent: '请开启定位服务，以查看离你最近的门店',
            noticeSetting: '去设置',
            noticeCancel: '知道了',
            address: '门店地址',
            order: {
                mall: '大卖场',
                store: 'Easy便利店'
            }
        },

        storeInfo: {
            title: '门店信息',
            navigatorError: '没有找到导航工具',
            chooseNavigator: '请选择导航方式',
            cancel: '取消',
            navigate: '导航',
            shuttleBus: '班车信息',
            service: '卖场服务',
            businessTime: '营业时间',
            bus: '公交路线',
            subway: '地铁路线',
            parking: '停车咨询',
            mapUnavailable: '无法加载地图，请稍后再试'
        },

        unionPayActivity: {
            act1: "满129减15",
            act2: "整单62折,最高减50"
        },

        //消息中心
        messageCenter: {
            title: "消息中心",
            activityMsg: {
                title: "活动消息",
                emptyTips: "无活动消息"
            },
            systemMsg: {
                title: "系统通知",
                emptyTips: "无通知消息",
                viewDetails: "查看详情"
            }
        },

        //消息分类
        messageList: {
            title: "活动消息",
            emptyTips: "暂时没有新消息哦～"
        },

        activityClosedAlert: {
            title: "很抱歉！",
            tagline: "您查看的活动已经过期",
            button: "继续逛逛"
        },

        // 分享
        share: {
            wechat: '微信',
            moments: '朋友圈',
            qq: 'QQ',
            qzone: 'QQ空间',
            weibo: '微博',
            shareto: '分享至',
            wxShop: '家乐福微信商城'
        },

        // 活动页不存在时
        activity: {
            warnText: '当前分站没有参与此次活动',
            btnText: '返回首页'
        },

        // 会员中心
        memberCenter: {
            title: "会员中心",
            cardName: "家乐福会员卡",
            info: "会员信息",
            cardDescription: "请将以上会员码出示收银员，即可享受该卡优惠",
            point: "当前积分",
            freezedPoint: "冻结积分",
            expireDate: "您在{{date}}将有{{point}}积分过期",
            register: "会员卡注册",
            bindCard: "绑定会员卡",
            unbindCard: "解绑会员卡",
            unbindAlert: "确定解绑当前会员卡吗？积分将会留在解绑会员卡中",
            registerAgreementTitle: "家乐福会员使用协议"
        },

        // 会员中心表单字段
        memberCenterFormFields : {
            nationality: "国家地区",
            idType: "证件类型",
            idTypes: {
                "0": "身份证",
                "1": "军官证",
                "2": "护照"
            },
            idNumber: "证件号码",
            idNumberPlaceholder: "请输入证件号码",
            mobile: "手机号码",
            mobilePlaceholder: "请输入手机号",
            verifyCode: "验证码",
            verifyCodePlaceholder: "请输入验证码",
            getVerifyCode: "获取验证码",
            resend: "重新发送",
            sex: "性别",
            selectSex: "请选择",
            male: "男",
            female: "女",
            name: "姓名",
            namePlaceholder: "请输入您的姓名",
            birthday: "出生日期",
            email: "邮箱地址",
            emailPlaceholder: "请输入邮箱地址",
            regions: "所在地区",
            regionsPlaceholder: "请选择所在地区",
            address: "详细地址",
            addressPlaceholder: "请输入详细地址",
            cardMember: "会员卡号",
            memberCardPlaceholder: "请输入要绑定的会员卡号",
            errorIdNumber1: '证件号不能为空',
            errorIdNumber2: '身份证格式错误',
            errorCardNumber1: '会员卡号不能为空',
            errorCardNumber2: '会员卡号必须为15位数字',
            errorVerifyCode: '请输入6位数字验证码',
            errorMobile: '手机号位数必须为11位'
        },

        // 注册会员卡
        registerMemberCard: {
            title: "会员卡注册",
            note: "证件号码、手机号码、会员卡号最少填写两项",
            agrees: "我已阅读并同意",
            serviceAgreement: "<家乐福会员使用协议>",
            next: "下一步",
            done: "完成",
            success: "注册成功"
        },

        // 解绑会员卡
        unbindMemberCard: {
            title: '解绑会员卡',
            confirmBtn: '确定',
            success: '解绑成功',
            error: '解绑失败'
        },

        // 会员信息
        memberInfo: {
            title: '会员信息',
            save: "保存",
            success: '修改成功',
            error: "修改失败"
        },

        // 更换会员卡手机号
        editMemberCardMoblie: {
            title: '修改手机',
            confirmBtn: '完成'
        },

        // 绑定会员卡
        bindMemberCard: {
            title: "绑定会员卡",
            agrees: "我已阅读并同意",
            serviceAgreement: "<家乐福会员使用协议>",
            next: "同意",
            success: "绑定成功",
            bindMemberCardPopup: {
                title: '提示',
                template: '您填写的信息不正确，请重新输入信息或者注册新会员卡',
                okText: '重新输入',
                cancelText: '注册会员卡'
            }
        },

        // 冻结积分规则
        freezedRuler: {
            title: "冻结积分规则",
            content: "线上订单支付成功奖励的积分在订单签收七日后，将自动转化为会员积分。"
        },

        // 过期积分说明
        expireRuler: {
            title: "过期积分说明",
            content: "当年消费所累积的积分有效期截止至次年的12月31日，有效期届满的积分将作废。"
        },

        // 注册后弹框
        memberCardPopup: {
            title: "提示",
            content: '会员中心上线了，注册或绑定会员卡，享受更多会员服务和折扣。',
            goRegisterMemberCard: '注册会员卡',
            goBindMemberCard: '去绑卡',
            cancel: '取消',
        }
    }
});
