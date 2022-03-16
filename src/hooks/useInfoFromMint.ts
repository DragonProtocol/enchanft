import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { Contract, MetaInfo } from '../synft'
import { getMetadataFromMint } from '../features/info/infoOps'

export default (mint: string | undefined, contract: Contract) => {
  const [loading, setLoading] = useState(true)
  // TODO: any 解决
  const [info, setInfo] = useState<MetaInfo | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!mint) return
      const mintKey = new PublicKey(mint)
      const data = await contract.getMetadataWithMint(mintKey)
      setLoading(false)
      setInfo(data)
    })()
  }, [mint])

  return { info, loading }
}
