var deploy = {
  init: function(options, success, failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'initialize',
      [options]
    );
  },
  check: function(channel_tag, success, failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'check',
      [channel_tag]
    );
  },
  download: function(success, failure) {
  	cordova.exec(
  		success,
  		failure,
  		'Deploy',
  		'download',
  		[]
  	);
  },
  extract: function(success,failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'extract',
      []
    );
  },
  redirect: function(success, failure) {
  	cordova.exec(
  		success,
  		failure,
  		'Deploy',
  		'redirect',
  		[]
  	);
  },
  info: function(success, failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'info',
      []
    );
  },
  getVersions: function(success, failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'getVersions',
      []
    );
  },
  deleteVersion: function(version, success, failure) {
    cordova.exec(
      success,
      failure,
      'Deploy',
      'deleteVersion',
      [version]
    );
  }
};

module.exports = deploy;
