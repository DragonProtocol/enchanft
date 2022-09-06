import React, { useState, useEffect, useRef, useContext } from 'react';
import { sleep } from "../utils";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

/** Manage WalletConnect */
import WalletConnectProvider from "@walletconnect/web3-provider";

/** Render a connect button that can be used to connect to Ceramic using the Orbis SDK */
export function ConnectButton() {
  const { user, setUser, groups, setGroups, orbis } = useContext(GlobalContext);
  const [status, setStatus] = useState(0);

  /** Returns a valid provider to use to connect the user's wallet */
  async function getProvider() {
    let provider = null;

    if(window.ethereum) {
      provider = window.ethereum;

      /** Return provider to use */
      return provider;
    } else {
      /** Create WalletConnect Provider */
      provider = new WalletConnectProvider({
        infuraId: "9bf71860bc6c4560904d84cd241ab0a0",
      });

      /** Enable session (triggers QR Code modal) */
      await provider.enable();

      /** Return provider to use */
      return provider;
    }
  }

  /** Call the Orbis SDK to connect to Ceramic */
  async function connect() {
    /** Show loading state */
    setStatus(1);

    /** Connect using an Ethereum provider */
    let provider = await getProvider();
    let res = await orbis.connect(provider);

    /** Parse result and update status */
    switch (res.status) {
      case 200:
        setStatus(2);

        /** Save user details returned by the connect function in state */
        console.log("Connected to Ceramic: ", res);
        setUser(res.details);

        break;
      default:
        console.log("Couldn't connect to Ceramic: ", res.error.message);
        setStatus(3);

        /** Wait for 2 seconds before resetting the button */
        await sleep(2000);
        setStatus(0);
    }

  }

  /** Load user details from indexer */
  async function getUserDetails(did) {
      let { data, error, status } = await orbis.getProfile(did);

      /** Returns error if any */
      if(error) {
        return {
          status: 300,
          result: "Error retrieving user details.",
          error: error
        }
      }

      /** Returns user details */
      return {
        status: 200,
        result: data
      }
  }

  /** Display button according to its status */
  switch (status) {
    case 0:
      return <button className="btn md purple pointer" onClick={() => connect()}>Connect</button>;
    case 1:
      return <button className="btn md  transparent-dashed">Loading...</button>;
    case 2:
      return <button className="btn md  green">Success</button>;
    case 3:
      return <button className="btn md  red">Error</button>

  }
}
