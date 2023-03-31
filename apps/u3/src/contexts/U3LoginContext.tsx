import { useUs3rProfileContext } from '@us3r-network/profile';
import {
  ReactNode,
  useCallback,
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import { u3login, User } from '../services/api/login';
import {
  removeU3ExtensionCookie,
  setU3ExtensionCookie,
  UserAdaptationCookie,
} from '../utils/cookie';
import { removeHomeBannerHiddenFromStore } from '../utils/homeStore';

interface U3LoginContextValue {
  user: User | null;
  u3IsLogin: boolean;
  u3logout: () => void;
}
export const U3LoginContext = createContext<U3LoginContextValue>({
  user: null,
  u3IsLogin: false,
  u3logout: () => {},
});

export interface U3LoginProviderProps {
  children: ReactNode;
  u3LoginSuccess?: (token: string) => void;
}

let needU3Login = true;
export default function U3LoginProvider({
  children,
  u3LoginSuccess,
}: U3LoginProviderProps) {
  const { sessId, us3rAuth, us3rAuthValid } = useUs3rProfileContext();
  const didSessionStr = useMemo(() => {
    return us3rAuthValid && sessId ? us3rAuth.session.serialize() : '';
  }, [us3rAuthValid, sessId, us3rAuth]);

  const [user, setUser] = useState<User | null>(null);
  const u3IsLogin = useMemo(() => !!user?.token, [user]);

  useEffect(() => {
    if (user && user?.token && (user as UserAdaptationCookie).tokenExpiresAt) {
      setU3ExtensionCookie(user);
    }
  }, [user]);

  // us3r 登录后，登录u3
  useEffect(() => {
    if (!!didSessionStr && !u3IsLogin && needU3Login) {
      needU3Login = false;
      u3login(didSessionStr).then((resp) => {
        setUser({ ...resp.data, token: didSessionStr });
        u3LoginSuccess(didSessionStr);
      });
    }
  }, [didSessionStr, u3IsLogin, u3LoginSuccess]);

  // u3退出登录
  const u3logout = useCallback(() => {
    setUser(null);
    removeHomeBannerHiddenFromStore();
    removeU3ExtensionCookie();
    needU3Login = true;
  }, []);

  return (
    <U3LoginContext.Provider
      value={useMemo(
        () => ({
          user,
          u3IsLogin,
          u3logout,
        }),
        [user, u3IsLogin, u3logout]
      )}
    >
      {children}
    </U3LoginContext.Provider>
  );
}

export function useU3Login() {
  const context = useContext(U3LoginContext);
  if (!context) {
    throw Error(
      'useU3Login can only be used within the U3LoginProvider component'
    );
  }
  return context;
}