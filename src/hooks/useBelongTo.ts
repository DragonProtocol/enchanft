import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { Contract, BelongTo } from '../synft'
import { getMetadataFromMint } from '../features/info/infoOps'

export default (mint: string | undefined, contract: Contract) => {
  const [loading, setLoading] = useState(true)
  // TODO: any 解决
  const [belong, setBelong] = useState<BelongTo | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!mint) return
      const mintKey = new PublicKey(mint)
      const data = await contract.checkBelongTo(mintKey)
      setLoading(false)
      setBelong(data)
    })()
  }, [mint])

  return { belong, loading }
}
