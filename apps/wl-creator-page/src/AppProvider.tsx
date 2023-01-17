import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { TokenType } from './utils/token';
import log from 'loglevel';

import {
  usePermissions,
  useWlUserReact,
  WlUserActionType,
} from '@ecnft/wl-user-react';
import { User } from '@ecnft/wl-user-react';

export type SignMsgResult = {
  walletType: TokenType;
  pubkey: string;
  signature: string;
  payloadMsg?: string;
};

export enum RoleType {
  CREATOR = 'CREATOR',
  COLLECTOR = 'COLLECTOR',
}

type AppAccount = {
  info: User | null;
};
export interface AppContextData {
  account: AppAccount;
  updateAccount: (arg0: any) => void;
  validLogin: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  isVIP: boolean;
}

const DefaultAccount: AppAccount = {
  info: null,
};

const DefaultCtxData: AppContextData = {
  validLogin: false,
  account: DefaultAccount,
  updateAccount: (arg0: any) => {},
  isCreator: false,
  isAdmin: false,
  isVIP: false,
};

export const AppContext = createContext<AppContextData>(DefaultCtxData);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const { user, isLogin, dispatchAction } = useWlUserReact();

  const [account, setAccount] = useState<AppAccount>({
    info: { ...user },
  });

  const { isCreator, isAdmin, isVIP } = usePermissions();

  useEffect(() => {
    setAccount({ info: { ...user } });
  }, [user]);

  log.debug('account', user);

  return (
    <AppContext.Provider
      value={{
        ...DefaultCtxData,
        validLogin: isLogin,
        account,
        isCreator,
        isAdmin,
        isVIP,
        updateAccount: (newAccount) => {
          setAccount({ ...account, ...newAccount });
          if (!newAccount.info) {
            dispatchAction({ type: WlUserActionType.LOGOUT });
          }
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppConfig() {
  const context = useContext(AppContext);
  return { ...context };
}
