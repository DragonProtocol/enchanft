/**
 *Author: ttang
 *Date: 2022-03-23 13:38:27
 *LastEditTime: 2022-03-23 13:59:41
 *LastEditors: ttang
 *Description: 获取当前 NFT 的所属情况
 *FilePath: /app/src/hooks/useBelongTo.ts
 */

import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'

import { BelongTo } from '../synft'
import { useContract } from '../provider/ContractProvider'

export default (mint: string | undefined) => {
  const { contract } = useContract()
  const wallet = useWallet()

  const [loading, setLoading] = useState(true)
  const [belong, setBelong] = useState<BelongTo>({
    me: false,
    program: false,
    parent: null,
  })

  useEffect(() => {
    ;(async () => {
      if (!mint) {
        return
      }
      const mintKey = new PublicKey(mint)
      const data: BelongTo = await contract.checkBelongTo(mintKey)
      setLoading(false)
      setBelong(data)
    })()
  }, [mint, wallet])

  return { belong, loading }
}
