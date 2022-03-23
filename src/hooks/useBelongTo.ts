import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'

import { BelongTo } from '../synft'
import { useContract } from '../provider/ContractProvider'

/**
 * 获取 mint 的所属情况
 */
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
