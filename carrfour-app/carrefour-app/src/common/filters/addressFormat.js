/**
 * 用于格式化用户的详细地址 ，接口传回的收货地址以特殊字符分割，前端需要替换为模板显示
 *
 */
angular.module('app.filters').filter('addressFormat',function($translate) {

	return function(address) {

		if(!address) {
			return address;
		}
        else if (address.allDeliveryName) {
            return address.allDeliveryName;
        }
        else {

		    //详细地址模板
		    var addressPartTpl=[
				$translate.instant('user.address.road'),
				$translate.instant('user.address.figure'),
				$translate.instant('user.address.estate'),
				$translate.instant('user.address.buildingNo'),
				$translate.instant('user.address.room')
		    ];

		    var addressStr="";

		    //判断参数类型
		    var isObject = typeof(address) === 'object';

		    if(isObject) {
			    var index = 0;

			    addressStr = address.road + " " + addressPartTpl[index++] + " " + address.lane + " " +
                    addressPartTpl[index++] + " " + address.village +  " " + addressPartTpl[index++] +
				    " " + address.buildingNumber +  " " + addressPartTpl[index++] + " " + address.roomNumber + " " + addressPartTpl[index++];
		    }
            else {
			    //分割详细地址
			    var addressArr = address.split('%$'),
                    i;

                if(addressArr.length == addressPartTpl.length) {
				    for(i in addressArr) {
					    addressStr+= addressArr[i]+" "+addressPartTpl[i] + " ";
				    }
	            }
                else {
	        	    for(i = 0 ; i < addressArr.length; i++) {
					    addressStr+= addressArr[i] + " " + addressPartTpl[i+addressPartTpl.length-addressArr.length] + " ";
				    }

	        	    addressStr = addressStr;
	            }
		    }

            return addressStr;
        }
	};
});
