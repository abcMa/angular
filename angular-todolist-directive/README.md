11.6日<br>
### 功能点<br>
1,更改用ng-click触发编辑状态，改为用动态拼接属性来控制编辑状态；理解动态增加属性。<br>
2，更改todolist数据结构，把之前的三个数组改为一个对象；<br>
3，直接用更改完的数据结构渲染select（任务优先级的下拉框），使得目前页面中所有展示的内容依赖数据结构展现。<br>
#### 看书总结<br>
###### 指令：<br>
1，指令是封装了一个可以在浏览器运行的dom元素，并对此dom扩展了一些功能和方法。<br>
2，return对象中的属性<br>
   （1）指令用4种方式进行声明(return对象中的restrict属性) <br>
        a,用元素E:<my-directive></my-directive> <br>
        b,用属性和默认值A：<div my-directive="值/表达式"></div> 列如angular中的ng-click <br>
        c,类名C：<div class="my-directive:值/表达式"></div>   <br>
        d,注释M：
        注：属性是声明指令最常用的方式，因为他们能在老版本包括ie的多有浏览器中正常工作，避免重注释的方式声明指令。<br>
3，tempalte
（1）一段文本,如果里边有多个dom元素，必须用一个父元素包含，且每一行都需要有反斜线\。具体实例中最好引入templateUrl引入dom模板。<br>
（2）或者两个形参的function<br>
如果是{{expression}}代表访问作用域

11.7日<br>
4，tempalteURL：<br>
（1）html文件地址字符串。本地直接写相对路径的html文件会报错。因为angular会通过自己的安全机制做出限制。<br>
（2）返回html文件地址字符串的方法。<br>
5，scope：相关例子都放在demo.html中<br>
scope的值有以下几种情况：<br>
（1）false：父子作用域共享scope属性，父影响子，子影响父；---默认值<br>
（2）true：父子作用域共享scope属性，父影响子，子不影响父<br>
（3）{}：子不共享父scope属性，父子隔离。--此种情况在开发过程中很少用到,注意如果要用隔离作用域的情况，需要设置restrict的值为'A'。<br>
隔离作用域会从父作用域独立出来，这种方式可以很好的重用组件。但是如果想重用组件，且要和父作用域某几个属性交互时，可以使用绑定策略进行设置。<br>
    a : 单向绑定--{表达式:'@指令属性/@'}，如果指令属性和表达式相同，则直接可以'@'替代。此种方式是单向绑定父作用域的属性，父会影响子，子变化不会<br>
      影响父。<br>
    b : 双向绑定--{表达式:'=指令属性/='}，父子互相影响。<br>
    c : 向父域中传递一个表达式/方法--{表达式:'&指令属性/&'}，向父域传递一个表达式或者方法名，然后父域scope中执行。<br>
      注意：如果指令想给父scope中的执行方法传参，需要用fn({msg:me})形式传参。msg代表参数名,属性指令的方法参数名需要<br>
            和此名保持一致，me代表实际的参数值<br>
(todo)-scope属性的@和=，为什么在定义指令属性的时候一个是表达式name={{name}}，一个是直接属性name="name"？和angular的表达式{{}}和内置指令中的值有区别吗？<br>
这里有回答：<br>
（https://stackoverflow.com/questions/14050195/what-is-the-difference-between-and-in-directive-scope-in-angularjs）<br>
@是--evaluated value of the DOM attribute;It is called one-way binding, which means you cannot modify the value of parentScope properties.<br>
=是-- a parent scope property;<br>

#### 完成度<br>
80%<br>


11.8日：例子在1008.html中<br>
6，transclude：决定元素下的html代码是否嵌入到模板中<br>
true和false两个值<br>
（1）false：默认值<br>
（2）true:允许将任意内容嵌入到指令中，常用来创建可复用的组件。在指令中配合ng-transclude指令，表示从声明指令dom中取出的内容<br>
放到ng-transclude中。此值不能使指令中的controller正常监听数据模型的变化。<br>
7，controller:<br>
可以是一个controller的名字的字符串，也可以是一个函数；<br>
（1）当值为字符串时，代表执行当前应用（当前ng-app）下的同名controller。<br>
（2）当为一个函数时，主要提供和其他指令互动的行为，其他操作本指令的一些功能建议在link函数中定义。<br>
     可以传入多个参数（依赖多个服务），<br>
    常用是$scope：(与指令元素相关联的作用域),<br>
    $element（当前指令对应的元素的最外层元素）,<br>
    $attrs：（当前指令的所有属性和对应值的对象）,<br>
    $transclude：（传入一个参数用来操作dom或者增加dom）,需要配合指令中transclude属性为true使用。方法中的参数clone得值是声明指令中的dom。<br>
8，require:<br>
字符串或者数组；字符串代表当前应用下某个指令的名字，数组代表当前应用下某几个controller名字的数组，当为字符串时require<br>
会将此控制器在link函数的第四个参数中作为服务注入到该指令中(数组同义)。<br>
require查找控制器，有以下几种方式<br>
（1）?:在当前应用中（当前的ng-app）查找控制器，如果没有用null代替。<br>
（2）^:指令会在父集的指令中查找require参数所指定的控制器。<br>
（3）?^:在当前指令和父集指令中查找<br>
（4）没有前缀：将会在自身的控制器中查找，没有找到报错。<br>
完成度：<br>
90%<br>

10,9日<br>
1,完成tab切换demo<br>
2，complie:对象或者函数，表示在指令和实时数据被放到dom之前操作dom。complie和link函数二者只能有一个，<br>
如果两个都出现了，那么会把complie的return的函数作为link函数调用，定义的link函数则被忽略。<br>
3，link:函数，扩展指令元素的功能性（定义指令的行为），在模板编译完成并且和作用域完成关联后被执行。<br>
参数：<br>
（1）scope：指令用来在其内部注册监听器的作用域<br>
（2）iElement：使用此指令的元素<br>
（3）iAttrs:使用此指令的元素的属性的列表<br>
（4）otherCtrlName/otherCtrlNameArr：被注入的控制器<br>
4，preLink,postLink:在angular处理linking过程中，首先会执行此函数，其次才执行postLink函数，完成dom和指令作用域等关联。<br>
所以一般我们定义的link函数就是指postLink;<br>
-controller，link，complie有什么区别<br>
controller负责一些和其他指令交互的行为，可以看做是一个api供其他指令调用，而link用来扩展本指令的功能，这样的思想是angular主张的思想。<br>
complie和link代表angular中指令的生命周期<br>
-angular是怎么处理指令的<br>
编译阶段<br>
angular会遍历整个文档，根据js中定义的属性和方法来处理页面上的指令。我们可以用complie函数操作dom树在模板函数返回之前（模板函数时在对指令<br>
和字模板进行遍历或编译后返回的一个函数）。<br>
链接阶段<br>
一个指令编译之后就可以用link函数对其绑定数据，设置监听等dom操作。<br>
完成度：<br>
90%<br>


scope使用绑定策略中的属性，相当于在当前作用域下创建了一个属性。<br>

10.10日：
1,依赖注入：在需要的地方通过参数传入需要依赖的服务。
通过传入参数数组的方式建立依赖关系，例如：.controller("myCtroller",function ($scope, $timeout){//直接使用依赖服务的属性和方法$timeout.xxx})
2,更改todolist为用directive实现：
（1）根据数据结构设计指令，及指令的嵌套关系
（2）数据交互：未完成
未完成
完成度：
50%


















