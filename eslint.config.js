// import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";

export default [
  // { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        // project: "./tsconfig.json",
        tsconfigRootDir: "./",
        extraFileExtensions: [".vue"],
        ecmaVersion: 'ESNext',
        sourceType: "module",
      },
    },
    rules: {
      "vue/max-attributes-per-line": "off",
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/explicit-module-boundary-types": 0,
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "no-implied-eval": "off",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/unbound-method": "error",
      "vue/html-indent": ["warn", 4],
      "vue/no-mutating-props": "off",
      "vue/multi-word-component-names": "off",
      "vue/singleline-html-element-content-newline": "error",
    },
  },
];
