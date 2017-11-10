angular.module("myapp", [])
    .controller("todolist", function ($scope, $timeout) {
        $scope.donearr = [], $scope.todoitem = "";
        $scope.Arr = {
            "vp": [],
            "p": [],
            "without": [],
        };
        //选择优先级的下拉框默认值
        $scope.selectVal = $scope.Arr.without;
        //优先级
        $scope.priorityVal = "without";
        //新增任务
        $scope.add = function () {
            if (!$scope.todoitem || !$scope.todoitem === "") {
                return false;
            }
            $scope.Arr[$scope.priorityVal].push({
                "text": $scope.todoitem,
                "priority": $scope.priorityVal,
                "hasdone": false
            });
            $scope.todoitem = "";
        }
        //完成当前任务
        $scope.done = function (i, arr, item) {
            arr.splice(i, 1);
            $scope.donearr.push(item);
        }
        //删除当前任务
        $scope.remove = function (i, arr) {
            arr.splice(i, 1);
        }
        //编辑当前任务
        $scope.edit = function (item, evt) {
            item.isEditing = true;
            //fix显示input光标不聚焦
            var $editInput = evt.target;
            $scope.editInput = $editInput;
            $timeout(function () {
                angular.element($scope.editInput).next()[0].focus();
            }, 100);
        }
        //完成编辑
        $scope.editBlur = function (item) {
            item.isEditing = false;
        }
        //一键清空所有任务
        $scope.clear = function () {
            angular.forEach($scope.Arr, function (key, val) {
                $scope.Arr[val] = [];
            })
            $scope.donearr = [];
        }
    })

    .directive("myTask", function () {
        return {
            restrict: "EA",
            replace: true,
            transclude: true,
            template: '<div class="taskWarp" ng-transclude></div>'
        }
    })
    .directive("myTasking", function () {
        return {
            restrict: "EA",
            replace: true,
            transclude: true,
            template: '<div class="tasking" ng-transclude></div>'
        }
    })
    .directive("myTasked", function () {
        return {
            restrict: "EA",
            replace: true,
        }
    })
    .directive("taskItem", function () {
        return {
            restrict: "EA",
            replace: true,
            transclude:true,
            template: '<div class="taskItem" ng-transclude></div>'
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