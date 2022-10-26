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
  tokenTypeToChainType,
} from '../utils/token';
import IconClose from './Icons/IconClose';
import IconMartian from './Icons/IconMartian';
import IconPhantomWhite from './Icons/IconPhantomWhite';
import PngIconCongratulate from './Icons/PngIconCongratulate';
import PngIconMetaMask from './Icons/PngIconMetaMask';
import AvatarDefault from './imgs/avatar.png';

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
    martianValid,
    getPhantomAddr,
    getMetaMaskAddr,
    getMartianAddr,
    signMsgWithPhantom,
    signMsgWithMetaMask,
    signMsgWithMartian,
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
  const [loginErr, setLoginErr] = useState(false);

  const signerRef = useRef<() => Promise<any>>();
  const signerWithLogin = useRef<boolean>(false);

  const loginWithSign = useCallback(
    async (data: SignMsgResult) => {
      let type = tokenTypeToChainType(data.walletType);

      const loginData = {
        signature: data.signature,
        payload: data.payloadMsg ? data.payloadMsg : SIGN_MSG,
        pubkey: data.pubkey,
        type: type as ChainType,
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
      console.log('signer', login, data);
      if (!data) {
        return;
      }
      setSigning(false);
      let token = '';
      if (login) {
        setLoading(true);
        token = await loginWithSign(data);
        if (!token) {
          return;
        }
      }
      return { ...data, token };
    },
    [loginWithSign]
  );

  const connectPhantom = useCallback(async () => {
    const pubkey = await getPhantomAddr();
    if (!pubkey) return;
    if (account.lastLoginType === TokenType.Solana) {
      const result = await signMsgLogin(signMsgWithPhantom, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    } else {
      setShowNewAccountBtn(true);
      setNewAccountWith(TokenType.Solana);
    }
  }, [account.lastLoginType, getPhantomAddr, signMsgLogin, signMsgWithPhantom]);

  const connectMetamask = useCallback(async () => {
    const pubkey = await getMetaMaskAddr();
    if (!pubkey) return;
    if (account.lastLoginType === TokenType.Ethereum) {
      const result = await signMsgLogin(signMsgWithMetaMask, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    } else {
      setShowNewAccountBtn(true);
      setNewAccountWith(TokenType.Ethereum);
    }
  }, [
    account.lastLoginType,
    getMetaMaskAddr,
    signMsgLogin,
    signMsgWithMetaMask,
  ]);

  const connectMartian = useCallback(async () => {
    console.log('connectMartian');
    const pubkey = await getMartianAddr();
    if (!pubkey) return;
    if (account.lastLoginType === TokenType.Aptos) {
      const result = await signMsgLogin(signMsgWithMartian, true);
      console.log({ result });
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    } else {
      setShowNewAccountBtn(true);
      setNewAccountWith(TokenType.Aptos);
    }
  }, [account.lastLoginType, getMartianAddr, signMsgLogin, signMsgWithMartian]);

  const createNewAccount = useCallback(async () => {
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetaMaskAddr();
      if (!pubkey) return;
      const result = await signMsgLogin(signMsgWithMetaMask, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr();
      if (!pubkey) return;
      const result = await signMsgLogin(signMsgWithPhantom, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    }

    if (newAccountWith === TokenType.Aptos) {
      const pubkey = await getMartianAddr();
      if (!pubkey) return;
      const result = await signMsgLogin(signMsgWithMartian, true);
      if (result) {
        setLoading(false);
        setWelcome(true);
      } else {
        setLoginErr(true);
      }
    }
  }, [
    getMartianAddr,
    getMetaMaskAddr,
    getPhantomAddr,
    newAccountWith,
    signMsgLogin,
    signMsgWithMartian,
    signMsgWithMetaMask,
    signMsgWithPhantom,
  ]);

  const linkAccountProcess = useCallback(async (data: any, token: string) => {
    try {
      await linkAccount(data, token);
      toast.success('link account success');
    } catch (error) {
      // setLinkErr(true);
      toast.error('link account error');
    } finally {
      setLoading(false);
      setWelcome(true);
    }
  }, []);

  const loginWithLastLogin = useCallback(async () => {
    console.log({ newAccountWith });
    if (newAccountWith === TokenType.Ethereum) {
      const pubkey = await getMetaMaskAddr();
      if (!pubkey) return;

      let data;
      if (account.lastLoginType === TokenType.Aptos) {
        data = await signMsgLogin(signMsgWithMartian, true);
      }
      if (account.lastLoginType === TokenType.Solana) {
        data = await signMsgLogin(signMsgWithPhantom, true);
      }

      if (!data?.token) return;

      const newData = await signMsgLogin(signMsgWithMetaMask);
      if (!newData) return;

      let type = tokenTypeToChainType(newData.walletType);
      if (!type) return;

      await linkAccountProcess(
        {
          type,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: newData.payloadMsg ?? SIGN_MSG,
        },
        data.token
      );
    }
    if (newAccountWith === TokenType.Solana) {
      const pubkey = await getPhantomAddr();
      if (!pubkey) return;

      let data;
      if (account.lastLoginType === TokenType.Aptos) {
        data = await signMsgLogin(signMsgWithMartian, true);
      }
      if (account.lastLoginType === TokenType.Ethereum) {
        data = await signMsgLogin(signMsgWithMetaMask, true);
      }
      if (!data?.token) return;

      const newData = await signMsgLogin(signMsgWithPhantom);
      console.log('newData', newData);
      if (!newData) return;

      let type = tokenTypeToChainType(newData.walletType);
      console.log({ type }, newData);
      if (!type) return;

      await linkAccountProcess(
        {
          type,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: newData.payloadMsg ?? SIGN_MSG,
        },
        data.token
      );
    }

    if (newAccountWith === TokenType.Aptos) {
      const pubkey = await getMartianAddr();
      if (!pubkey) return;

      let data;
      if (account.lastLoginType === TokenType.Solana) {
        data = await signMsgLogin(signMsgWithPhantom, true);
      }
      if (account.lastLoginType === TokenType.Ethereum) {
        data = await signMsgLogin(signMsgWithMetaMask, true);
      }
      if (!data?.token) return;

      const newData = await signMsgLogin(signMsgWithMartian);
      if (!newData) return;

      let type = tokenTypeToChainType(newData.walletType);
      if (!type) return;

      await linkAccountProcess(
        {
          type,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: newData.payloadMsg ?? SIGN_MSG,
        },
        data.token
      );
    }
  }, [
    account.lastLoginType,
    getMartianAddr,
    getMetaMaskAddr,
    getPhantomAddr,
    linkAccountProcess,
    newAccountWith,
    signMsgLogin,
    signMsgWithMartian,
    signMsgWithMetaMask,
    signMsgWithPhantom,
  ]);

  const reSign = useCallback(async () => {
    setSignErr(false);
    setLinkErr(false);
    if (!signerRef.current) return;
    const data = await signMsgLogin(signerRef.current, signerWithLogin.current);

    // console.log('reSign', signerWithLogin.current, data);
    // console.log('newAccountWith', newAccountWith);
    if (!data) return;
    if (signerWithLogin.current === true) {
      let newData;
      if (newAccountWith === TokenType.Solana) {
        newData = await signMsgLogin(signMsgWithPhantom);
      }
      if (newAccountWith === TokenType.Ethereum) {
        newData = await signMsgLogin(signMsgWithMetaMask);
      }
      if (newAccountWith === TokenType.Aptos) {
        newData = await signMsgLogin(signMsgWithMartian);
      }
      if (!newData) return;
      let type = tokenTypeToChainType(newData.walletType);
      if (!type) return;

      await linkAccountProcess(
        {
          type,
          signature: newData.signature,
          pubkey: newData.pubkey,
          payload: newData.payloadMsg ?? SIGN_MSG,
        },
        data.token
      );
    }
    if (signerWithLogin.current === false) {
      let type = tokenTypeToChainType(data.walletType);
      if (!type || !account.info?.token) return;
      await linkAccountProcess(
        {
          type,
          signature: data.signature,
          pubkey: data.pubkey,
          payload: data.payloadMsg ?? SIGN_MSG,
        },
        account.info?.token
      );
    }
  }, [
    signMsgLogin,
    newAccountWith,
    linkAccountProcess,
    signMsgWithPhantom,
    signMsgWithMetaMask,
    signMsgWithMartian,
    account.info?.token,
  ]);

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
      <div
        onClick={connectMartian}
        className={martianValid ? 'martian' : 'martian invalid'}
      >
        <div className="btn">
          <IconMartian />
          <p>Martian</p>
        </div>
        <p className="last-time">
          {account.lastLoginType === TokenType.Aptos ? `(Last Time)` : ''}
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

  if (newAccountWith === TokenType.Aptos) {
    walletElem = (
      <div className="martian-select">
        <div>
          <IconMartian />
        </div>
        <p>Martian</p>
      </div>
    );
  }

  if (loginErr) {
    return (
      <ModalBox>
        <h3>Login Fail</h3>
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
        <p>Login</p>
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
            Continue With Another Account
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
  width: 484px;
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
    & > .martian-select,
    & > .metamask-select,
    & > .phantom-select {
      height: 120px;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      > div {
        box-sizing: border-box;
        height: 66px;
        border-radius: 8px;
        padding: 8px;
      }
      > p {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
      }
    }
    & > .martian-select {
      > div {
        background-color: #222;
      }
    }
  }
  & .wallet {
    display: flex;
    gap: 20px;
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
      height: 120px;
      padding: 10px;
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

    > div.martian {
      border-radius: 10px;
      background: #222;
      box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25),
        inset 0px -4px 0px rgba(0, 0, 0, 0.25);
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
      width: 100%;
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
