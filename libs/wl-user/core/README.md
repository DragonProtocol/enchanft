<!--
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-24 10:14:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-24 10:25:18
 * @Description: file description
-->

# wl-user-core

## 如何引入

1. 直接引入使用
   ```typescript
   import { ... } from "@ecnft/wl-user-react";
   ```
2. 如果引入找不到模块，检查项目目录下的 tsconfig.app.json 是否如下配置，检查并按如下配置修改
   ```json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "../../dist/out-tsc",
       "types": ["node"]
     },
     "files": [
       "../../node_modules/@nrwl/react/typings/cssmodule.d.ts",
       "../../node_modules/@nrwl/react/typings/image.d.ts"
     ],
     "exclude": [
       "jest.config.ts",
       "**/*.spec.ts",
       "**/*.test.ts",
       "**/*.spec.tsx",
       "**/*.test.tsx",
       "**/*.spec.js",
       "**/*.test.js",
       "**/*.spec.jsx",
       "**/*.test.jsx"
     ],
     "include": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"]
   }
   ```

## 提供的工具

- setApiBaseUrl (必要)

  设定 api 的 host

  ```typescript
  import { setApiBaseUrl } from '@ecnft/wl-user-core';

  ......

  setApiBaseUrl(process.env.REACT_APP_API_BASE_URL)

  ```
