angular.module('components', [])

    .directive('tabs', function() {
        return {
            restrict: 'E',//限制指令是以元素操作的
            transclude: true,//内嵌方式
            replace: true,//替换
            scope: {},//隔离变量，自定义的变量（子域）和dom周围的controller（父域）中的变量隔离
            //此自定义指令的控制器
            controller: function($scope, $element) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                }

                this.addPane = function(pane) {
                    if (panes.length == 0) $scope.select(pane);
                    panes.push(pane);
                }
            },
            template:
            '<div class="tabbable">' +
            '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
            '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
            '</ul>' +
            '<div class="tab-content" ng-transclude></div>' +
            '</div>'

        };
    })

    .directive('pane', function() {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            /*
            * 隔离变量，自定义的变量（子域）和dom周围的controller（父域）中的变量隔离@代表子域调用父域相同的变量时，父域
            * 变子域就变，反过来，子域变父域不变
            * */
            scope: { title: '@' },
            //可以简单理解为，当directive被angular 编译后，执行该方法
            link: function(scope, element, attrs, tabsController) {
                tabsController.addPane(scope);
            },
            template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
            replace: true
        };
    })