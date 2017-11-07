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
      影响父。注意指令中的属性值需要{{}}表达式。<br>
    b : 双向绑定--{表达式:'=指令属性/='}，父子互相影响。注意指令中的属性值写参数。<br>
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


