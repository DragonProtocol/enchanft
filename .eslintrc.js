module.exports = {
  root: true,
  ignorePatterns: ['.eslintrc.js'],
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    "tsconfigRootDir": __dirname,
    "project": [
      "./tsconfig.eslint.json",
      "./apps/*/tsconfig.json",
      "./libs/*/tsconfig.json"
    ]
  },
  rules: {
    //解决 styled 结构顺序问题
    "@typescript-eslint/no-use-before-define": "off",

    //无障碍验证
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",

    //浏览器对 media 已有良好的支持
    "jsx-a11y/media-has-caption": "off",

    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",

    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/restrict-template-expressions": "off",

    // 不限制js的语法 （如：不禁止使用for of语法）
    "no-restricted-syntax": "off",
    // 允许在for循环中使用一元运算符 ++,--
    "no-plusplus": [
      "error",
      {
        "allowForLoopAfterthoughts": true
      }
    ],

    //旧版本的 React 验证
    "react/react-in-jsx-scope": "off",
    //设置可以直接展开 props
    "react/jsx-props-no-spreading": "off",

    // 组件的可选参数不强制要求设置默认值，函数组件直接忽略此规则
    "react/require-default-props": [
      1,
      {
        "functions": "ignore"
      }
    ],

    // 关闭检查函数组件的定义方式
    "react/function-component-definition": "off"

    // "no-shadow": "off",
    // "@typescript-eslint/no-shadow": "off"
  }
}
