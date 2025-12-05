const {
    defineConfig,
    globalIgnores,
} = require("eslint/config");
const stylistic = require('@stylistic/eslint-plugin');
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("typescript-eslint");
const globals = require("globals");
const js = require("@eslint/js");

module.exports = defineConfig(
    js.configs.recommended,
    typescriptEslint.configs.recommendedTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked,
    [{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.eslint.json",
        },

        globals: {
            ...globals.node,
            ...globals.jest,
        },
    },

    plugins: {
        "@stylistic": stylistic,
        "typescript-eslint": typescriptEslint,
    },

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],
        "@typescript-eslint/no-var-requires": "error",
        "no-console": "off",
        "no-control-regex": "off",
        "prefer-const": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-template": "error",
        "template-curly-spacing": "error",
        "eqeqeq": ["error", "always"],
        "no-multiple-empty-lines": ["error", {
            max: 2,
            maxEOF: 1,
        }],
        "comma-dangle": ["error", "always-multiline"],
        "semi": ["error", "always"],
        "@stylistic/quotes": ["error", "single", {
            avoidEscape: true,
            allowTemplateLiterals: "always"
        }],
        "indent": ["error", 2],
        "max-len": ["warn", {
            code: 120,
            ignoreUrls: true,
            ignoreStrings: true,
        }],
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-new-func": "error",
        "no-script-url": "error",
    },
}, globalIgnores([
    "**/.eslintrc.js",
    "eslint.config.js",
    "**/dist/",
    "**/node_modules/"
]), {
    files: ["**/*.test.ts", "**/*.spec.ts"],

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
    },
}]);