/**
 * 选择赠品控制器
 */
angular.module('app.controllers').controller('selectPresentsCtrl', ["$scope", "$params", "cartService", "loading", "errorHandling", "modals", function(
    $scope, $params, cartService, loading, errorHandling, modals
) {
    var ctrl = this;

    _.assign(ctrl, $params, {
        $scope: $scope,

        // 切换赠品是否选中
        toggleSelection: function(present) {
            if (present.selected) {
                present.selected = false;
            } else {
                if (ctrl.selectUpperLimit - ctrl.totalSelected()) {
                    present.selected = true;
                }
            }
        },

        // 赠品可选数量
        selectionRemain: function(present) {
            return Math.min(ctrl.selectUpperLimit - ctrl.totalSelected() + present.number, present.count);
        },

        // 已选中赠品总数
        totalSelected: function() {
            var total = 0;

            _.forEach(ctrl.presents, function(present) {
                if (present.selected) {
                    total += present.number;
                }
            });

            return total;
        },

        // 确认赠品选择
        confirmSelection: function() {
            var presents = [];

            _.forEach(ctrl.presents, function(present) {
                var selectedNumber = present.selected ? present.number : 0;
                if (present.origin != selectedNumber) {
                    presents.push({
                        presentId: present.presentId,
                        presentItemId: present.presentItemId,
                        number: selectedNumber
                    });
                }
            });

            if (!presents.length) {
                modals.selectPresents.close();
                return;
            }

            loading.open();
            cartService.editPresent(ctrl.basketId, ctrl.itemId, ctrl.ruleId, presents)
                .finally(function() {
                    loading.close();
                })
                .success(function() {
                    modals.selectPresents.close();
                })
                .error(errorHandling);
        }

    });

}]);
