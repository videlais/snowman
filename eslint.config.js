import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                // Node.js globals
                module: 'readonly',
                require: 'readonly',
                exports: 'readonly',
                global: 'readonly',
                
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                
                // Jest/Testing globals
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
                
                // Project-specific globals
                jQuery: 'readonly',
                $: 'readonly',
                _: 'readonly',
                marked: 'readonly',
                Story: 'readonly',
                Passage: 'readonly',
                story: 'writable'
            }
        },
        rules: {
            "brace-style": [
                "error",
                "stroustrup",
                { "allowSingleLine": true }
            ],
            "comma-dangle": "off",
            "curly": ["error", "all"],
            "indent": [
                "warn",
                "tab",
                { "SwitchCase": 1 }
            ],
            "max-len": [
                "warn",
                100,
                {
                    "ignoreUrls": true,
                    "ignoreStrings": true,
                    "ignoreTemplateLiterals": true,
                    "ignoreComments": true
                }
            ],
            "newline-after-var": "off", // Too strict for this codebase
            "no-console": [
                "error",
                { "allow": ["warn"] }
            ],
            "no-extra-semi": "off",
            "no-mixed-spaces-and-tabs": "off",
            "no-trailing-spaces": [
                "error",
                { "skipBlankLines": true }
            ],
            "no-useless-escape": "warn",
            "quote-props": "off",
            "semi": [
                "error",
                "always"
            ]
        }
    }
];