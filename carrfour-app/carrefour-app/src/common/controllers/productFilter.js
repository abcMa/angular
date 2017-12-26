angular.module('app.controllers').controller('productFilterCtrl', function(
    $scope, $params, productService, cmSwitcherDelegate, modals
) {

    var ctrl = this,

        searchParams = $params.searchParams;

    _.assign(ctrl, {

        data: undefined,

        selectedFilter: $params.filters || {},

        init: function() {
            productService.filterCondition(searchParams)
                .success(function(data) {
                    ctrl.data = data;
                });
        },

        goSelectCategories: function() {
            cmSwitcherDelegate.$getByHandle('product-filter-switcher').switch('[data-name=categories]');
        },

        goSelectBrands: function() {
            cmSwitcherDelegate.$getByHandle('product-filter-switcher').switch('[data-name=brands]');
        },

        goSelectPriceRanges: function() {
            cmSwitcherDelegate.$getByHandle('product-filter-switcher').switch('[data-name=priceRanges]');
        },

        backup: function() {
            var switcher = cmSwitcherDelegate.$getByHandle('product-filter-switcher');

            if (switcher.getIsFirst()) {
                this.close();
            }
            else {
                switcher.backup();
            }
        },

        close: function() {
            modals.productFilter.close();
        },

        toggleSubCategories: function(category) {
            category.isOpenSubCategories = !category.isOpenSubCategories;
        },

        selectCategory: function(category) {
            if (this.selectedFilter.category && this.selectedFilter.category.id == category.id) {
                this.selectedFilter.category = undefined;
            }
            else {
                this.selectedFilter.category = category;
            }
        },

        selectedBrand: function(brandId, brandName) {
            if (this.selectedFilter.brands && this.selectedFilter.brands[brandId]) {
                delete this.selectedFilter.brands[brandId];

                if (_.isEmpty(this.selectedFilter.brands)) {
                    this.selectedFilter.brands = undefined;
                }
            }
            else {
                if (!this.selectedFilter.brands) {
                    this.selectedFilter.brands = {};
                }

                this.selectedFilter.brands[brandId] = brandName;
            }
        },

        selectedPriceRange: function(priceRange) {
            if ( _.isEqual(priceRange, this.selectedFilter.priceRange) ) {
                this.selectedFilter.priceRange = undefined;
            }
            else {
                this.selectedFilter.priceRange = priceRange;
            }
        },

        confirm: function() {
            var switcher = cmSwitcherDelegate.$getByHandle('product-filter-switcher');
            if (switcher.getIsFirst()) {
                var filters = this.selectedFilter;
                if (_.isEmpty(filters)) {
                    filters = undefined;
                }
                $params.confirm && $params.confirm(filters);
                this.close();
            }
            else {
                switcher.backup();
            }
        },

        clear: function() {
            this.selectedFilter = {};
            // this.confirm();
        }
    });

    ctrl.init();
});
