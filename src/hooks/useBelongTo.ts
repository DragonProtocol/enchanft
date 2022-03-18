import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { BelongTo } from '../synft'
import { useContract } from '../provider/ContractProvider'

export default (mint: string | undefined) => {
  const { contract } = useContract()

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
      const data = await contract.checkBelongTo(mintKey)
      setLoading(false)
      setBelong(data)
    })()
  }, [mint])

  return { belong, loading }
}
