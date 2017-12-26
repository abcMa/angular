/**
 * 注册会员卡
 */
angular.module('app.controllers').controller('bindMemberCardCtrl', ["$rootScope", "$scope", "errorHandling", "toast", "loading", "globalService", "$interval", "memberCenterService", "$translate", "scanService", "messageCenter", "popup", "modals", "$ionicPopup", "identityCodeValid", function (
    $rootScope, $scope, errorHandling, toast, loading, globalService, $interval, memberCenterService, $translate,
    scanService, messageCenter, popup, modals, $ionicPopup, identityCodeValid
) {
    var ctrl = this;

    _.assign(ctrl, {
        $scope: $scope,

        countdown: 0,

        agreement: "",

        // 传输数据
        formData: {
            nationality: "CHN",
            idType: "0",
            idNumber: "",
            mobile: "",
            cardNumber: "",
            verifyCode: "",
        },

        // 是否可点击
        isDisabled: true,

        // 是否需要验证码
        isVerifyCode: false,

        // 是否同意注册协议
        isAgreeAgreement: false,

        nationality: [{"value":"CHN","en":"Mainland China ","name":"中国大陆"},{"value":"TWN","en":"Taiwan,China","name":"中国台湾"},{"value":"HKG","en":"Hong Kong SAR","name":"香港特别行政区"},{"value":"MAC","en":"Macao SAR","name":"澳门特别行政区"},{"value":"FRA","en":"France","name":"法国"},{"value":"USA","en":"United States","name":"美国"},{"value":"KOR","en":"Korea","name":"韩国"},{"value":"JPN","en":"Japan","name":"日本"},{"value":"IND","en":"India","name":"印度"},{"value":"AFG","en":"Afghanistan","name":"阿富汗"},{"value":"ALA","en":"Åland Islands","name":"奥兰群岛"},{"value":"ALB","en":"Albania","name":"阿尔巴尼亚"},{"value":"DZA","en":"Algeria","name":"阿尔及利亚"},{"value":"ASM","en":"American Samoa","name":"美属萨摩亚"},{"value":"AND","en":"Andorra","name":"安道尔"},{"value":"AGO","en":"Angola","name":"安哥拉"},{"value":"AIA","en":"Anguilla","name":"安圭拉岛"},{"value":"ATA","en":"Antarctica","name":"南极洲"},{"value":"ATG","en":"Antigua and Barbuda","name":"安提瓜和巴布达"},{"value":"ARG","en":"Argentina","name":"阿根廷"},{"value":"ARM","en":"Armenia","name":"亚美尼亚"},{"value":"ABW","en":"Aruba","name":"阿鲁巴岛"},{"value":"AUS","en":"Australia","name":"澳大利亚"},{"value":"AUT","en":"Austria","name":"奥地利"},{"value":"AZE","en":"Azerbaijan","name":"阿塞拜疆"},{"value":"BHS","en":"Bahamas, The","name":"巴哈马"},{"value":"BHR","en":"Bahrain","name":"巴林"},{"value":"BGD","en":"Bangladesh","name":"孟加拉国"},{"value":"BRB","en":"Barbados","name":"巴巴多斯"},{"value":"BLR","en":"Belarus","name":"白俄罗斯"},{"value":"BEL","en":"Belgium","name":"比利时"},{"value":"BLZ","en":"Belize","name":"伯利兹"},{"value":"BEN","en":"Benin","name":"贝宁"},{"value":"BMU","en":"Bermuda","name":"百慕大"},{"value":"BTN","en":"Bhutan","name":"不丹"},{"value":"BOL","en":"Bolivia","name":"玻利维亚"},{"value":"BIH","en":"Bosnia and Herzegovina","name":"波斯尼亚和黑塞哥维那"},{"value":"BWA","en":"Botswana","name":"博茨瓦纳"},{"value":"BVT","en":"Bouvet Island","name":"布维岛"},{"value":"BRA","en":"Brazil","name":"巴西"},{"value":"IOT","en":"British Indian Ocean Territory","name":"英属印度洋领地"},{"value":"VGB","en":"British Virgin Islands","name":"英属维尔京群岛"},{"value":"BRN","en":"Brunei","name":"文莱"},{"value":"BGR","en":"Bulgaria","name":"保加利亚"},{"value":"BFA","en":"Burkina Faso","name":"布基纳法索"},{"value":"BDI","en":"Burundi","name":"布隆迪"},{"value":"KHM","en":"Cambodia","name":"柬埔寨"},{"value":"CMR","en":"Cameroon","name":"喀麦隆"},{"value":"CAN","en":"Canada","name":"加拿大"},{"value":"CPV","en":"Cape Verde","name":"佛得角"},{"value":"BES","en":"Caribbean Netherlands","name":"荷兰加勒比区"},{"value":"CYM","en":"Cayman Islands","name":"开曼群岛"},{"value":"CAF","en":"Central African Republic","name":"中非共和国"},{"value":"TCD","en":"Chad","name":"乍得"},{"value":"CHL","en":"Chile","name":"智利"},{"value":"CXR","en":"Christmas Island","name":"圣诞岛"},{"value":"CCK","en":"Cocos (Keeling) Islands","name":"科科斯(奇林)群岛"},{"value":"COL","en":"Colombia","name":"哥伦比亚"},{"value":"COM","en":"Comoros","name":"科摩罗"},{"value":"COG","en":"Congo","name":"刚果"},{"value":"COD","en":"Congo (DRC)","name":"刚果民主共和国"},{"value":"COK","en":"Cook Islands","name":"库克群岛"},{"value":"CRI","en":"Costa Rica","name":"哥斯达黎加"},{"value":"CIV","en":"Côte d’Ivoire","name":"科特迪瓦"},{"value":"HRV","en":"Croatia","name":"克罗地亚"},{"value":"CUB","en":"Cuba","name":"古巴"},{"value":"CUW","en":"Curaçao","name":"库拉索岛"},{"value":"CYP","en":"Cyprus","name":"塞浦路斯"},{"value":"CZE","en":"Czech Republic","name":"捷克共和国"},{"value":"DNK","en":"Denmark","name":"丹麦"},{"value":"DJI","en":"Djibouti","name":"吉布提"},{"value":"DMA","en":"Dominica","name":"多米尼加"},{"value":"DOM","en":"Dominican Republic","name":"多米尼加共和国"},{"value":"ECU","en":"Ecuador","name":"厄瓜多尔"},{"value":"EGY","en":"Egypt","name":"埃及"},{"value":"SLV","en":"El Salvador","name":"萨尔瓦多"},{"value":"GNQ","en":"Equatorial Guinea","name":"赤道几内亚"},{"value":"ERI","en":"Eritrea","name":"厄立特里亚"},{"value":"EST","en":"Estonia","name":"爱沙尼亚"},{"value":"ETH","en":"Ethiopia","name":"埃塞俄比亚"},{"value":"FLK","en":"Falkland Islands (Islas Malvinas)","name":"福克兰群岛(马尔维纳斯群岛)"},{"value":"FRO","en":"Faroe Islands","name":"法罗群岛"},{"value":"FJI","en":"Fiji","name":"斐济"},{"value":"FIN","en":"Finland","name":"芬兰"},{"value":"GUF","en":"French Guiana","name":"法属圭亚那"},{"value":"PYF","en":"French Polynesia","name":"法属波利尼西亚"},{"value":"ATF","en":"French Southern and Antarctic Lands","name":"法属南部和南极洲领土"},{"value":"GAB","en":"Gabon","name":"加蓬"},{"value":"GMB","en":"Gambia","name":"冈比亚"},{"value":"GEO","en":"Georgia","name":"格鲁吉亚"},{"value":"DEU","en":"Germany","name":"德国"},{"value":"GHA","en":"Ghana","name":"加纳"},{"value":"GIB","en":"Gibraltar","name":"直布罗陀"},{"value":"GRC","en":"Greece","name":"希腊"},{"value":"GRL","en":"Greenland","name":"格陵兰"},{"value":"GRD","en":"Grenada","name":"格林纳达"},{"value":"GLP","en":"Guadeloupe","name":"瓜德罗普岛"},{"value":"GUM","en":"Guam","name":"关岛"},{"value":"GTM","en":"Guatemala","name":"危地马拉"},{"value":"GGY","en":"Guernsey","name":"根西岛"},{"value":"GIN","en":"Guinea","name":"几内亚"},{"value":"GNB","en":"Guinea-Bissau","name":"几内亚比索"},{"value":"GUY","en":"Guyana","name":"圭亚那"},{"value":"HTI","en":"Haiti","name":"海地"},{"value":"HMD","en":"Heard Island and McDonald Islands","name":"赫德和麦克唐纳群岛"},{"value":"HND","en":"Honduras","name":"洪都拉斯"},{"value":"HUN","en":"Hungary","name":"匈牙利"},{"value":"ISL","en":"Iceland","name":"冰岛"},{"value":"IDN","en":"Indonesia","name":"印度尼西亚"},{"value":"IRN","en":"Iran","name":"伊朗"},{"value":"IRQ","en":"Iraq","name":"伊拉克"},{"value":"IRL","en":"Ireland","name":"爱尔兰"},{"value":"IMN","en":"Isle of Man","name":"马恩岛"},{"value":"ISR","en":"Israel","name":"以色列"},{"value":"ITA","en":"Italy","name":"意大利"},{"value":"JAM","en":"Jamaica","name":"牙买加"},{"value":"JEY","en":"Jersey","name":"泽西岛"},{"value":"JOR","en":"Jordan","name":"约旦"},{"value":"KAZ","en":"Kazakhstan","name":"哈萨克斯坦"},{"value":"KEN","en":"Kenya","name":"肯尼亚"},{"value":"KIR","en":"Kiribati","name":"基里巴斯"},{"value":"KWT","en":"Kuwait","name":"科威特"},{"value":"KGZ","en":"Kyrgyzstan","name":"吉尔吉斯斯坦"},{"value":"LAO","en":"Laos","name":"老挝"},{"value":"LVA","en":"Latvia","name":"拉脱维亚"},{"value":"LBN","en":"Lebanon","name":"黎巴嫩"},{"value":"LSO","en":"Lesotho","name":"莱索托"},{"value":"LBR","en":"Liberia","name":"利比里亚"},{"value":"LBY","en":"Libya","name":"利比亚"},{"value":"LIE","en":"Liechtenstein","name":"列支敦斯登"},{"value":"LTU","en":"Lithuania","name":"立陶宛"},{"value":"LUX","en":"Luxembourg","name":"卢森堡"},{"value":"MKD","en":"Macedonia","name":"马其顿"},{"value":"MDG","en":"Madagascar","name":"马达加斯加"},{"value":"MWI","en":"Malawi","name":"马拉维"},{"value":"MYS","en":"Malaysia","name":"马来西亚"},{"value":"MDV","en":"Maldives","name":"马尔代夫"},{"value":"MLI","en":"Mali","name":"马里"},{"value":"MLT","en":"Malta","name":"马耳他"},{"value":"MHL","en":"Marshall Islands","name":"马绍尔群岛"},{"value":"MTQ","en":"Martinique","name":"马提尼克"},{"value":"MRT","en":"Mauritania","name":"毛里塔尼亚"},{"value":"MUS","en":"Mauritius","name":"毛里求斯"},{"value":"MYT","en":"Mayotte","name":"马约特岛"},{"value":"MEX","en":"Mexico","name":"墨西哥"},{"value":"FSM","en":"Micronesia","name":"密克罗尼西亚"},{"value":"MDA","en":"Moldova","name":"摩尔多瓦"},{"value":"MCO","en":"Monaco","name":"摩纳哥"},{"value":"MNG","en":"Mongolia","name":"蒙古"},{"value":"MNE","en":"Montenegro","name":"黑山共和国"},{"value":"MSR","en":"Montserrat","name":"蒙特塞拉特"},{"value":"MAR","en":"Morocco","name":"摩洛哥"},{"value":"MOZ","en":"Mozambique","name":"莫桑比克"},{"value":"MMR","en":"Myanmar","name":"缅甸"},{"value":"NAM","en":"Namibia","name":"纳米比亚"},{"value":"NRU","en":"Nauru","name":"瑙鲁"},{"value":"NPL","en":"Nepal","name":"尼泊尔"},{"value":"NLD","en":"Netherlands","name":"荷兰"},{"value":"ANT","en":"Netherlands Antilles","name":"荷属安的列斯"},{"value":"NCL","en":"New Caledonia","name":"新喀里多尼亚"},{"value":"NZL","en":"New Zealand","name":"新西兰"},{"value":"NIC","en":"Nicaragua","name":"尼加拉瓜"},{"value":"NER","en":"Niger","name":"尼日尔"},{"value":"NGA","en":"Nigeria","name":"尼日利亚"},{"value":"NIU","en":"Niue","name":"纽埃"},{"value":"NFK","en":"Norfolk Island","name":"诺福克岛"},{"value":"PRK","en":"North Korea","name":"朝鲜"},{"value":"MNP","en":"Northern Mariana Islands","name":"北马里亚纳群岛"},{"value":"NOR","en":"Norway","name":"挪威"},{"value":"OMN","en":"Oman","name":"阿曼"},{"value":"PAK","en":"Pakistan","name":"巴基斯坦"},{"value":"PLW","en":"Palau","name":"帕劳"},{"value":"PSE","en":"Palestinian Authority","name":"巴勒斯坦当局"},{"value":"PAN","en":"Panama","name":"巴拿马"},{"value":"PNG","en":"Papua New Guinea","name":"巴布亚新几内亚"},{"value":"PRY","en":"Paraguay","name":"巴拉圭"},{"value":"PER","en":"Peru","name":"秘鲁"},{"value":"PHL","en":"Philippines","name":"菲律宾"},{"value":"PCN","en":"Pitcairn Islands","name":"皮特凯恩群岛"},{"value":"POL","en":"Poland","name":"波兰"},{"value":"PRT","en":"Portugal","name":"葡萄牙"},{"value":"PRI","en":"Puerto Rico","name":"波多黎各"},{"value":"QAT","en":"Qatar","name":"卡塔尔"},{"value":"REU","en":"Reunion","name":"留尼汪岛"},{"value":"ROU","en":"Romania","name":"罗马尼亚"},{"value":"RUS","en":"Russia","name":"俄罗斯"},{"value":"RWA","en":"Rwanda","name":"卢旺达"},{"value":"BLM","en":"Saint Barthélemy","name":"圣巴泰勒米"},{"value":"SHN","en":"Saint Helena, Ascension and Tristan da Cunha","name":"圣赫勒拿、阿森松岛、特里斯坦达昆哈"},{"value":"KNA","en":"Saint Kitts and Nevis","name":"圣基茨和尼维斯"},{"value":"LCA","en":"Saint Lucia","name":"圣卢西亚"},{"value":"MAF","en":"Saint Martin","name":"圣马丁岛"},{"value":"SPM","en":"Saint Pierre and Miquelon","name":"圣皮埃尔和密克隆群岛"},{"value":"VCT","en":"Saint Vincent and the Grenadines","name":"圣文森特和格林纳丁斯"},{"value":"WSM","en":"Samoa","name":"萨摩亚"},{"value":"SMR","en":"San Marino","name":"圣马力诺"},{"value":"STP","en":"São Tomé and Príncipe","name":"圣多美和普林西比"},{"value":"SAU","en":"Saudi Arabia","name":"沙特阿拉伯"},{"value":"SEN","en":"Senegal","name":"塞内加尔"},{"value":"SRB","en":"Serbia","name":"塞尔维亚"},{"value":"SYC","en":"Seychelles","name":"塞舌尔"},{"value":"SLE","en":"Sierra Leone","name":"塞拉利昂"},{"value":"SGP","en":"Singapore","name":"新加坡"},{"value":"SXM","en":"Sint Maarten","name":"圣马丁岛"},{"value":"SVK","en":"Slovakia","name":"斯洛伐克"},{"value":"SVN","en":"Slovenia","name":"斯洛文尼亚"},{"value":"SLB","en":"Solomon Islands","name":"所罗门群岛"},{"value":"SOM","en":"Somalia","name":"索马里"},{"value":"ZAF","en":"South Africa","name":"南非"},{"value":"SGS","en":"South Georgia and the South Sandwich Islands","name":"南乔治亚和南德桑威奇群岛"},{"value":"SSD","en":"South Sudan","name":"南苏丹"},{"value":"ESP","en":"Spain","name":"西班牙"},{"value":"LKA","en":"Sri Lanka","name":"斯里兰卡"},{"value":"SDN","en":"Sudan","name":"苏丹"},{"value":"SUR","en":"Suriname","name":"苏里南"},{"value":"SJM","en":"Svalbard and Jan Mayen Island","name":"斯瓦尔巴特和扬马延岛"},{"value":"SWZ","en":"Swaziland","name":"斯威士兰"},{"value":"SWE","en":"Sweden","name":"瑞典"},{"value":"CHE","en":"Switzerland","name":"瑞士"},{"value":"SYR","en":"Syria","name":"叙利亚"},{"value":"TJK","en":"Tajikistan","name":"塔吉克斯坦"},{"value":"TZA","en":"Tanzania","name":"坦桑尼亚"},{"value":"THA","en":"Thailand","name":"泰国"},{"value":"TLS","en":"Timor-Leste","name":"东帝汶"},{"value":"TGO","en":"Togo","name":"多哥"},{"value":"TKL","en":"Tokelau","name":"托克劳"},{"value":"TON","en":"Tonga","name":"汤加"},{"value":"TTO","en":"Trinidad and Tobago","name":"特立尼达和多巴哥"},{"value":"TUN","en":"Tunisia","name":"突尼斯"},{"value":"TUR","en":"Turkey","name":"土耳其"},{"value":"TKM","en":"Turkmenistan","name":"土库曼斯坦"},{"value":"TCA","en":"Turks and Caicos Islands","name":"特克斯和凯科斯群岛"},{"value":"TUV","en":"Tuvalu","name":"图瓦卢"},{"value":"UMI","en":"U.S. Minor Outlying Islands","name":"美属边疆群岛"},{"value":"UGA","en":"Uganda","name":"乌干达"},{"value":"UKR","en":"Ukraine","name":"乌克兰"},{"value":"ARE","en":"United Arab Emirates","name":"阿拉伯联合酋长国"},{"value":"GBR","en":"United Kingdom","name":"英国"},{"value":"URY","en":"Uruguay","name":"乌拉圭"},{"value":"UZB","en":"Uzbekistan","name":"乌兹别克斯坦"},{"value":"VUT","en":"Vanuatu","name":"瓦努阿图"},{"value":"VAT","en":"Vatican City","name":"梵蒂冈城"},{"value":"VEN","en":"Venezuela","name":"委内瑞拉"},{"value":"VNM","en":"Vietnam","name":"越南"},{"value":"VIR","en":"Virgin Islands","name":"维尔京群岛"},{"value":"WLF","en":"Wallis and Futuna","name":"瓦利斯和富图纳群岛"},{"value":"YEM","en":"Yemen","name":"也门"},{"value":"ZMB","en":"Zambia","name":"赞比亚"},{"value":"ZWE","en":"Zimbabwe","name":"津巴布韦"}],

        validatCardNumber: function(text){
            if(text==undefined || text == "") return;
            if(!/^\d{15}$/.test(text)) {
                toast.open($translate.instant('memberCenterFormFields.errorCardNumber2'));
                return false;
            } else {
                return true;
            }
        },

        validatIdNumber: function(text){
            if(ctrl.formData.idType != 0 || !text) return;
            if (!text || !text.length){
                toast.open($translate.instant('memberCenterFormFields.errorIdNumber1'));
                return false;
            } else {
                return identityCodeValid.identityCodeValid(text);
            }
        },

        // 是否通过3选2验证条件
        isAbleSub: function(){
            var isIdNumber = ctrl.formData.idNumber.length !== 0,
                isMobile = /^\d{11}$/.test(ctrl.formData.mobile) && (ctrl.formData.verifyCode.length !== 0),
                isCardNumber = /^\d{15}$/.test(ctrl.formData.cardNumber);
            ctrl.isVerifyCode = /^\d{11}$/.test(ctrl.formData.mobile);
            var idNumberAdnMobile = isIdNumber && isMobile,
                idNumberAdnCardNumber = isIdNumber && isCardNumber,
                cardNumberAdnMobile = isCardNumber && isMobile;
            if(ctrl.isAgreeAgreement && (idNumberAdnMobile || idNumberAdnCardNumber || cardNumberAdnMobile)){
                ctrl.isDisabled = false;
            } else {
                ctrl.isDisabled = true;
            }
        },

        /**
         * 绑定协议
         */
        openServiceAgreement: function () {
            modals.article.open({
                params: {
                    articleId: 250122565,
                    title: $translate.instant('memberCenter.registerAgreementTitle')
                }
            });
        },
        getBindVerifyCode: function () {
            loading.open();
            ctrl.countdown = 90;
            memberCenterService.getBindByMobileVerifyCode(ctrl.formData.mobile)
                .error(errorHandling)
                .finally(function () {
                    var intervalHandle = $interval(function () {
                        if (ctrl.countdown > 0) {
                            ctrl.countdown--;
                        } else {
                            $interval.cancel(intervalHandle);
                            ctrl.countdown = 0;
                        }
                    }, 1000);
                    loading.close();
                });
        },

        scan: function () {
            scanService.scan()
                .then(function (res) {
                    resultHandler(res.format, res.code);
                });


            function resultHandler(format, code) {
                switch (format.toLowerCase()) {
                    case "qr_code":
                    case "qrcode":
                        // do nothing
                        break;
                    default:
                        ctrl.formData.cardNumber = code;
                }
            }
        },

        onSubmit: function () {
            if(ctrl.formData.idNumber && !identityCodeValid.identityCodeValid(ctrl.formData.idNumber) && ctrl.formData.idType == 0){
                return;
            }
            if(ctrl.formData.cardNumber && !ctrl.validatCardNumber(ctrl.formData.cardNumber)){
                toast.open($translate.instant('memberCenterFormFields.errorCardNumber2'));
                return;
            }
            if(ctrl.formData.mobile && !/^\d{11}$/.test(ctrl.formData.mobile)){
                toast.open($translate.instant('memberCenterFormFields.errorMobile'));
                return;
            }
            if(!/^\d{6}$/.test(ctrl.formData.verifyCode) && ctrl.formData.mobile){
                toast.open($translate.instant('memberCenterFormFields.errorVerifyCode'));
                return;
            }
            loading.open();
            memberCenterService.bind(ctrl.formData)
                .success(function (data) {
                    if(!data){
                        loading.close();
                        $ionicPopup.confirm({
                            title: $translate.instant('bindMemberCard.bindMemberCardPopup.title'),
                            template: $translate.instant('bindMemberCard.bindMemberCardPopup.template'),
                            okText: $translate.instant('bindMemberCard.bindMemberCardPopup.cancelText'),
                            cancelText: $translate.instant('bindMemberCard.bindMemberCardPopup.okText')
                        }).then(function (res) {
                            if (res) {
                                // 确认
                                modals.registerMemberCard.open();
                            } else {
                                // 重写
                                ctrl.formData.verifyCode = "";
                            }
                        });
                    } else {
                        toast.open($translate.instant('bindMemberCard.success'));
                        messageCenter.publishMessage('memberCenter.refresh');
                        $rootScope.goBack();
                    }
                })
                .error(errorHandling)
                .finally(function () {
                    ctrl.formData.verifyCode = '';
                    loading.close();
                });
        }
    });

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        globalService.getArticleByStructure('bindMemberCard')
            .success(function (data) {
                ctrl.agreement = data;
            })
            .error(errorHandling);
        deregistration();
    });
}]);
