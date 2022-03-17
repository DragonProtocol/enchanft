import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { Contract, MetaInfo } from '../synft'
import { useContract } from '../provider/ContractProvider'

export default (mint: string | undefined) => {
  const { contract } = useContract()

  const [loading, setLoading] = useState(true)
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
