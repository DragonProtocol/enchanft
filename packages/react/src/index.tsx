import React, { createContext, useContext, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import SynftContract from "@jsrsc/synft-js-core";

export interface SynftContextData {
  synftContract: SynftContract;
}

export const SynftContractContext = createContext<SynftContextData | null>(
  null
);

type Props = {
  children: React.ReactNode;
  connection?: Connection;
};

export const Provider = ({ children, connection }: Props) => {
  const connectionCtx = useConnection();
  const conn = connection || connectionCtx.connection;
  const synftContract = useMemo(() => {
    return new SynftContract(conn);
  }, [conn]);

  return (
    <SynftContractContext.Provider value={{ synftContract }}>
      {children}
    </SynftContractContext.Provider>
  );
};

export function useSynftContract() {
  const ctx = useContext(SynftContractContext);
  if (!ctx) {
    throw new Error("SynftContract not valid");
  }
  return ctx;
}
