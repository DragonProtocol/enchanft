import { useCallback, useRef, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { ChainType, linkAccount, login } from '../api';
import { SignMsgResult, useAppConfig } from '../AppProvider';
import {
  DEFAULT_WALLET,
  LAST_LOGIN_AVATAR,
  LAST_LOGIN_NAME,
  LAST_LOGIN_PUBKEY,
  LAST_LOGIN_ROLES,
  LAST_LOGIN_TOKEN,
  LAST_LOGIN_TYPE,
  SIGN_MSG,
  TokenType,
} from '../utils/token';
import IconClose from './Icons/IconClose';
import IconPhantomWhite from './Icons/IconPhantomWhite';
import PngIconCongratulate from './Icons/PngIconCongratulate';
import PngIconMetaMask from './Icons/PngIconMetaMask';
import AvatarDefault from './imgs/avatar.png';

Modal.setAppElement('#connect-wallet-modal');
export default function ConnectModal({
  show,
  closeModal,
}: {
  show: boolean;
  closeModal: () => void;
}) {
  return (
    <Modal
      isOpen={show}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyItems: 'center',
          backdropFilter: 'blur(12px)',
        },

        content: {
          margin: '0 auto',
          padding: '0px',
          position: 'initial',
          inset: 'unset',
          border: 'none',

          background: '#F7F9F1',
          borderRadius: '20px',
          boxSizing: 'border-box',
        },
      }}
    >
      <ModalContent closeModal={closeModal} />
    </Modal>
  );
}

function ModalContent({ closeModal }: { closeModal: () => void }) {
  const {
    phantomValid,
    metaMaskValid,
    getPhantomAddr,
    getMetaMaskAddr,
    signMsgWithPhantom,
    signMsgWithMetaMask,
    updateAccount,
    account,
  } = useAppConfig();

  const [showNewAccountBtn, setShowNewAccountBtn] = useState(false);
  const [newAccountWith, setNewAccountWith] = useState<TokenType>();

  const [signing, setSigning] = useState(false);
  const [signErr, setSignErr] = useState(false);
  const [linkErr, setLinkErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState(false);

  const signerRef = useRef<() => Promise<any>>();
  const signerWithLogin = useRef<boolean>(false);

  const loginWithSign = useCallback(
    async (data: SignMsgResult) => {
      const loginData = {
        signature: data.signature,
        payload: SIGN_MSG,
        pubkey: data.pubkey,
        type:
          data.walletType === TokenType.Solana
            ? ChainType.SOLANA
            : ChainType.EVM,
      };
      try {
        const resp = await login(loginData);
        localStorage.setItem(LAST_LOGIN_TYPE, data.walletType);
        localStorage.setItem(LAST_LOGIN_AVATAR, resp.data.avatar);
        localStorage.setItem(LAST_LOGIN_NAME, resp.data.name);
        localStorage.setItem(LAST_LOGIN_TOKEN, resp.data.token);
        localStorage.setItem(DEFAULT_WALLET, data.walletType);
        localStorage.setItem(LAST_LOGIN_PUBKEY, data.pubkey);
        localStorage.setItem(LAST_LOGIN_ROLES, JSON.stringify(resp.data.roles));
        updateAccount({
          info: {
            walletType: data.walletType,
            pubkey: data.pubkey,
            ...resp.data,
          },
          lastLoginInfo: {
            avatar: resp.data.avatar,
            name: resp.data.name,
          },
          lastLoginType: data.walletType,
          lastLoginToken: resp.data.token,
        });
        return resp.data.token;
      } catch (error) {
        return '';
      }
    },
    [updateAccount]
  );

  const signMsgLogin = useCallback(
    async (signer: () => Promise<SignMsgResult | undefined>, login = false) => {
      signerRef.current = signer;
      signerWithLogin.current = login;

      let data;
      try {
        setSigning(true);
        data = await signer();
      } catch (error) {
        setSignErr(true);
        return;
      }
      if (!data) {
        return;
      }
      setSigning(false);
      let token = '';
      if (login) {
        setLoading(true);
        try {
          token = await loginWithSign(data);
        } catch (error) {
          toast.error('login error');
          return null;
        }
      }
      return { ...data, token };
    },
    [loginWithSign]
  );

  const connectPhantom = useCallback(async () => {
    const pubkey = await getPhantomAddr();
    if (!pubkey) return;
    if (account.lastLoginType === TokenType.Ethereum) {
      setShowNewAccountBtn(true);
      setNewAccountWith(TokenType.Solana);
    } else {
      const result = await signMsgLogin(signMsgWithPhantom, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      }
    }
  }, [account.lastLoginType, getPhantomAddr, signMsgLogin, signMsgWithPhantom]);

  const connectMetamask = useCallback(async () => {
    const pubkey = await getMetaMaskAddr();
    if (!pubkey) return;
    if (account.lastLoginType === TokenType.Solana) {
      setShowNewAccountBtn(true);
      setNewAccountWith(TokenType.Ethereum);
    } else {
      const result = await signMsgLogin(signMsgWithMetaMask, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      }
    }
  }, [
    account.lastLoginType,
    getMetaMaskAddr,
    signMsgLogin,
    signMsgWithMetaMask,
  ]);

  const createNewAccount = useCallback(async () => {
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetaMaskAddr();
      if (!pubkey) return;
      const result = await signMsgLogin(signMsgWithMetaMask, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      }
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr();
      if (!pubkey) return;
      const result = await signMsgLogin(signMsgWithPhantom, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      }
    }
  }, [
    getMetaMaskAddr,
    getPhantomAddr,
    newAccountWith,
    signMsgLogin,
    signMsgWithMetaMask,
    signMsgWithPhantom,
  ]);

  const loginWithLastLogin = useCallback(async () => {
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetaMaskAddr();
      if (!pubkey) return;

      const data = await signMsgLogin(signMsgWithPhantom, true);
      if (!data?.token) return;

      const newData = await signMsgLogin(signMsgWithMetaMask);
      if (!newData) return;

      try {
        await linkAccount(
          {
            type:
              newData.walletType === TokenType.Solana
                ? ChainType.SOLANA
                : ChainType.EVM,
            signature: newData.signature,
            pubkey: newData.pubkey,
            payload: SIGN_MSG,
          },
          data.token
        );
        toast.success('link account success');
      } catch (error) {
        // setLinkErr(true);
        toast.error('link account error');
      } finally {
        setLoading(false);
        setWelcome(true);
      }
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr();
      if (!pubkey) return;

      const data = await signMsgLogin(signMsgWithMetaMask, true);
      if (!data?.token) return;

      const newData = await signMsgLogin(signMsgWithPhantom);
      if (!newData) return;
      try {
        await linkAccount(
          {
            type:
              newData.walletType === TokenType.Solana
                ? ChainType.SOLANA
                : ChainType.EVM,
            signature: newData.signature,
            pubkey: newData.pubkey,
            payload: SIGN_MSG,
          },
          data.token
        );
        toast.success('link account success');
      } catch (error) {
        // setLinkErr(true);
        toast.error('link account error');
      } finally {
        setLoading(false);
        setWelcome(true);
      }
    }
  }, [
    getMetaMaskAddr,
    getPhantomAddr,
    newAccountWith,
    signMsgLogin,
    signMsgWithMetaMask,
    signMsgWithPhantom,
  ]);

  const reSign = async () => {
    setSignErr(false);
    if (!signerRef.current) return;
    await signMsgLogin(signerRef.current, signerWithLogin.current);
  };

  // console.log(account);

  let walletElem = (
    <>
      <div
        onClick={connectPhantom}
        className={phantomValid ? 'phantom' : 'phantom invalid'}
      >
        <div className="btn">
          <IconPhantomWhite />
          <p>Phantom</p>
        </div>
        <p className="last-time">
          {account.lastLoginType === TokenType.Solana ? `(Last Time)` : ''}
        </p>
      </div>
      <div
        onClick={connectMetamask}
        className={metaMaskValid ? 'metamask' : 'metamask invalid'}
      >
        <div className="btn">
          <PngIconMetaMask />
          <p>MetaMask</p>
        </div>
        <p className="last-time">
          {account.lastLoginType === TokenType.Ethereum ? `(Last Time)` : ''}
        </p>
      </div>
    </>
  );

  if (newAccountWith === TokenType.Solana) {
    walletElem = (
      <div className="phantom-select">
        <div>
          <IconPhantomWhite />
        </div>
        <p>Solana</p>
      </div>
    );
  }
  if (newAccountWith === TokenType.Ethereum) {
    walletElem = (
      <div className="metamask-select">
        <div>
          <PngIconMetaMask />
        </div>
        <p>MetaMask</p>
      </div>
    );
  }

  if (signing) {
    if (signErr) {
      return (
        <ModalBox>
          <h3>❌ Signature Rejected</h3>
          <p>Please sign the message in your wallet to login.</p>
          <div className="btns">
            <button
              className="close"
              onClick={() => {
                setSignErr(false);
                setSigning(false);
              }}
            >
              Close
            </button>
            <button className="retry" onClick={reSign}>
              Retry
            </button>
          </div>
        </ModalBox>
      );
    }
    return (
      <ModalBox>
        <h3>🕹 Signature Request</h3>
        <p>
          Please sign the message in your wallet to login WL, we use this
          signature to verify that you‘re the owner.
        </p>
      </ModalBox>
    );
  }
  if (linkErr) {
    return (
      <ModalBox>
        <h3>Link Account Fail</h3>
        <div className="btns">
          <button
            className="close"
            onClick={() => {
              closeModal();
            }}
          >
            Close
          </button>
        </div>
      </ModalBox>
    );
  }
  if (loading) {
    return (
      <ModalBox>
        <h3>⏳ Loading</h3>
        <p>Logging in now, Please wait...</p>
      </ModalBox>
    );
  }
  if (welcome) {
    setTimeout(closeModal, 2000);
    return (
      <ModalBox className="welcome">
        <div>
          <PngIconCongratulate />
          <h3>Signature Successed!</h3>
          <p>😊 Welcome to WL! 😊</p>
        </div>
      </ModalBox>
    );
  }
  return (
    <ConnectBox>
      <div className="title">
        <p>Connect Wallet</p>
        <button title="close-modal" onClick={closeModal}>
          <IconClose size="18px" />
        </button>
      </div>
      <div className="wallet">{walletElem}</div>

      {showNewAccountBtn && (
        <div className="new-account">
          <button className="last" onClick={() => loginWithLastLogin()}>
            Connect With{' '}
            <img src={account.lastLoginInfo.avatar || AvatarDefault} alt="" />{' '}
            {account.lastLoginInfo.name}
          </button>
          <button className="new" onClick={createNewAccount}>
            Create New Account
          </button>
        </div>
      )}
    </ConnectBox>
  );
}

const ConnectBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  width: 384px;
  box-sizing: border-box;
  /* border-radius: 10px; */
  & .title {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    > p {
      margin: 0;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #333333;
    }
  }
  & .wallet {
    & > .phantom-select {
      > div {
        padding: 4px 6px 0 6px;
        border-radius: 10px;
        background: #551ff4;
      }
    }
    & > .metamask-select,
    & > .phantom-select {
      height: 120px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      > p {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
      }
    }
  }
  & .wallet {
    display: flex;
    justify-content: space-between;
    > div.invalid {
      background-color: lightgray;
      cursor: not-allowed;
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      width: 160px;
      height: 160px;
      /* padding: 10px; */
      text-align: center;
      color: #fff;
      cursor: pointer;
      position: relative;

      & svg {
        width: 50px;
        height: 50px;
      }
      & p {
        margin: 10px;
      }

      & div.btn {
        & p {
          margin: 0;
          font-weight: 700;
          font-size: 18px;
          line-height: 27px;
          color: #ffffff;
        }
      }

      & p.last-time {
        margin: 0;
        position: absolute;
        bottom: 12px;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #ffffff;
      }
    }

    > div.phantom {
      border-radius: 10px;
      background: #551ff4;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25),
        inset 0px -4px 0px rgba(0, 0, 0, 0.25);
    }
    > div.metamask {
      border-radius: 10px;
      background: #f6851b;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25),
        inset 0px -4px 0px rgba(0, 0, 0, 0.25);
      & svg,
      & img {
        width: 50px;
        height: 50px;
        padding: 3px;
        background-color: #fff;
        border-radius: 50%;
      }
    }
  }
  & .new-account {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 20px;
    > button {
      border: none;
      outline: none;
      margin: 5px auto;
      cursor: pointer;
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      width: 344px;
      height: 48px;
    }

    > button.last {
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      color: #ffffff;

      > img {
        width: 20px;
        height: 20px;
        vertical-align: text-top;
      }
    }

    > button.new {
      background: #ebeee4;
      color: #333333;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    }
  }
`;

// const HelpBtn = styled(Button)`
//   background-color: #3dd606;
//   text-transform: none;
//   &:hover {
//     background-color: #3dd606;
//   }
// `

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  width: 540px;
  & h3 {
    margin: 0;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }
  & p {
    margin: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
  }

  & .btns {
    display: flex;
    gap: 20px;
    justify-content: end;
    & button {
      padding: 10px 18px;
      gap: 10px;
      width: 120px;
      height: 48px;
      outline: none;
      border: none;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
    & .close {
      background: #ebeee4;
      color: #333333;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }

    & .retry {
      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
  }

  &.welcome {
    background: #fffbdb;
    padding: 40px 20px;
    text-align: center;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      & img {
        width: 120px;
        height: 120px;
      }
    }
  }
`;
