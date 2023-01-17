<!--
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-21 15:03:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 17:10:35
 * @Description: file description
-->

# wl-user-react

## Installation

**npm**

```
npm install @ecnft/wl-user-react
```

**yarn**

```
yarn add @ecnft/wl-user-react
```

**pnpm**

```
pnpm add @ecnft/wl-user-react
```

## Getting started

**app.tsx**

```typescript
import {
  twitterAuthorizer,
  discordAuthorizer,
  metamaskAuthorizer,
  phantomAuthorizer,
  martianAuthorizer,
  setApiBaseUrl,
  WlUserReactProvider,
  WlUserReactContextType,
} from '@ecnft/wl-user-react';
import View from './view';

// 设定不同环境使用的api基础路径
setApiBaseUrl(process.env.REACT_APP_API_BASE_URL);

// 初始化要使用的authorizers(签名授权者)
const TWITTER_CLIENT_ID = process.env.REACT_APP_TWITTER_CLIENT_ID;
const TWITTER_CALLBACK_URL = process.env.REACT_APP_TWITTER_CALLBACK_URL;
const DISCORD_CLIENT_ID = process.env.REACT_APP_DISCORD_CLIENT_ID;
const DISCORD_CALLBACK_URL = process.env.REACT_APP_DISCORD_CALLBACK_URL;
const authorizers = [
  twitterAuthorizer({
    twitterClientId: TWITTER_CLIENT_ID,
    oauthCallbackUri: TWITTER_CALLBACK_URL,
  }),
  discordAuthorizer({
    discordClientId: DISCORD_CLIENT_ID,
    oauthCallbackUri: DISCORD_CALLBACK_URL,
  }),
  metamaskAuthorizer(),
  phantomAuthorizer(),
  martianAuthorizer(),
];

function App() {
  // 当需要在WlUserReactProvider外面使用内部能力时，可以尝试存储此wlUserReactValue
  const [wlUserReactValue, setWlUserReactValue] = useState<
    WlUserReactContextType | undefined
  >(undefined);
  console.log({ wlUserReactValue });

  return (
    <WlUserReactProvider
      authorizers={authorizers}
      valueChange={(value) => setWlUserReactValue(value)}
    >
      <View />
    </WlUserReactProvider>
  );
}

export default App;
```

**view.tsx**

```typescript
import {
  AuthorizerType,
  AccountType,
  useWlUserReact,
  usePermissions,
  LoginButton,
  BindWithAuthorizerButton,
  UserAvatar,
  WlUserModalType,
  WlUserActionType,
} from '@ecnft/wl-user-react';

function View() {
  const {
    // 所有注入的authorizer实例
    authorizers,
    // 当前登录使用的authorizer
    authorizer,
    // 用户信息
    user,
    // 是否登录
    isLogin,
    // 获取指定的签名者对象
    getAuthorizer,
    // 验证是否绑定了某个账号
    validateBindAccount,
    // 获取绑定的账号
    getBindAccount,
    // 打开modal的触发器
    dispatchModal,
    // 指定行为的触发器
    dispatchAction,
  } = useWlUserReact();

  const {
    // 当前登录用户 是否是 creator
    isCreator,
    // 当前登录用户 是否是 admin
    isAdmin,
    // 当前登录用户 是否是 vip
    isVIP,
    // 检测当前登录用户 是否有指定 task 的资源获取权限
    checkTaskAllowed,
    // 检测当前登录用户 是否有指定 project 的资源获取权限
    checkProjectAllowed,
    // 检测当前登录用户 是否有指定 community 的资源获取权限
    checkContributionAllowed,
  } = usePermissions();
  return (
    <div>
      <h2>data ————————————————————————————————————————</h2>
      <p>token: {user.token}</p>
      <p>userinfo: {JSON.stringify(user)}</p>
      <p>isLogin: {isLogin}</p>
      <p>isCreator: {isCreator}</p>
      <p>isAdmin: {isAdmin}</p>
      <p>isVIP: {isVIP}</p>
      <p>isBindTwitter: {validateBindAccount(AccountType.TWITTER)}</p>
      <p>isBindDiscord: {validateBindAccount(AccountType.DISCORD)}</p>
      <p>isBindSolana: {validateBindAccount(AccountType.SOLANA)}</p>
      <p>isBindEvm: {validateBindAccount(AccountType.EVM)}</p>
      <p>isBindAptos: {validateBindAccount(AccountType.APTOS)}</p>
      <h2>button components ————————————————————————————————————————</h2>
      /** 登录按钮-默认行为：点击始终打开登录modal */
      <LoginButton />
      /** * 登录按钮-自定义行为 * 未登录：点击打开登录modal * 已登录：点击跳转到profile页面
      */
      <LoginButton
        onClick={() =>
          isLogin
            ? navigate('/profile')
            : dispatchModal({ type: WlUserModalType.LOGIN })
        }
      />
      /** * 根据AuthorizerType 渲染指定的绑定按钮，自带绑定和解绑功能 */
      <BindWithAuthorizerButton
        authorizerType={AuthorizerType.EVM_WALLET_KIT}
      />
      <BindWithAuthorizerButton
        authorizerType={AuthorizerType.METAMASK_WALLET}
      />
      <BindWithAuthorizerButton
        authorizerType={AuthorizerType.PHANTOM_WALLET}
      />
      <BindWithAuthorizerButton
        authorizerType={AuthorizerType.MARTIAN_WALLET}
      />
      <BindWithAuthorizerButton authorizerType={AuthorizerType.TWITTER} />
      <BindWithAuthorizerButton authorizerType={AuthorizerType.DISCORD} />
      <h2>other components ————————————————————————————————————————</h2>
      // 显示当前登录的用户头像
      <UserAvatar />
      // 显示指定用户头像
      <UserAvatar user={{ id, avatar }} />
      // 显示指定图片
      <UserAvatar src={src} />
      <h2>
        使用dispatchModal，手动打开modal
        ————————————————————————————————————————
      </h2>
      <button onClick={() => dispatchModal({ type: WlUserModalType.LOGIN })}>
        打开登录modal
      </button>
      /** * 打开使用 指定方式 进行绑定的modal，下方值替换到payload * AuthorizerType.DISCORD,
      AuthorizerType.METAMASK, AuthorizerType.PHANTOM, AuthorizerType.MARTIAN */
      <button
        onClick={() =>
          dispatchModal({
            type: WlUserModalType.BIND,
            payload: AuthorizerType.TWITTER,
          })
        }
      >
        打开使用 twitter 进行绑定的modal
      </button>
      /** * 打开取消绑定 指定账户 的确认框，下方值替换到payload * AuthorizerType.DISCORD,
      AuthorizerType.METAMASK, AuthorizerType.PHANTOM, AuthorizerType.MARTIAN */
      <button
        onClick={() =>
          dispatchModal({
            type: WlUserModalType.UNBIND_CONFIRM,
            payload: AuthorizerType.TWITTER,
          })
        }
      >
        打开取消绑定 twitter 的确认框
      </button>
      <button
        onClick={() => dispatchModal({ type: WlUserModalType.EDIT_PROFILE })}
      >
        打开编辑 用户profile 信息的modal
      </button>
      <h2>
        {' '}
        使用dispatchAction，直接触发数据的变更行为 ————————————————————————————————————————
      </h2>
      /** * 触发登录流程 * 下方值替换到payload * AuthorizerType.DISCORD, AuthorizerType.METAMASK,
      AuthorizerType.PHANTOM, AuthorizerType.MARTIAN */
      <button
        onClick={() =>
          dispatchAction({
            type: WlUserActionType.LOGIN,
            payload: AuthorizerType.TWITTER,
          })
        }
      >
        login with twitter
      </button>
      /** * 触发绑定流程 * 下方值替换到payload * AuthorizerType.DISCORD, AuthorizerType.METAMASK,
      AuthorizerType.PHANTOM, AuthorizerType.MARTIAN */
      <button
        onClick={() =>
          dispatchAction({
            type: WlUserActionType.BIND,
            payload: AuthorizerType.TWITTER,
          })
        }
      >
        bind with twitter
      </button>
      /** * 触发解绑 * 下方值替换到payload * AuthorizerType.DISCORD, AuthorizerType.METAMASK,
      AuthorizerType.PHANTOM, AuthorizerType.MARTIAN */
      <button
        onClick={() =>
          dispatchAction({
            type: WlUserActionType.UNBIND,
            payload: AuthorizerType.TWITTER,
          })
        }
      >
        unbind twitter
      </button>
      /** * 更新用户profile信息 */
      <button
        onClick={() =>
          dispatchAction({
            type: WlUserActionType.UPDATE_USER_PROFILE,
            payload: { name: 'zhang san', avatar: 'https://img.xxxxx.jpg' },
          })
        }
      >
        update profile
      </button>
      /** * 退出登录 */
      <button onClick={() => dispatchAction({ type: WlUserActionType.LOGOUT })}>
        logout
      </button>
    </div>
  );
}

export default View;
```

### 工具

- handleAuthFailed

  wl-user-react 内部对于接口 token 认证失效的默认处理手段

  - 内部处理过程
    1. 退出登录: dispatchAction({ type: WlUserActionType.LOGOUT })
    2. 打开登录 modal：dispatchModal({ type: WlUserModalType.LOGIN })
    3. toast 提示：toast.error('authentication failed, log in again!')

  如果需要让当前项目认证失效的反馈与 wl-user-react 处理的一致

  可以导出放到当前项目中使用

  - 案例 1 : 在单个接口中使用

  ```
    import { handleAuthFailed } from '@ecnft/wl-user-react'

    ......

    editApi()
    .then(()=>alert('edit success'))
    .catch((error)=>error.response.status === 401 ? handleAuthFailed() : alert(error.message))
  ```

  - 案例 2 ：注入到项目的 axios 封装中

  ```typescript

  // utils/axiosInstance.ts

  // 当前项目axios处理认证失效
  let handleAuthFailed: () => void | undefined
  export const injectHandleAuthFailed = (func: () => void) => {
    handleAuthFailed = func
  }
  // 添加响应拦截器
  axiosInstance.interceptors.response.use(
    (response) => {
      // 对响应数据做点什么
      return response
    },
    (error) => {
      if (error.response.status === 401) {
        if (handleAuthFailed) handleAuthFailed()
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
  import { injectHandleAuthFailed } from 'utils/axiosInstance.ts'
  injectHandleAuthFailed(handleAuthFailed)

  ```
