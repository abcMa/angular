var myapp = angular.module("myapp", []);
myapp.controller("todolist", function ($scope,$timeout) {
    $scope.vparr = [], $scope.parr = [], $scope.arr = [], $scope.donearr = [];
    //优先级
    $scope.priorityVal = "0";
    //新增任务
    $scope.add = function () {
        if (!$scope.todoitem || !$scope.todoitem === "") {
            return false;
        }
        switch ($scope.priorityVal) {
            case "0":
                $scope.arr.push({"text": $scope.todoitem, "priority": $scope.priorityVal, "hasdone": false});
                break;
            case "1":
                $scope.vparr.push({"text": $scope.todoitem, "priority": $scope.priorityVal, "hasdone": false});
                break;
            case "2":
                $scope.parr.push({"text": $scope.todoitem, "priority": $scope.priorityVal, "hasdone": false});
                break;
        }
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
    $scope.edit = function (item,evt) {
        item.isEditing = true;
        //fix显示input光标不聚焦
        var $editInput = evt.target;
        $scope.editInput = $editInput;
        $timeout(function(){
            angular.element($scope.editInput).next()[0].focus();
        },100);
    }
    //完成编辑
    $scope.editBlur = function (item) {
        item.isEditing = false;
    }
    //一键清空所有任务
    $scope.clear = function () {
        $scope.vparr = [], $scope.parr = [], $scope.arr = [], $scope.donearr = [];
    }
})