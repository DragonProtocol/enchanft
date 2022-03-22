import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { MetaInfo } from '../synft'
import { useContract } from '../provider/ContractProvider'

/**
 * 获取 MetaInfo
 */
export default (mint: string | undefined) => {
  const { contract } = useContract()

  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useState<MetaInfo | null>(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!mint) return
      const mintKey = new PublicKey(mint)
      const data: MetaInfo | null = await contract.getMetadataInfoWithMint(mintKey)
      setInfo(data)
      setLoading(false)
    })()
  }, [mint])

  return { info, loading }
}
