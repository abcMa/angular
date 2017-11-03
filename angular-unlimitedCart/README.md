cart功能点：
1，初始化购物车列表（通过静态数据遍历）---ok
2，对每个商品的数量操作需要同步总金额和总数量
（1）对每个商品数量增加或者减少，总数量和总金额增加或减少。---ok
（2）减少到0，不允许进去操作减操作。---ok
（3）加操作不能超过库存。---ok
（4）增加或者减少，需要同步到每个商品的“小计”字段上。---ok
3，金额字段都保留两位小数---ok
4，总数量需要处理大于9处理成9+，为0时，不显示。---ok
5，商品列表一次加载5条数据，超出点击“加载更多”显示。pageSize:5----ok
6，商品删除功能。删除该商品，购物车总数和总金额需要同步更新。---ok
完成率：100%
主要功能
1,主要功能
![image](https://github.com/abcMa/angular/blob/master/angular-unlimitedCart/images/1.jpg)
2，加载更多后的显示
![image](https://github.com/abcMa/angular/blob/master/angular-unlimitedCart/images/2.jpg)
主要知识点：
1，filter的使用；包括内置过滤器和自定义过滤器。很便捷，自定义filter也方便复用。
2，单个商品数量的更改会联动商品价格，购物车总金额，购物车商品总数量变化。这些数量的变化只关心怎么操作数据，其次再关心
显示。
3，按照“给出功能-设计数据结构-页面的不同状态展示是怎么通过数据的变化相关联-实现页面”的思路去实现整个项目。

ANGULAR权威指南--13章依赖注入
1，一个列子说明anglar使用依赖注入
angular.module("myapp",[])
    .controller("myController",function($scope,otherApp){//这里注入了otherApp对象
        otherApp.result("hello");//输出“hello i am a otherApplation”
    })
    //自定义一个服务，返回带属性或者方法的对象
    .factory("otherApp",function(){
        return {
            result:function(str){
                console.log(str+"i am a otherApplaction");
            }
        }
    })
2,依赖注入有什么优点
（1）不会污染全局作用域，以传参的形式建立依赖关系
（2）只有在需要的时候才被实例化
（3）使耦合度降低，可扩展性增强
3，anglaur通过$inhector负责查找和加载依赖的组件
4，angular提供推断式注入声明，显式注入声明，行内注入声明三种方式检查是否有注入声明。
5，$injector对象：
 （1）annotate(fn/arr) 接受一个函数或者数组，返回目标函数的名称数组。