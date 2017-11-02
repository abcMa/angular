angular.module('expanderModule', [])
    .controller("SomeController", function ($scope) {
    })
    .directive("expander", function () {
        return {
            reastrict: "E",
            transclude: true,//是否将当前元素的内容转移到模板中
            replace:true,//默认或者false的时候是以append的形式append到组件上
            scope:{},
            link: function (scope, element, attrs) {
                //初始化tamplate中的title属性
                scope.title = "点击此展开";
            },
            /*
            * controller和link都可以对数据源操作，执行顺序是先执行controller，一般会把处理数据逻辑和数据定义都放到link中，
            * 只有其他指令require当前指令的属性和方法时（会把被require的controller放到link的第四个参数中，其中，如果多个require的话会放到一个数组中。
            * 实现不同指令的互相调用），
            * 才会把处理逻辑或数据定义放到controller中。
            * */
            controller:function ($scope) {
                $scope.show = function () {
                    $scope.title = $scope.title == "点击此展开" ?  "点击此收起" :"点击此展开";
                    $scope.isShow = !$scope.isShow;
                }
            },
            template: '<div>'
            + '<div class="title" ng-click="show()">{{title}}</div>'
            + '<div class="body" ng-show="isShow" >这里是展开的内容</div>'
            + '</div>'
        }
    })
