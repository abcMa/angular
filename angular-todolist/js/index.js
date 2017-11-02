var myapp = angular.module("myapp", []);
myapp.controller("todolist", function ($scope) {
    $scope.vparr = [], $scope.parr = [], $scope.arr = [], $scope.donearr = [];
    var total = 0;
    //优先级
    $scope.priorityVal = "0";
    //新增任务
    $scope.add = function () {
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
    $scope.edit=function ($index,arr,val) {
        
    }
})