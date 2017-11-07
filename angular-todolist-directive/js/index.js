var myapp = angular.module("myapp", []);
myapp.controller("todolist", function ($scope, $timeout) {
    $scope.donearr = [], $scope.todoitem = "";
    $scope.add = function () {
        $scope.arr[$scope.priority].push({"text": $scope.todoitem, "priority": $scope.priorityVal, "hasdone": false});
    }
})
//下拉框指令
    .directive("prioritySelect", function () {
        return {
            restrict: "EA",
            replace: true,
            scope: {
                priorityVal: "=priority",//将下拉选择的值绑定到父域中的scope属性中
                Arr: "=arr"//将初始化数据结构绑定到父域中的scope属性中
            },
            link: function (scope) {
                scope.Arr = {
                    "vp": [],
                    "p": [],
                    "without": [],
                };
                scope.priorityVal = "without";
            },
            template: '<select class="priority-select" ng-model="priorityVal">' +
            '                <option value="{{key}}" ng-repeat="(key,val) in Arr track by $index">{{key|formatPriority}}</option>' +
            '            </select>'
        }
    })
    //进行中的任务指令
    .directive("myTask", function () {
        return {
            restrict: "EA",
            replace: true,
            scope: {},
            templateUrl: "my-task.html"
        }
    })
    //处理总数量大于9的
    .filter("formatPriority", function () {
        return function (input) {
            var obj = {
                "vp": "很重要/必须完成",
                "p": "重要/非必须完成",
                "without": "无优先级"
            }
            return obj[input];
        }
    })