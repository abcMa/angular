# Introduction

Picker View is a special kind of input component that looks like an old cash-register
where multiple wheels have digits written on them, and rotates as you make a selection.

Checkout the [examples of picker views](https://goo.gl/6izqrZ).

# Compatibility

Currently, only works with ios.

# Installation

Use the following command to install the plugin.

```bash
$ git clone http://github.com/panda4126/cordova-pickerview-plugin.git ../cordova-pickerview-plugin
$ cordova plugin add ../cordova-pickerview-plugin
```

# Usage

See the example below:

```javascript

var config = [
  {
    options:["Butter","Milk","Margarine","Cheese"],
    default:["Butter"],
    width: 200
  },
  {
    options:["1oz","2oz","3oz","4oz","5oz","6oz","7oz","8oz"],
    default:["1oz"],
    width: 100
  }
]

var success = function(selections) {
  console.info("Ingredient: " + selections[0] + ", Qty: " + selections[1]);
}

var error = function(e) {
  console.error(e);
}

PickerView.show(config).then(success,error);
```

Enjoy!

Contact yusuke@gmail.com for questions / suggestions.
