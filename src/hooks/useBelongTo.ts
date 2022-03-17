import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import type { Node as TreeNode } from '../synft'
import { Contract, BelongTo } from '../synft'
import { useContract } from '../provider/ContractProvider'

export default (mint: string | undefined, injectTree: TreeNode) => {
  const { contract } = useContract()

  const [loading, setLoading] = useState(true)
  const [belong, setBelong] = useState<BelongTo>({
    me: false,
    program: false,
  })

  useEffect(() => {
    ;(async () => {
      if (!mint) {
        return
      }
      const mintKey = new PublicKey(mint)
      const data = await contract.checkBelongTo(mintKey, injectTree)
      setLoading(false)
      setBelong(data)
    })()
  }, [mint, injectTree])

  return { belong, loading }
}
