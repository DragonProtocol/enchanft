import React, { createContext, useContext, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import SynftContract from "@enchanft/js-sdk-core";

export {
  SynftSeed,
  PROGRAM_ID as SYNFT_PROGRAM_ID,
} from "@enchanft/js-sdk-core";

export interface SynftContextData {
  synftContract: SynftContract;
}

export const SynftContractContext = createContext<SynftContextData | null>(
  null
);

type Props = {
  children: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  const connectionCtx = useConnection();
  const conn = connectionCtx.connection;
  const synftContract = useMemo(() => {
    const instance = new SynftContract(conn);
    console.log("synft instance", instance, conn);
    return instance;
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
