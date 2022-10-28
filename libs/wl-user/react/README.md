<!--
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-21 15:03:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-25 18:20:59
 * @Description: file description
-->

# wl-user-react

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

## Hooks

- useWlUserReact

  provider 提供的信息及工具

  ```typescript
  {
    // 所有注入的signer实例
    signers: Signer[];
    // 当前登录的signer
    signer: Signer | null | undefined;
    // 用户信息
    user: User;
    // 是否登录
    isLogin: boolean;
    // 当前执行的action状态数据
    userActionState: WlUserActionState;
    // 获取指定的签名者对象
    getSigner: (signerType: SignerType) => Signer | undefined;
    // 验证是否绑定了某个账号
    validateBindAccount: (accountType: AccountType) => boolean;
    // 打开modal的触发器
    dispatchModal: (params: DispatchActionModalParams) => void;
    // 直接开始签名认证流程的触发器（省去打开modal的步骤）
    dispatchAction: (params: DispatchActionParams) => void;
  }
  ```

- usePermissions

  所有权限相关的信息及工具

  ```typescript
  {
    isCreator: boolean;
    isAdmin: boolean;
    isVIP: boolean;
    checkTaskAllowed: (taskId: number) => boolean;
    checkProjectAllowed: (projectId: number) => boolean;
    checkContributionAllowed: (communityId: number) => boolean;
  }
  ```

## Components

- WlUserReactProvider

  - 参数
    - signers ：签名者的实例对象数组
    - valueChange (可选): provider 的 value 变化时触发
  - 案例

    ```typescript
    import { Twitter, Discord, Metamask, Phantom, Martian } from '@ecnft/wl-user-core'
    import { WlUserReactProvider } from "@ecnft/wl-user-react";

    const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID || ''
    const TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_CALLBACK_URL || ''
    const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID || ''
    const DISCORD_CALLBACK_URL = process.env.REACT_APP_DISCORD_CALLBACK_URL || ''

    const signers = [
        new Twitter({ twitterClientId: TWITTER_CLIENT_ID, oauthCallbackUri: TWITTER_CALLBACK_URL }),
        new Discord({ discordClientId: DISCORD_CLIENT_ID, oauthCallbackUri: DISCORD_CALLBACK_URL }),
        new Metamask(),
        new Phantom(),
        new Martian(),
    ]

    ......

    <WlUserReactProvider signers={signers}>

    ......

    </WlUserReactProvider>
    ```

- LoginButton

  - 登录按钮, 显示登录前后用户状态
  - 参数
    - {...Button.Props}
    - onClick ：未传递则每次点击打开登录 modal，传递则阻止打开 modal，调用此事件回调
  - 案例

    如果登录了就去 profile, 没登录就打开登录 model

    ```typescript
    import { useWlUserReact, LoginButton, WlUserModalType } from  "@ecnft/wl-user-react";

    ......

    const { isLogin, dispatchModal } = useWlUserReact()

    ......

    <LoginButton
        onClick={() => (isLogin ? navigate('/profile') : dispatchModal({ type: WlUserModalType.LOGIN }))}
    />
    ```

- BindWithSignerButton

  - 绑定按钮, 显示当前签名者的绑定状态信息
  - 参数
    - {...Button.Props}
    - signerType : 签名者的类型，从@ecnft/wl-user-core 中获取
  - 案例

    展示不同的签名者绑定按钮

    ```typescript
    import { BindWithSignerButton } from  "@ecnft/wl-user-react";
    import { SignerType } from  "@ecnft/wl-user-core";

    ......

    <BindWithSignerButton signerType={SignerType.METAMASK} />
    <BindWithSignerButton signerType={SignerType.PHANTOM} />
    <BindWithSignerButton signerType={SignerType.MARTIAN} />
    <BindWithSignerButton signerType={SignerType.TWITTER} />
    <BindWithSignerButton signerType={SignerType.DISCORD} />

    ```

- UserAvatar

  - 用户头像
  - 参数
    - {...Image.Props}
    - user : 头像所属用户信息，如果传了则展示指定用户头像，没传则展示当前用户头像
    - src : 传入 src 强制显示此 src 对应的图片 (不采用 user 配置)
  - 案例

    展示不同的签名者绑定按钮

    ```typescript
    import { UserAvatar } from  "@ecnft/wl-user-react";

    ......
    // 显示当前登录用户头像
    <UserAvatar />

    // 显示指定用户头像
    <UserAvatar user={{id,avatar}} />

    // 显示指定图片
    <UserAvatar src={src} />

    ```

## 工具

- handleAuthFailed

  wl-user-react 内部处理 token 授权失效的过程，可以导出放到当前项目中，让当前项目认证失效的反馈与 wl-user-react 处理的一致

  - 案例 ：将 wl-user-react 注入到项目的 axios 封装中

  ```typescript

  // **/utils/axiosInstance.ts

  // 处理401响应
  let handleAxiosResponse401: () => void | undefined
  export const injectHandleAxiosResponse401 = (func: () => void) => {
    handleAxiosResponse401 = func
  }
  // 添加响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      // 对响应数据做点什么
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        if (handleAxiosResponse401) handleAxiosResponse401()
        return
      } else {
        // 对响应错误做点什么
        return Promise.reject(error.response?.data || error)
      }
    },
  )

  ......

  // app.ts
  import { handleAuthFailed } from '@ecnft/wl-user-react'
  import { injectHandleAxiosResponse401 } from '**/utils/axiosInstance.ts'
  // 将wl-user-react的内部处理认证失效的逻辑注入到 当前项目axios的401处理程序中
  injectHandleAxiosResponse401(handleAuthFailed)

  ```