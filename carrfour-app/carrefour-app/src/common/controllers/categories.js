angular.module('app.controllers').controller('categoriesCtrl', function (
    $scope, $state, categoryService, loadDataMixin, stateUtils, messageCenter,
    $ionicScrollDelegate, localStorage
) {

    var ctrl = this;

    _.assign(ctrl, loadDataMixin, stateUtils, {
        $scope: $scope,

        // 当前被选中的一级分类
        activeFirstCategory: undefined,

        /**
         * 数据加载
         */
        loadData: function () {
            // 若已经加载完 1 级分类，则只加载当前所选 1 级分类的 2，3 级子分类
            if (!_.isUndefined(this.activeFirstCategory)) {
                return this.loadSubCategories();
            }
            // 否则从 1 级分类开始加载
            else {
                return categoryService.list(1, 1)
                    .then(function (response) {
                        if (response.data && response.data.length > 0) {
                            ctrl.data = response.data;
                            ctrl.activeFirstCategory = response.data[0];
                            return ctrl.loadSubCategories();
                        } else {
                            return response;
                        }
                    });
            }
        },

        /**
         * 加载 2，3 级分类
         */
        loadSubCategories: function () {
            // 加载 2，3 级分类
            return categoryService.list(this.activeFirstCategory.id, 2).then(function (response) {
                publishTags(ctrl.activeFirstCategory);
                ctrl.activeFirstCategory.subCategories = response.data;
                response.data = ctrl.data;
                return response;
            });
        },

        /**
         * 设置 activeFirstCategory，并加载其数据
         */
        setActiveFirstCategory: function (category) {

            $ionicScrollDelegate.$getByHandle('subCategories').scrollTop();

            if (this.activeFirstCategory == category) {
                this.refresh({
                    emptyData: false,
                    showLoading: false
                });
            } else {
                this.activeFirstCategory = category;
                this.refresh({
                    emptyData: false
                });
            }
        },

        //跳转商品列表
        goCategoryProductList: function (category) {
            localStorage.set('categoryName', category.name);
            category.params.fromCategories = [this.activeFirstCategory.id, category.id];
            stateUtils.goProductList(category.params);
        },

        //跳转子分类的商品列表
        goSubcategoryProductList: function (category, subCategory) {
            localStorage.set('categoryName', subCategory.name);
            subCategory.params.fromCategories = [this.activeFirstCategory.id, category.id, subCategory.id];
            stateUtils.goProductList(subCategory.params);
        }
    });

    // 切换语言后重新请求一级分类
    messageCenter.subscribeMessage('language.change', function (event) {
        ctrl.activeFirstCategory = undefined;
        ctrl.data = undefined;
        // ctrl.refresh({
        //     emptyData: false,
        //     showLoading: false
        // });
    }, $scope);

    //subsite.change  切换分站之后请求一遍一级分类
    messageCenter.subscribeMessage('subsite.change', function (event) {
        ctrl.activeFirstCategory = undefined;
        ctrl.data = undefined;
        // ctrl.refresh({
        //     emptyData: false,
        //     showLoading: false
        // });
    }, $scope);

    function publishTags(category) {
        // 广播页面Tag
        messageCenter.publishMessage('AT.screen', {
            pageName: 'category::' + category.name,
            customVariables: {
                "20": category.id,
            },
        });
    }

    var deregistration = $scope.$on('$ionicView.afterEnter', function () {
        ctrl.init();
        deregistration();

        $scope.$on('$ionicView.afterEnter', function () {
            ctrl.refresh({
                emptyData: false,
                showLoading: false
            });
        });
    });

});
