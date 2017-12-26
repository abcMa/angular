/**
 * 国际化配置 - 英文
 */
_.merge(window.APP_LANG, {
    en: {
        // 语言名称
        $name: 'English',
        $id: 2,

        // 列表底部占位
        listBottomPlaceholder: {
            tooltip: 'Already pulled to the end~'
        },

        // 福卡钱包相关
        carrefourWallet: {
            closeButton: 'Mall'
        },

        // 七天无理由退货
        sevenDayRefund: {
            fullPrompt: 'Does not accept returns in 7 days without proper reasons',
            partOne: 'THIS TRANSLATION PART DOES NOT USED',
            partTwo: 'THIS TRANSLATION PART DOES NOT USED',
            support: 'Supports returns in 7 days without proper reasons'
        },

        // 各状态的提示信息
        stateTexts: {
            unknownException: 'Unknown exception', // 系统出现未知异常时的提示信息
            notLogin: 'Please login', // 用户未登录时的提示信息
            networkAnomaly: 'Network not connected, please check', // 网络异常，无法访问到接口服务器时的提示信息
            serviceException: 'Service unavaliable', // 当调用接口时，响应异常状态码

            applePayNotSupport: 'Apple Pay Unsupported', // 不支持 Apple Pay
            applePayFailure: 'Payment failed', // 使用 Apple Pay 支付失败
            applePayCancel: 'Payment canceled', // 使用 Apple Pay 时取消支付

            messageNotFound: 'Message Not Found' // 无法根据消息 id 找到对应的消息数据

        },

        inAppBrowser: {
            closeButton: 'Close'
        },

        camera: {
            title: 'Select picture',
            cancel: 'Cancel',
            shoot: 'Take a new picture',
            uploadByPhoto: 'Upload from PhotoLibrary',
            openCameraFailure: 'Camera not available',
            photoCancelled: 'Selection cancelled',
            photoSucceeded: 'Upload success'
        },

        validator: {
            mobile: 'Please enter valid Mobile Phone Number',
            password: 'Password should be between 6 and 20 letters, numbers or combination of these characters',
            security: 'You entered forbidden characters, please enter again',
            idCard: 'Please enter correct identification number'
        },

        title: 'Carrefour.cn',

        overseasShop: 'Global',

        taxAmount: 'Import Tax',

        taxAmountInfo: {
            title: 'Import Tax',
            content: 'According to the Import Taxation Policies on Cross-border E-commerce Retailing, the transaction amount of imported goods through cross-border E-commerce shall be limited to RMB 2,000 for each single transaction, and RMB 20,000 for annual transactions of an individual.',
            content2: 'The tariff for any commodities imported through cross-border e-commerce within the foregoing transaction limits is fixed at 0% temporarily; and the import VAT and consumption tax shall be levied at 70% of the statutory tax amount payable. The formulas are as follows:',
            content3: 'Commodity Tax = Unit Price*Quantity* Tax rate of cross-border',
            content4: 'Tax rate of cross-border = (Consumption tax + VAT) / (1-Consumption tax)*70%',
            content5: 'PS. Freight fees should also be taxed. Carrefour “Global Buy” is responsible for withholding such taxes. Once customers need to return for personal reasons, the taxes will not be refunded.'
        },

        freightAmountInfo: {
            title: 'Details of Freight Fees',
            content: 'Order Amount＜¥39, the first 1KG for ¥30, for the overweight part ¥10 per KG is charged;',
            content2: '¥39≤Order Amount＜¥129, ¥10 per KG is charged;',
            content3: '¥129≤Order Amount＜¥159, the first 3KG for free, for the overweight part ¥10 per KG is charged;',
            content4: '¥159≤Order Amount＜¥199, the first 4KG for free, for the overweight part ¥10 per KG is charged;',
            content5: 'Order Amount≥¥199, the first 5KG for free, for the overweight part ¥10 per KG is charged;',
            content6: 'PS. Less than 1KG will be regarded and calculated as 1KG.'
        },

        taxRate: 'Tax rate of cross-border e-commerce',

        nonSupportInvoice: 'Invoice not supported',

        idCard: 'ID Number',

        taxTitle: 'Tax rate of cross-border',

        popup: {
            title: 'Reminder',
            ok: 'Ok',
            updateTitle: 'There is a newer version',
            updateConfirm: 'update',
            notificationTitle: 'new message',
            confirm: 'Confirm',
            cancel: 'Cancel',
            done: 'Done',
            check: 'Check'
        },

        productTag: {
            1: 'Delivery time & territory for fresh >>',
            2: 'Express delivery within 3 hours. For more details >>',
            3: ''
        },

        // 标点符号
        leftParentheses: '(',
        rightParentheses: ')',
        colon: ':',

        // 通用文本
        etcSuffix: ', etc', // 例："Dell, etc"
        priceSuffix: 'yuan', // 例："400 yuan"

        unselected: 'unselected',
        cancel: 'Cancel',
        select: 'Select',

        selectExpressageTime: 'Select delivery time',

        // 底部标签栏
        tabs: {
            index: 'Home',
            category: 'Category',
            scan: 'Scan',
            cart: 'Cart',
            me: 'Me',
            overseasShop: 'Global'
        },

        scan: {
            name: 'Scan',
            notSupport: 'Barcode Scanning is not supported under current circumstances',
            parseFailure: 'There is a problem with your Camera.Go"Settings-Privacy-Camera"to set it on.',
            none: 'No effective QR code or Barcode is scanned ',
            noneQRCode: 'No effective QR code is scanned ',
            noneBarCode: 'No effective QR Barcode is scanned ',
            invalidQRCode: 'Data of this QR Code is ineffective',
            invalidBarCode: 'Data of this Barcode is ineffective'
        },

        // 首页
        index: {
            title: 'Carrefour mobile APP',
            searchText: 'Search',
            recommendProduct: 'Top Selected',

            market: 'Selection',
            brands: 'Recommendation',

            flashSaleState: {
                0: 'Deal starts in ',
                1: 'Deal ends in ',
                2: 'Comming soon'
            },

            flashSaleProductState: {
                0: 'Comming soon',
                1: '',
                2: 'Sold out',
                3: 'Sold out'
            },

            addToCartSuccess: 'Successfully added',

            everyoneIsBuying: {
                title: 'What do others buy?',
                subtitle: 'Recommendations'
            }
        },

        //全球购首页相关配置
        overseasShopIndex: {
            recommendProduct: 'Top Selected',
            more: 'more',
            addToCart: 'Add to cart',
            everyoneIsBuying: {
                title: 'What do others buy',
                subtitle: 'Recommendations'
            }
        },

        // 选择区域
        selectRegion: {
            title: 'Please select your district',
            title1: '',
            title2: '',
            popupContent: 'We’ll have to empty your shopping cart because of the change of delivery center, will you continue?'
        },

        // 选择收货地址区域
        selectAddressRegion: {
            selectRegion: 'Select region',
            regionList: 'Local area',
            cancel: 'Cancel',
            selectText: 'Select'
        },

        // 个人中心 选择收货地址区域
        memberSelectAddressRegion: {
            selectRegion: 'Select region',
            regionList: 'Local area',
            cancel: 'Cancel',
            selectText: 'Select'
        },

        // 登录页
        login: {
            title: 'Sign in',
            cancel: 'Cancel',

            loginNameFormItem: {
                label: 'Account',
                placeholder: 'Enter your phone number/Email'
            },

            passwordFormItem: {
                label: 'Password',
                placeholder: '6 to 20 digits'
            },

            imageVerifyCodeFormItem: {
                label: 'Verification code',
                placeholder: 'Enter verification code'
            },

            submitButton: 'Sign in',
            toRegister: 'Quick Registration',
            toRetrievePassword: 'Forgot password'
        },

        // 注册
        register: {
            registerMobile: 'Quick Registration',
            settingPassword: 'Set Password',
            goBack: 'Back',
            cancel: 'Cancel',
            confirm: 'Confirm',
            inputMobile: 'Enter your phone number',
            firstServiceAgreement: 'I confirm that I have read carefully the ',
            secondServiceAgreement: '< Service Agreement > ',
            lastServiceAgreement: '(“Agreement”) and fully understand the entire content thereof (especially the underlined or the bold part ); as to the questions related to the Agreement I raised to Carrefour E-Commerce Online Shopping Center (“Carrefour E-Commerce”). Carrefour E-Commerce has explained and clarified to me in detail. ',
            endAgreement: 'I have fully understood and agree to register.',
            next: 'NEXT',
            agree: 'Accept',
            inputVerifyCode: 'Enter verification code',
            inputPassword: 'Set a 6 to 20 characters password',
            readySendTip: 'Verification code already sent to',
            sendTip: 'Verification code has been sent to',

            sendCode: 'Send verification code',
            reSend: 'Get again',
            complete: 'Done',
            registerAgreement: 'Service Agreement',
            notFoundAgreement: 'No Service Agreement',

            popupTitle: 'Prompt',
            bindMemberCard: 'Membership Center fuction is online，Register or bind loyalty card to enjoy more Carrefour service and more benefits.',
            goRegisterMemberCard: 'Register',
            goBindMemberCard: 'To Bind'
        },

        // 找回密码
        retrievePassword: {
            goBack: 'Back',
            sendCode: 'Send verification code',
            reSend: 'Get again',
            showUp: 'Display password',
            retrievePassword: 'Forgot password',
            inputLoginName: 'Enter your phone number',
            inputVerifyCode: 'Enter verification code',
            inputPassword: 'Enter a 6 to 20 characters password',
            next: 'Next',
            readySendTip: 'Verification code already sent to',
            sendTip: 'Verification code has been sent to',
            complete: 'Done',
            success: 'Password change successfully.',
            goEmail: 'Please go to your email address',
            goLoginPage: 'Back login'
        },

        // 会员中心
        user: {
            userCenter: 'Membership Center',
            login: 'Sign in/ Sign up',
            logout: 'Sign out',
            register: 'Registered member',
            collectionItems: 'Your wishlist',
            viewHistroy: 'History',
            myOrder: 'Your orders',
            allOrder: 'Check all orders ',
            waitingPayment: 'To be paid',
            receivePackage: 'Delivering',
            boBeEvaluated: 'to be rated',
            customerService: 'Customer Service',
            settings: 'Set up',
            userCoupon: 'Your coupons',
            userConsignee: 'Address Management',
            telePhone: 'Service hotline',
            toggleLanguageContent: 'Switch to Chinese ?',
            nearbyStores: 'Nearby Stores',
            carrefourWallet: 'E-Wallet',
            changeLanguage: 'Switch Language',
            service: {
                tips: 'Returns/replacements may be processed at Carrefour hypermarkets in the area where you live. Please select the Carrefour hypermarket most proximate to you to handle the matter. '
            },
            address: {
                road: 'Road',
                figure: 'No./Figure',
                estate: 'Housing estate',
                buildingNo: 'Building/No',
                room: 'Room'
            },
            info: {
                title: 'Profile',
                pic: 'Avatar',
                nickname: 'Nickname',
                sex: {
                    title: 'Gender',
                    sexFemale: 'female',
                    sexMale: 'male'
                },
                birthday: 'Date of birth',
                editNickname: {
                    title: 'Please enter your username',
                    alert: 'No more than 15 characters '
                },
                editSex: {
                    title: 'Please choose your gender',
                    cancel: 'Cancel'
                }
            },
            aboutUs: {
                title: 'About',
                versionTxt: 'Current version V2.6.0',
                sitTxt: 'Copyright © Carrefour online shop',
                copyrightTxt: 'All Rights Reserved'
            },
            cancelOrder: {
                title: 'Cancel',
                confirmBtn: 'confirm',
                tipsTitle: 'If you pay with Carrefour Shopping Card online, please pay attention to the following issues:',
                tipsTxt1: 'Part of the amount you have paid with Carrefour Shopping Card will be refunded to the original card. In order to guarantee your financial security, please be sure your Carrefour Shopping Card is with youIf the Carrefour Shopping Card you used to pay for orders has been lost, please return and contact our customer service for assistance.!',
                tipsTxt2: 'If the Carrefour Shopping Card you used to pay for orders has been lost, please return and contact our customer service for assistance.',
                reasonTitle: 'Reasons',
                popupTxt: 'Please choose cancel reason'
            }
        },

        // 优惠券
        userCoupon: {
            title: 'Coupon',
            empty: 'No coupons',
            date: 'expire on ',
            left: 'in ',
            day: 'days',
            disable: '~Expired~',
            cancel: 'cancel',
            confirm: 'confirm',
            allFree: 'free',
            codeText: 'please enter coupon code',
            btnText: 'Activate',
            enterCode: 'please enter coupon code',
            unUsed: 'Unused',
            canNotUsed: 'Can\'t use',
            expired: 'Expired',
            used: 'Used',
            useWith: {
                1: ' is unavailable when you use ',
                2: ''
            },

            types: {
                0: 'Products',
                1: 'Delivery fee'
            },
            cancelNote: 'Please cancel the coupon chosen first and choose again',
            detailRuler: 'Detailed rules:',
            fullRuler: 'For orders of ',
            fullUse: 'or up'
        },

        // 会员中心-设置
        settings: {
            title: 'Set up',
            languageTxt: 'Switch Language',
            toggleLanguageContent: 'Select a Language',
            toggleLanguageCancel: 'Cancel',
            versionTxt: 'About',
            appshare: 'Share app with friends',
            logout: 'Sign out',
            clearCache: 'Clear Cache',
            clearSuccess: 'Clear successfully!',
            popupTitle: 'Do you confirm to clear cache?',
            notes: 'Send app feedback',
            feedbackOptions: 'Rate this app',
            successNotes: 'Feedback succeed',
            errorNotes: 'The operation is abnormal. Please try again later'
        },

        // 意见反馈
        feedbackOptions: {
            title: 'Send app feedback',
            noteTip: 'Please leave your valuable comments to help us do better.',
            noteType: 'Type of problem ',
            askTip: 'Please briefly describe the problem (5 words at least)',
            mobile: 'Contact number：',
            upImgTip: 'Support JPG, GIF, PNG, JPEG, maximum 3 pictures could be uploaded. Each picture should not exceed 3M; mobile data will be consumed when uploading pictures.',
            submit: 'Submit'
        },

        // 搜索页
        search: {
            searchTip: 'Search',
            cancel: 'Cancel',
            history: 'History',
            emptyHistory: 'No search history',
            clearHistory: 'Clear search history',
            hotKeywords: 'Popular keyword'
        },

        // 订单状态
        orderStatus: {
            1: 'To be paid',
            2: 'Order Paid',
            3: 'Order Confirmed',
            4: 'Order Dispatched',
            5: 'Signed',
            6: 'Cancelled',
            7: 'Closed'
        },

        //订单列表页
        orderList: {
            title: 'Your orders',
            totalAmount: 'Total',
            nowPay: 'Pay now',
            reBuy: 'Buy again',
            cancel: 'Cancel',
            empty: 'No order',
            addToCartSuccess: 'Successfully added',
            goToComment: 'Review'
        },

        // 评论页
        userCommentList: {
            title: 'Your reviews',
            goToComment: 'Rate',
            reviewed: 'Reviewed',
            rating: 'Rating:',
            textareaPlaceholder: 'The review should have no fewer than 10 characters. Come and share your purchasing experience now！~',
            submitBtn: 'Submit',
            textTips: 'The review should have no fewer than 10 characters',
            successTip: 'successfully'
        },

        //订单详情页
        orderInfo: {
            title: 'Order details',
            orderStatus: 'Order status',
            orderTotal: 'Order Amount',
            freight: 'Shipping cost:',
            orderNumber: 'Order No.',
            myPickUpCode: 'Check my Click & Collect code',
            readySendTipFir: 'Send it again in ',
            readySendTipSed: 's if not received',
            gotoPay: 'Pay now',
            anyTime: 'Any Date',
            paymentType: 'Payment',
            payTypeName: {
                online: 'Online payment',
                delivery: 'Payment on delivery'
            },
            deliveryType: 'Delivery',
            deliveryTime: 'Delivery Time',
            invoiceInfo: 'Invoice',
            noInvoice: 'Invoice not supported',
            productList: 'Item list',
            productAmount: ' items',
            totalWeight: 'Weight',
            goodsAmount: 'Order Amount',
            discountAmount: 'Saved',
            couponsDiscount: 'Coupon',
            totalFreight: 'Freight',
            freightServiceFee: 'Service cost',
            freightDiscount: 'Coupons Discount Amount',
            payableAmount: 'Amount',
            totalAmount: 'Total Amount',
            unionpayKnock: 'UnionPay Saved',
            realPay: 'Actually Paid',
            process: {
                submitedOrder: 'Order',
                payedOrder: 'Paid',
                deliveryOrder: 'Delivering',
                reciveOrder: 'Signed',
                canceledOrder: 'Cancelled',
                closedOrder: 'Closed'
            },
            amountPaid: 'Paid'
        },

        // 商品列表
        productList: {
            title: 'Product list',
            order: {
                default: 'default',
                sold: 'Sold',
                price: 'Price',
                reviews: 'Reviews'
            },
            filter: 'Filter',
            // offShelve: 'This item is coming soon',
            emptyList: 'No information available',
            collectSuccess: 'Successfully added'
        },

        //商品详情
        productInfo: {
            title: 'Product details',
            totalSalesCount: 'Sold',
            promotion: 'Promotion',
            services: 'Service',
            buyNumber: 'Quantity',
            prompt: 'Reminder',
            freeDelivery: 'Free Delivery on orders of ￥129 or up (<=10KG)',
            overseasShopFreeDelivery: 'Free Delivery on orders of ¥129 or up (≤3KG)',
            productContent: 'Product',
            productComment: 'Item rating',
            commentRate: 'Favorable rate',
            seeMoreComment: 'View more',
            productProperties: 'Specs',
            productAfterSales: 'After-sales',
            productRecommend: 'Recommendations',
            cart: 'Cart',
            addToCart: 'Add to cart',
            buyNow: 'Buy now',
            addToCartSuccess: 'Successfully added',
            search: 'Search',
            index: 'Home',
            unavailable: 'Not available',
            cantCollect: 'can not collect a unavailable product',
            limitedSale: {
                name: 'Crazy Deals',
                price: 'Limit price',
                preparing: 'Starts from',
                ongoing: 'Ends at',
                ending_before: 'Finish at',
                ending_after: '.',
                hour: 'h',
                minute: 'm',
                second: 's'
            },
            swipe: 'Swipe for more details of this product',
            swipeBack: 'Swipe for base info of this product',
            collect: 'Add to wishlist',
            collectSuccess: 'Successfully added',
            taxInfo: {
                title: 'Details of Taxes',
                content: '1.	The Ministry of finance, the General Administration of customs, the State Administration of Taxation issued cross-border e-commerce retail and import tax policy. From April 8, 2016, single transaction amount of cross-border e-commerce is limited to RMB 2,000, and the annual transaction amount is limited to RMB 20,000.',
                content2: '2.	The tax of cross-border e-commerce will be collected at 70% of the amount of added tax and consumption tax, and Carrefour online store global business will collect the tax. Exact tax amount is subject to payment page.'
            },
            storeTip1: 'The services shall be provided by',
            storeTip2: 'of',
            storeTip3: ''
        },

        // 评价列表
        commentList: {
            commentTitle: 'Comment',
            empty: 'It\'s no Comments here!',
            commentHighList: 'Praise',
            commentAllList: 'All'
        },

        // 购物车
        cart: {
            title: 'Cart',
            empty: 'Empty~',
            editStart: 'Edit',
            editEnd: 'Done',
            panicBuyMark: 'Crazy deals',
            panicBuyTipBefore: 'Please pay your order in',
            panicBuyTipAfter: 'by online payment.',
            invalidTip: 'This item is coming soon',
            remove: 'Delete',
            removeConfrimBefore: 'Do you confirm to delete these',
            removeConfrimAfter: ' products ?',
            removeSingleItem: 'Do you confirm to delete this product?',
            lack: 'Remaining',
            present: 'Free gift',
            click: '',
            pickPresent: 'Free gift',
            addToBuy: 'Trade-in item',
            pickAddToBuy: 'Select special deal items',
            footTitle: 'Other promotions you’re eligible for',
            sevenDdayTipBefore: 'The products with sign',
            sevenDdayTipAfter: 'in the shopping cart do not accept returns in 7 days without proper reasons',
            freeDelivery: 'Free Delivery on orders of ￥129 or up (<=10KG)',
            overseasShopFreeDelivery: 'Free Delivery on orders of ¥129 or up (≤3KG) ',
            payableAmount: 'Amount:',
            totalAmount: 'Total:',
            discountAmount: 'Saved:',
            presentLimitBefore: 'You have selected',
            notSelectedProductYet: 'You need select a product',
            presentLimitMiddle: 'out of',
            presentLimitAfter: 'free gifts',
            pickPresentLimitAfter: 'items',
            confirmSelection: 'Confirm',
            all: 'All',
            checkout: 'Check out',
            addCollect: 'Add to wishlist',
            tabs: {
                common: 'General items',
                overseasShop: 'Global items'
            },
            presell: 'Pre-sale items are included in your cart. They could not be purchased along with the non pre-sale items.'
        },

        userViewHistory: {
            title: 'History',
            empty: 'No view history,shop now!',
            goIndex: 'Go to homepage',
            clear: 'Empty',
            clearConfirm: 'Do you confirm to clear?',
            clearDone: 'Successfully deleted'
        },

        userCollectionList: {
            title: 'My wishlist',
            empty: 'Your wishlist is empty',
            goIndex: 'Go to homepage',
            limitedSale: 'Crazy Deals',
            available: 'Available',
            soldOut: 'Sold out',
            unavailable: 'unavailable',
            confirmTxt: 'Do you confirm to delete?',
            deleteTxt: 'Successfully deleted',
            addTxt: 'Successfully added'
        },

        welcome: {
            enter: 'Enter',
            changeLanguage: 'Switch Language',
            chName: '简体中文',
            enName: 'English'
        },

        viewOrderItemList: {
            title: 'Delivery note'
        },

        siderBarBrowerList: {
            title: 'My reviews'
        },

        // 结算中心
        checkout: {
            confirmOrder: 'Check order',
            addConsignee: 'Set new address',
            deliveryMode: 'Delivery method',
            express: 'Express',
            invoiceInfo: 'Invoice',
            noInvoice: 'Invoice not supported',
            couponInfo: 'Coupon',
            noCoupon: 'Select',
            noAvailableCoupon: 'unusable',
            payDelivery: 'Payment&Delivery',
            needpayDelivery: 'Select',
            productList: 'Item list',
            present: 'Free gift',
            gift: 'gift',
            changeGoods: 'Trade-in item',
            showMoreItem: 'Check all goods',
            hideMoreItem: 'Fold more products',
            totalAmount: 'Amount',
            goodsAmount: 'Order Amount',
            discountAmount: 'Saved',
            totalFreight: 'Freight',
            payableAmount: 'Amount',
            choosePaymodeType: 'Payment method',
            wechatPay: 'Wechat payment',
            codPay: 'Payment on delivery',
            submit: 'Submit',
            total: 'total',
            unit: 'piece',
            unites: 'pieces',
            freight: 'Appointed time delivery',
            freightServiceFee: 'Service cost',
            freightDiscount: 'Shipping cost',
            couponsDiscount: 'Coupons discount amount',
            needPayment: 'Need payment information',
            needDelivery: 'Need delivery information',
            needConsignee: 'Need consignee information',
            deliveryTime: 'Delivery Time',
            notePickUpMessage: 'Notice: In order to guarantee quality, please pick up your package within 24 hours after being put into the locker at the Self Pick-up Store (package includes fresh or frozen goods should be picked up within 4 hours). If it is not collected, your package will be handled as retention, and we will keep it for 72 hours at most (fresh or frozen goods over time 48 hours at most). If you fail to pick up your package, it will be dealt as return, and ¥10 will be charged as logistic service fee. Thank you for your understanding!',
            notSupportExpressageDelivery: 'Your cart contains fresh products, which are beyond our delivery territory. Please go back to your shopping cart to modify your products.',

            //准时达 普通不可用提示
            deliveryUnusedOne0: 'Sorry, the appointed time delivery service is not available now.',
            deliveryUnusedTwo0: "It's possible that the delivery address you have filled in is incomplete; or the district you chose may not be consistent with the district of delivery address of your order; or some products in your shopping cart do not support the delivery service.",
            deliveryUnusedThree0: 'Please return to check all your address or shopping cart, or contact Carrefour customer service 400 980 8800.',

            //准时达 生鲜不可用提示
            deliveryUnusedOne1: 'Sorry, the delivery service of fresh products is not available now.',
            deliveryUnusedTwo1: "It's possible that the delivery address you have filled in is incomplete; or the district you chose does not support the delivery of fresh products.",
            deliveryUnusedThree1: 'Please return to check all your address or shopping cart, or contact Carrefour customer service 400 980 8800.',

            presell: {
                payment: 'Payment：Online payment'
            },

            //编辑身份证信息
            editIdCard: {
                title: 'Identification Information',
                save: 'Save',
                tip: '* For the Customs clearance, please make sure the receiver\'s ID number is correct and corresponds to the payer ’ s identification information.',
                tip2: '*Carrefour “Global” only can be paid by Chinese ID card holder.',
                tip3: 'Notice: In order to insurance the Customs clearance, please make sure the receiver ’ s name and ID number are correct and correspond to the payer ’ s identification information.',
                tip4: 'please provide the payer\'s ID number',
                tip5: 'Pursuant to the requirements of Customs of China , we need you to provide the receiver ’ s real identification information for the cross-border customs clearance. If the identity information is not correct or cannot be authenticated, the order would be rejected by the Customs .   Carrefour Global promises to keep your personal information strictly confidential.',
                tip6: 'ok'
            },

            // 收货地址
            consignee: {
                chooseConsigneeInfo: 'Set my address',
                add: 'Add New Address',
                edit: 'Edit',
                remove: 'Delete',
                tip: 'Add a address ~',
                addConsignee: 'Add address',
                removeTip: 'Confirm to delete it',
                unavailable: 'Cannot deliver to the current territory',
                manageConsignee: 'Manage',
                limits: 'Save up to 30 addresses',
                effect: 'This address needs update',
                consigneeInfo: {
                    cancel: 'Cancel',
                    edit: 'Edit address',
                    add: 'Add address',
                    consigneeName: 'Full name',
                    consigneeRegion: 'Location',
                    consigneeAddress: 'Address',
                    road: 'Road',
                    lane: 'No./Figure',
                    village: 'Housing estate',
                    buildingNumber: 'Building/No.',
                    roomNumber: 'Room',
                    mobile: 'Mobile Number',
                    save: 'Save And Use'
                }
            },

            // 发票信息
            invoice: {
                setInvoiceInfo: 'Set invoice information',
                submit: 'Confirm',
                chooseInvoice: 'Select invoice',
                noInvoice: 'I do not need invoice',
                needInvoice: 'Commercial invoice',
                invoiceTitle: 'Invoice title',
                invoiceType: {
                    person: 'Personal',
                    company: 'Company'
                },

                placeholder: {
                    all: 'Please enter a name or company title',
                    person: 'Please enter a name',
                    company: 'Please enter a company title',
                    taxpayerCode: 'Taxpayer ID Number／Unified Social Credit Code',
                },

                invoiceCategory: 'Invoice category',
                invoiceArticle: 'VAT invoice issue',
                invoiceArticle1: 'Announcement of VAT Invoices',
                taxpayerCodeArticle: 'Illustration',
                invoiceUseDesc: 'Description of issuing VAT invoice. The invoiced amount does not include the payment made by Carrefour Shopping Card',
                invoiceTips: 'Select a type',
                needTitle: 'Please enter title',
                needTaxpayCode: 'Please input the Correct Taxpayer ID Number or Unified Social Credit Code',
                info: {
                    title: 'Invoice',
                    content: 'The purchase of Carrefour “Global” Goods by the customer shall be deemed as an act of  purchasing goods from overseas vendor. Thus, we are unable to issue statutory invoices pursuant to Chinese laws to the customer. '
                }
            },

            // 选择支付方式
            selectPayDelivery: {
                title: 'Payment / Delivery',
                payMode: 'Payment',
                deliveryMode: 'Delivery',
                confirm: 'Confirm',
                pickup: 'Self Pick-up',
                pickupTime: 'Collect time',
                pleaseSelected: 'Please select Click & Collect time slot',
                express: 'About Same Day Delivery',
                expressInfo: 'Express delivery within 3 hours. For more details >>',
                expressDelivery: 'Express delivery within 3 hours by BBTU. For more details >>',
                expressageInform: 'Notice: In order to guarantee the delivery time of your order, please complete payment in 30 minutes after you submit order if you choose pay online. Delivery may be delayed if you fail to complete payment in time. Thank you for your understanding!',
                reselectForConsigneeChange: 'Please update your payment & delivery information.',
                info: {
                    title: 'Express',
                    content: 'Deliver in 3 business days after the Customs verification'
                }
            },

            // 提交成功页
            submitSuccess: {
                success: 'Order submitted successfully',
                codPay: 'Payment on delivery:',
                orderTip: 'Order No.',
                money: 'yuan',
                tips: 'The order you submitted would be regarded as an offer, the purchase contract between you and us is established when we send you an email or text message to confirm the goods which have been delivered.',
                seeOrderDetail: 'Details'

            },

            // 支付成功页
            paySuccess: {
                success: 'Payment is complete',
                title: 'Thank you for having successfully paid your order !',
                orderTip: 'Order No.',
                payedTip: 'Order Amount:',
                money: 'yuan',
                orderAward: 'Order bonus:',
                orderRewardPoints: 'Points',
                alertPointsTip:'The rewards of successful online orders will be automatically converted to membership points after seven days of receipt.',
                tips: 'The order you submitted would be regarded as an offer, the purchase contract between you and us is established when we send you an email or text message to confirm the goods which have been delivered.',
                seeOrderDetail: 'Details',
                applePayDiscountAmount: 'Apple pay saved',
                messageTip: 'Tips：If you need to track the order status, please download ',
                messageTip1: 'Carrefour E-commerce Store APP',
                messageTip2: ' and check it on [My order], or follow us in Wechat ',
                messageTip3: '“Jialefushangcheng”',
                messageTip4: ', and click [My global order] to check. Have a nice day!'
            },

            // 支付中心
            onlinePayment: {
                title: 'Payment center',
                price: 'Price:',
                currencyUnit: 'Yuan',
                paymentType: 'Choose a type of payment',
                remainingText: 'Paid',
                remainingTextTitle: 'Should pay:',
                warnText: '* Carrefour "Global" only can be paid by Chinese ID card holder.',
                morePayment: 'More payment'
            },

            // 商品清单中商品标签
            itemList: {
                normal: 'Normal items',
                gift: 'Gift',
                limit: 'Crazy deals',
                buy: 'Trade-in item'
            },

            //当日达提示
            dayDelivery: {
                warnText: '* So far same day delivery service is only available in Shanghai',
                firstWarn: '1.Orders submitted and paid successfully, and on the following conditions, we can have your order delivered the same day:',
                subfirst1: '(1)Orders submitted and paid successfully between 7:00-17:00;',
                subfirst2: '(2)Parcel should be no greater than 10kg or over than 10 pieces;',
                subfirst3: '(3)￥10 delivery fee is charged on each order;',
                subfirst4: '(4)Same day delivery is only available in most areas of Shanghai (',
                linkText: 'Delivery territory>>',
                endLink: ');',
                subfirst5: '(5)Orders should be paid online.',
                secondWarn: '2.Delivery time slot:',
                subSecond1: '(1)Orders between 7:00-11:00, we will deliver the parcel before 15:00 the same day;',
                subSecond2: '(2)Orders between 11:00-14:00, we will deliver the parcel before 18:00 the same day;',
                subSecond3: '(3)Orders between 14:00-17:00, we will deliver the parcel before 21:00 the same day.',
                warnText2: '*Order should be paid successfully within 5 minutes after you submit it; otherwise we cannot deliver the package.',
                warnText3: '*We cannot deliver if the area you select is beyond the territory above. You can choose other delivery service.'
            },

            // 结算提示
            rulesPrompt: {
                line1: '1. I confirm that I have read and fully understood',
                line2: '"Carrefour Online Store Service Agreement"',
                line3: ', particularly the first clause of article three regarding the stipulation of merchandise purchase.',
                line4: '2. I confirm  and accept that the products with',
                line5: 'sign will not be applicable to the rules of returns within seven days without any proper cause.'
            }
        },

        productFilter: {
            title: 'Filter',
            confirm: 'Confirm',
            all: 'All',
            clear: 'Clear filter',
            categories: 'Categories',
            brands: 'Brands',
            priceRanges: 'PriceRanges'
        },

        datePicker: {
            doneButtonLabel: 'Done',
            cancelButtonLabel: 'Cancel',
            titleText: 'Select your date',
            cancelText: ' Cancel',
            todayText: 'Today',
            nowText: 'Now',
            okText: 'Ok',
            error: 'choose a date please'
        },
        pay: {
            openApplication: 'Opening payment application···',
            paySuccess: 'Pay success',
            payError: 'Pay error',
            payCancel: 'Pay cancel',
            missWechat: 'You should install the WeChat client.',
            missAlipay: 'You should install the Alipay client.'
        },

        //会员中心 地址管理
        consignee: {
            edit: 'Edit',
            remove: 'Delete',
            add: 'Add New Address',
            tip: 'Add a address ~',
            addConsignee: 'Set new address',
            defaultAddText: 'Default Address',
            removeTip: 'Confirm to delete it',
            defaultTip: 'default address ??? sure',
            changeSuc: 'success',
            title: 'Address Management',
            effect: 'This address needs update'
        },

        //福卡支付
        carrefourCardInstruction: {
            contentOne: 'From 2015,only the [new version Carrefour shopping card] supports online payment, which has an [electronic payment code] printed on the reverse side. The old version Carrefour shopping card (without electronic payment code) does not support online payment. We appreciate your understanding.',
            contentTwo: 'For your payment safety, please keep your Carrefour shopping card after the payment at least for [48Hours]',
            next: 'Next step'
        },

        //热部署
        deployTips: {
            title: 'New Version',
            notice: 'Notice',
            netTypeTips: 'Find a new version, package is 300 KB. Update now?',
            netTypeTips3G: 'Find a new version, package is 300 KB. You are in 2G/3G/4G, update now?',
            downloading: 'Downloading...',
            downloadError: 'The network is instable now, please try later.',
            extracting: 'Installing...',
            extractError: 'Failed, please try again.',
            complete: 'Finished, please restart APP.',
            reboot: 'Restart',
            ok: 'Update',
            cancel: 'Cancel',
            close: 'Close'
        },

        nearbyStores: {
            title: 'Nearby Stores',
            empty: 'No nearby store is located',
            gpsUnavailable: 'GPS is not available ',
            notice: 'Notice',
            noticeContent: 'There is a problem with your Location services. Go “Settings - Privacy - Location Services” to set it on. ',
            noticeSetting: 'Setting',
            noticeCancel: 'I Know',
            address: 'Address',
            order: {
                mall: 'Hypermarket',
                store: 'Easy Store'
            }
        },

        storeInfo: {
            title: 'Store Info',
            navigatorError: 'Cant find a navigator',
            chooseNavigator: 'Please choose a navigator',
            cancel: 'Cancel',
            navigate: 'Navigate',
            shuttleBus: 'Shuttle Bus',
            service: 'Service',
            businessTime: 'Business Time',
            bus: 'Bus',
            subway: 'Subway',
            parking: 'Parking',
            mapUnavailable: 'Map service is unavaliable , Please try again later.'
        },

        unionPayActivity: {
            act1: "Save ￥15 on purchase of ￥129",
            act2: "Save 38% off , up to￥50 max"
        },

        //消息中心
        messageCenter: {
            title: "Notifications",
            activityMsg: {
                title: "Promotion Message",
                emptyTips: "No promotion message"
            },
            systemMsg: {
                title: "System Message",
                emptyTips: "No system message",
                viewDetails: "More info"
            }
        },

        //消息分类
        messageList: {
            title: "Promotion Message",
            emptyTips: "No new message for the moment~"
        },

        activityClosedAlert: {
            title: "Sorry~",
            tagline: "The promotion has ended.",
            button: "Confirm"
        },

        // 分享
        share: {
            wechat: 'Wechat',
            moments: 'Moments',
            qq: 'QQ',
            qzone: 'Q-zone',
            weibo: 'Weibo',
            shareto: 'Share',
            wxShop: 'carrefour wxshop'
        },

        // 活动页不存在时
        activity: {
            warnText: 'The district was not involved in the event',
            btnText: 'Back to homepage'
        },

        // 会员中心
        memberCenter: {
            title: "Membership Center",
            cardName: "Carrefour Loyalty Card",
            info: "Membership Information",
            cardDescription: "Please show the barcode to the cashier to get a membership discount",
            point: "Current points",
            freezedPoint: "Frozen points",
            expireDate: "You have {{point}} points will expire in {{date}}",
            register: "Loyalty Card Register",
            bindCard: "Bind The Card",
            unbindCard: "Unbind card",
            unbindAlert: "Are you sure to unbind loyalty card? Points will remain in the bind membership card",
            registerAgreementTitle: "Term of Use of Carrefour Membership"
        },

        // 会员中心表单字段
        memberCenterFormFields : {
            nationality: "Country or Region",
            idType: "ID type",
            idTypes: {
                "0": "ID",
                "1": "Certificate of officers",
                "2": "Passport"
            },
            idNumber: "ID number",
            idNumberPlaceholder: "Enter your ID number",
            mobile: "Phone number",
            mobilePlaceholder: "Enter your phone number",
            verifyCode: "Verification code",
            verifyCodePlaceholder: "",
            getVerifyCode: "Get verification code",
            resend: "Resend",
            sex: "Gender",
            selectSex: "Select",
            male: "Male",
            female: "Female",
            name: "Name",
            namePlaceholder: "Enter your name",
            birthday: "Date of birth",
            email: "E-mail",
            emailPlaceholder: "Enter your email address",
            regions: "Address",
            regionsPlaceholder: "Please select the area",
            address: "Detail address",
            addressPlaceholder: "Enter a detailed address",
            cardMember: "Loyalty Card No.",
            memberCardPlaceholder: "Enter card No.",
            errorIdNumber1: 'ID number can\'t be empty',
            errorIdNumber2: 'ID number format error',
            errorCardNumber1: 'Card Number can\'t be empty',
            errorCardNumber2: 'Card Number must be 15 digits',
            errorVerifyCode: 'Please input 6 digit verification code',
            errorMobile: 'Phone number must be 11 digits'
        },

        // 注册会员卡
        registerMemberCard: {
            title: "Loyalty Card Register",
            agrees: "I have read and agree to",
            note: "ID number,Phone number,Card Number,Fill in at least two items",
            serviceAgreement: "<Term of Use of Carrefour Membership>",
            next: "Next",
            done: "Done",
            success: "Registration succeeded"
        },

        // 解绑会员卡
        unbindMemberCard: {
            title: 'Unbind Card',
            confirmBtn: 'Confirm',
            success: 'Loyalty card unbinding successed',
            error: 'Loyalty card unbinding failed'
        },

        // 会员信息
        memberInfo: {
            title: 'Membership Information',
            save: "Save",
            success: "Modification successed",
            error: "Modification failed"
        },

        // 更换会员卡手机号
        editMemberCardMoblie: {
            title: 'Modify Phone Number',
            confirmBtn: 'Done'
        },

        // 绑定会员卡
        bindMemberCard: {
            title: "Bind The Card",
            agrees: "I have read and agree to",
            serviceAgreement: "<Term of Use of Carrefour Membership>",
            next: "Agree",
            success: "Binding succeeded",
            bindMemberCardPopup: {
                title: 'Prompt',
                template: 'The information you have filled is incorrect. Please re-enter or register a new membership card.',
                okText: 'Re-enter',
                cancelText: 'Register'
            }
        },

        // 冻结积分规则
        freezedRuler: {
            title: "Frozen Points Rules",
            content: "The rewards of successful online orders will be automatically converted to membership points after seven days of receipt."
        },

        // 过期积分说明
        expireRuler: {
            title: "Expired Roints Rules",
            content: "The points you get this year will expire at 31st Dec in the next year."
        },

        // 注册后弹框
        memberCardPopup: {
            title: "Prompt",
            content: 'Membership Center fuction is online，Register or bind loyalty card to enjoy more Carrefour service and more benefits.',
            goRegisterMemberCard: 'Register',
            goBindMemberCard: 'To Bind',
            cancel: 'Cancel',
        }
    }
});
