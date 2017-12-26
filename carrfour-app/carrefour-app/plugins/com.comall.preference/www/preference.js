var exec = require('cordova/exec');

var Preference = function() {};

Preference.get = function(key, success, error) {
    exec(success, error, "Preference", "get", [key]);
};

module.exports = Preference;
