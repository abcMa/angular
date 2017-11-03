angular.module("myapp", [])
    .controller("cartController", function ($scope) {
        var arr = {
            "pageSize": 5,
            "pageNow": 1,
            "pageNum": 9,
            "products": [
                {
                    "pid": 1,
                    "name": "小米手机note1",
                    "price": 6.80,
                    "amount": 20,//库存
                    "curAmount": 1,//放入购物车时的数量
                    "pro-img": "https://img.alicdn.com/tps/i1/1918343177/TB2pzPmXMoQMeJjy1XaXXcSsFXa_!!0-juitemmedia.jpg_180x180q90.jpg_.webp"
                },
                {
                    "pid": 2,
                    "name": "小米手机note1",
                    "price": 6.80,
                    "amount": 20,
                    "curAmount": 2,
                    "pro-img": "https://img.alicdn.com/tps/i1/1918343177/TB2pzPmXMoQMeJjy1XaXXcSsFXa_!!0-juitemmedia.jpg_180x180q90.jpg_.webp"
                },
                {
                    "pid": 3,
                    "name": "小米手机note1",
                    "price": 6.80,
                    "amount": 20,
                    "curAmount": 2,
                    "pro-img": "https://img.alicdn.com/tps/i1/1918343177/TB2pzPmXMoQMeJjy1XaXXcSsFXa_!!0-juitemmedia.jpg_180x180q90.jpg_.webp"
                },
            ]
        };
        $scope.productList = arr;
        //商品总数量统计
        $scope.totalPrice = function () {
            var rlt = {
                tprice: 0,
                tnum: 0
            };
            angular.forEach($scope.productList.products, function (index) {
                rlt.tprice += index.price * index.curAmount;
                rlt.tnum += index.curAmount;
            })
            return rlt;
        }
        //增减商品数量
        $scope.updateNum = function (type, i) {
            if (type === "minus") {
                if ($scope.productList.products[i].curAmount > 1) {
                    $scope.productList.products[i].curAmount--;
                }
            } else {
                if ($scope.productList.products[i].amount > $scope.productList.products[i].curAmount) {
                    $scope.productList.products[i].curAmount++;
                }
            }
        }
        //删除商品
        $scope.removePro = function (i) {
            $scope.productList.products.splice(i, 1);
        }

    })
    //处理总数量大于9的
    .filter("exeNumFilter", function () {
        return function (input) {
            var result = "";
            return input > 9 ? "9+" : input;
        }
    })