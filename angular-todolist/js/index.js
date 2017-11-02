var myapp = angular.module("myapp", []);
myapp.controller("todolist", function ($scope) {
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
    $scope.edit = function (t) {
        angular.element(t.target).css("display", "none");
        angular.element(t.target).next().removeClass("hidden");
    }
    //完成编辑，这里注意.find()不支持id和classname选择器.https://stackoverflow.com/questions/17283697/angularjs-how-to-find-using-jqlite
    $scope.editBlur = function (t) {
        angular.element(t.target).parent().find("p").css("display", "block");
        angular.element(t.target).addClass("hidden");
    }
    //一键清空所有任务
    $scope.clear = function () {
        $scope.vparr = [], $scope.parr = [], $scope.arr = [], $scope.donearr = [];
    }
})