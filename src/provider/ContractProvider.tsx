import React, { createContext, useState, useContext, FC, useEffect, useMemo } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'

import { Contract } from '../synft'

const instance = Contract.getInstance()

export interface ContextData {
  contract: Contract
}

export const contextDefaultValue: ContextData = {
  contract: instance,
}
export const ContractContext = createContext<ContextData>(contextDefaultValue)

export const useContract = () => useContext(ContractContext)

type Props = {
  children: React.ReactNode
}

export default ({ children }: Props) => {
  const { connection } = useConnection()

  console.log(connection)
  const memoizedValue = useMemo(() => {
    instance.setConnection(connection)
    return { contract: instance }
  }, [connection])

  return <ContractContext.Provider value={memoizedValue}>{children}</ContractContext.Provider>
}
