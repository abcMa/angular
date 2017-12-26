module.exports = {
    env: {
        browser: true
    },
    extends: 'eslint:recommended',
    rules: {
        'no-console': ['warn'],
        'no-unused-vars': ['warn'],
        'no-cond-assign': ['warn'],
        'no-trailing-spaces': ['warn', {
            "skipBlankLines": false
        }],
        'no-whitespace-before-property': ['warn'],
        'space-infix-ops': ['warn'],
        'indent': ['warn', 4, {
            "SwitchCase": 1
        }],
        'brace-style': ['warn', '1tbs'],
        'no-multiple-empty-lines': ['warn'],
        'no-use-before-define': ['error', {
            'functions': false,
            'classes': true
        }],
        semi: ['error', 'always'],
        "no-empty": ['error', {
            "allowEmptyCatch": true
        }],
        "no-irregular-whitespace": ['error'],
        "eqeqeq": ['error', 'smart'],
        "no-redeclare": ['error'],
        "indent": ["error", 4, {
            "SwitchCase": 1
        }],
        "linebreak-style": ['warn', 'unix'],
        'angular/di-unused': ['warn']
    },
    plugins: [
        'angular'
    ],
    globals: {
        // base
        "_": true,
        "$": true,
        "ionic": true,
        "moment": true,
        "angular": true,
        // global vars
        "APP_LANG": true,
        "APP_CONFIG": true,
        "APP_USER": true,
        "APP_STATE_CODE": true,
        // env
        "wx": true,
        // cordova plugin global vars
        "cordova": true,
        "Camera": true,
        "wechatPay": true,
        "CMPickPhoto": true
    }
};
