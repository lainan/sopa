module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "script"
    },
    "rules": {
        "indent": [ "error", 4, { "ArrayExpression": "first", "SwitchCase": 1  } ],
        "linebreak-style": [ "error", "windows" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
        "strict": [ "error", "global" ],
        'no-console': ["error", { allow: ["log", "warn", "error"] }]
    }
};
