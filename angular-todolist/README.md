#### todolist功能点：
1,增加任务<br>
2,正在进行的任务<br>
（1）输入任务生成任务列表。<br>
（2）任务列表每个任务都可以删除，勾选（完成任务），编辑任务。<br>
（3）正在进行的任务需要在右侧显示总数<br>
3,已经完成的任务<br>
（1）勾选任务需要把相应的任务放在“已完成的任务”列表中。<br>
（2）“已完成的任务”可以编辑，删除，样式需要和正在进行的任务有区别。<br>
（3）已经完成的任务需要在右侧显示总数<br>
4,一键清空<br>
（1）一键清空所有进行的和完成的任务，注意需要清空相应的总量。<br>
5,设置任务完成时间（选填）。需要细化功能点-----todo<br>
6,设置任务的优先级<br>
（1）优先级分为：很重要/必须做完，不重要/不做完也行。注意，没选优先级的默认被划为“无优先级”目录下。<br>
（2）设置正在进行或者新建时的任务的优先级。<br>
（3）任务根据优先级排列到进行中的任务。<br>
（4）在进行中的任务，从“很重要”到“不重要”可以相互拖拽移动。-----todo<br>
（5）很重要/必须做完，不重要/不做完也行，无优先级，可以toggle展开合起。<br>
#### 完成度：
84%。以上功能点被标识为ok表示已经完成。<br>
#### 实现:
1,主要功能<br>
![image](https://github.com/abcMa/angular/blob/master/angular-todolist/images/1.jpg)<br>
2,收起进行中任务tab<br>
![image](https://github.com/abcMa/angular/blob/master/angular-todolist/images/2.jpg)<br>

#### 遇到问题-解决问题：
（1）设计不同优先级任务的数据结构；在设计优先级任务时考虑要用一个数组承载任务数据，还是用三个数组承载任务数据。<br>
       一个数组承载数据会涉及到优先级标题的显示问题，最后更改为三个数组，每个数组各自承载相对应的优先级任务数据。<br>
（2）编辑任务时，考虑给dom增加contenteditable属性，还是直接用一个input来对任务进行编辑；给dom增加contenteditable属性，<br>
       当用户编辑完后，失去焦点（编辑完成）也就是ng-blur事件，在p标签上不生效，故在编辑任务时使用input替换p标签，<br>
       失去焦点后执行ng-blur事件，并同步了数据。<br>
（3）什么时候用directive？<br>
       a:和业务无关的经常操作的dom。<br>
       b:频繁操作dom<br>



