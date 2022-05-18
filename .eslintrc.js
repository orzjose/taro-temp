module.exports = {
  "extends": ["airbnb"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "useJSXTextNode": true,
    "project": "./tsconfig.json"
  },
  "rules": {
    "max-len": ["error", { "code": 180 }],
    "linebreak-style": ["off", "windows"],
    "react/jsx-filename-extension": [1, {
      "extensions": [".js", ".jsx", ".ts", ".tsx"]
    }],
    "react/static-property-placement": 0,
    "react/state-in-constructor": 0,
    "react/self-closing-comp": 0,
    /** 定义 propTypes */
    "react/prop-types": 0,
    /** JSX 文件必须包含 react */
    "react/react-in-jsx-scope": 0,
    /** props 需解构再使用 */
    "react/destructuring-assignment": 0,
    "react/sort-comp": 0,
    /** 不能使用索引作为 key */
    "react/no-array-index-key": 0,
    "import/no-unresolved": 0,
    /** 首选默认导出 */
    "import/prefer-default-export": 0,
    "no-console": 0,
    "global-require": 0,
    /** 驼峰命名法 */
    "camelcase": 0,
    /** class 成员间需要空行 */
    "lines-between-class-members": 0,
    /** 空代码块 */
    "no-empty": 0,
    "no-shadow": 0,
    "import/extensions": 0,
    "class-methods-use-this": 0,
    "no-unused-vars": 0,
    "no-redeclare": 0,
    "react/no-deprecated": 0,
    "comma-dangle": ["error", "never"],
    "semi": ["error", "never"],
    "arrow-body-style": 0,
    "arrow-parens": 0,
    "jsx-quotes": [1, "prefer-single"]
  },
  "globals": { "wx": true, "CDN_URL": true, "VERSION": true }
}
