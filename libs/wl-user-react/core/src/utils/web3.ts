/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-12 19:41:03
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-12 20:07:49
 * @Description: file description
 */
import bs58 from 'bs58';
import { ethers } from 'ethers';
export const web3Window: typeof window & {
  ethereum?: any;
  solana?: any;
  martian?: any;
} = window;
export type SignMsgResult = {
  signature: string;
  signMsg: string;
  pubkey: string;
};
export const SIGN_MSG =
  'Sign this message to sign into ' + window.location.hostname;
// evm
export async function getEthProvider() {
  if (web3Window.ethereum) {
    const provider = new ethers.providers.Web3Provider(web3Window.ethereum);
    await provider.send('eth_requestAccounts', []);
    return provider;
  } else {
    return null;
  }
}
export async function getMetaMaskAddr() {
  const ethProvider = await getEthProvider();
  if (!ethProvider) return;
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  return walletAddr;
}

export async function signMsgWithMetaMask(): Promise<
  SignMsgResult | undefined
> {
  const ethProvider = await getEthProvider();
  if (!ethProvider) return;
  const signer = ethProvider.getSigner();
  const walletAddr = await signer.getAddress();
  const signature = await signer.signMessage(SIGN_MSG);
  return { pubkey: walletAddr, signature, signMsg: SIGN_MSG };
}

// solana
export async function getSolanaProvider() {
  if (web3Window.solana) {
    await web3Window.solana.connect(); // opens wallet to connect to

    const provider = web3Window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  } else {
    return null;
  }
}
export async function getPhantomAddr() {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) return;
  const pubkey = solanaProvider.publicKey;
  return pubkey.toString();
}
export async function signMsgWithPhantom(): Promise<SignMsgResult | undefined> {
  const solanaProvider = await getSolanaProvider();
  if (!solanaProvider) return;
  const pubkey = solanaProvider.publicKey;
  const { signature: signatureBuf } = await solanaProvider.signMessage(
    Buffer.from(SIGN_MSG)
  );
  const signature = bs58.encode(signatureBuf);
  return { pubkey: pubkey.toString(), signature, signMsg: SIGN_MSG };
}

// aptos
export async function getAptosProvider() {
  if (web3Window.martian) {
    await web3Window.martian.connect();
    const provider = web3Window.martian;
    return provider;
  } else {
    return null;
  }
}
export async function getMartianAddr() {
  const provider = await getAptosProvider();
  if (!provider) return;
  const { publicKey } = await provider.account();
  return publicKey.slice(2);
}
export async function signMsgWithMartian(): Promise<SignMsgResult | undefined> {
  const provider = await getAptosProvider();
  if (!provider) return;
  const walletAddr = await getMartianAddr();
  const resp = await provider.signMessage({
    message: SIGN_MSG,
  });
  const { signature } = resp;
  return {
    pubkey: walletAddr,
    signature: signature.slice(2),
    signMsg: resp.fullMessage,
  };
}
